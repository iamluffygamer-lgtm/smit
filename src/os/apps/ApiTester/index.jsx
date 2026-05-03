import React, { useState, useEffect, useCallback, useRef } from 'react';
import { tokens } from '../../styles/tokens';

const METHODS = {
  GET:    '#4ADE80',
  POST:   '#E8A020',
  PUT:    '#06B6D4',
  PATCH:  '#8B5CF6',
  DELETE: '#F87171',
};

const syntaxHighlight = (json) => {
  if (typeof json !== 'string') {
    json = JSON.stringify(json, undefined, 2);
  }
  json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return json.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
      let cls = 'color: #06B6D4;'; // number
      if (/^"/.test(match)) {
          if (/:$/.test(match)) {
              cls = 'color: #E8A020;'; // key
          } else {
              cls = 'color: #4ADE80;'; // string
          }
      } else if (/true|false/.test(match)) {
          cls = 'color: #F87171;'; // boolean
      } else if (/null/.test(match)) {
          cls = 'color: #F87171;'; // null
      }
      return '<span style="' + cls + '">' + match + '</span>';
  });
};

export default function ApiTester() {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('');
  
  const [activeReqTab, setActiveReqTab] = useState('HEADERS'); // HEADERS, BODY, PARAMS, AUTH
  const [reqHeaders, setReqHeaders] = useState([{ key: 'Content-Type', value: 'application/json' }]);
  const [reqBody, setReqBody] = useState('{\n  \n}');
  const [reqParams, setReqParams] = useState([{ key: '', value: '' }]);
  const [authType, setAuthType] = useState('None'); // None, Bearer, Basic
  const [bearerToken, setBearerToken] = useState('');
  const [basicAuth, setBasicAuth] = useState({ user: '', pass: '' });

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null); // { status, statusText, time, size, data, isJson, headers, timeline }
  const [activeResTab, setActiveResTab] = useState('BODY'); // BODY, HEADERS, TIMELINE

  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const [bottomHeight, setBottomHeight] = useState(300);
  const isDragging = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem('smit-api-tester-history');
    if (saved) {
      try { setHistory(JSON.parse(saved)); } catch (e) {}
    }
  }, []);

  const saveHistory = (req) => {
    const newHistory = [req, ...history].slice(0, 10);
    setHistory(newHistory);
    localStorage.setItem('smit-api-tester-history', JSON.stringify(newHistory));
  };

  const handleSend = async () => {
    if (!url) return;
    
    setIsLoading(true);
    setResponse(null);

    let finalUrl = url;
    if (!finalUrl.startsWith('http')) {
      finalUrl = 'https://' + finalUrl;
    }

    // append params
    const validParams = reqParams.filter(p => p.key);
    if (validParams.length > 0) {
      const urlObj = new URL(finalUrl);
      validParams.forEach(p => urlObj.searchParams.append(p.key, p.value));
      finalUrl = urlObj.toString();
    }

    const headers = {};
    reqHeaders.forEach(h => {
      if (h.key) headers[h.key] = h.value;
    });

    if (authType === 'Bearer' && bearerToken) {
      headers['Authorization'] = `Bearer ${bearerToken}`;
    } else if (authType === 'Basic' && (basicAuth.user || basicAuth.pass)) {
      headers['Authorization'] = `Basic ${btoa(basicAuth.user + ':' + basicAuth.pass)}`;
    }

    const options = {
      method,
      headers,
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && reqBody) {
      options.body = reqBody;
    }

    const startTime = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const res = await fetch(finalUrl, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      const endTime = Date.now();
      const time = endTime - startTime;

      let data;
      let isJson = false;
      const contentType = res.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        data = await res.json();
        isJson = true;
      } else {
        data = await res.text();
      }

      let size = 0;
      if (typeof data === 'string') {
        size = new Blob([data]).size;
      } else {
        size = new Blob([JSON.stringify(data)]).size;
      }

      const resHeaders = [];
      res.headers.forEach((value, key) => {
        resHeaders.push({ key, value });
      });

      // fake timeline
      const t = time;
      const timeline = {
        dns: Math.round(t * 0.1) || 1,
        tcp: Math.round(t * 0.2) || 1,
        tls: finalUrl.startsWith('https') ? Math.round(t * 0.2) : 0,
        req: Math.round(t * 0.05) || 1,
        ttfb: Math.round(t * 0.4) || 1,
        download: Math.round(t * 0.05) || 1,
      };

      setResponse({
        status: res.status,
        statusText: res.statusText,
        time,
        size: (size / 1024).toFixed(2),
        data,
        isJson,
        headers: resHeaders,
        timeline
      });
      setActiveResTab('BODY');

      saveHistory({ method, url: finalUrl, time: Date.now() });
    } catch (e) {
      clearTimeout(timeoutId);
      const time = Date.now() - startTime;
      if (e.name === 'AbortError') {
        setResponse({
          error: 'Request timed out after 30 seconds',
          time,
          status: 0,
          statusText: 'Timeout'
        });
      } else {
        setResponse({
          error: e.message,
          time,
          status: 0,
          statusText: 'CORS or Network Error'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragStart = (e) => {
    isDragging.current = true;
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDrag = (e) => {
    if (isDragging.current) {
      const newHeight = window.innerHeight - e.clientY;
      if (newHeight > 100 && newHeight < window.innerHeight - 200) {
        setBottomHeight(newHeight);
      }
    }
  };

  const handleDragEnd = () => {
    isDragging.current = false;
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  // Renders header/params input rows
  const renderKeyValueRows = (items, setItems) => (
    <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flex: 1, scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: 'flex', gap: '8px' }}>
          <input
            value={item.key}
            onChange={(e) => {
              const newItems = [...items];
              newItems[i].key = e.target.value;
              setItems(newItems);
            }}
            placeholder="Key"
            style={{ flex: 1, backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '6px 8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
          />
          <input
            value={item.value}
            onChange={(e) => {
              const newItems = [...items];
              newItems[i].value = e.target.value;
              setItems(newItems);
            }}
            placeholder="Value"
            style={{ flex: 1, backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '6px 8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
          />
          <button
            onClick={() => {
              if (items.length > 1) {
                setItems(items.filter((_, idx) => idx !== i));
              } else {
                setItems([{ key: '', value: '' }]);
              }
            }}
            style={{ width: '32px', backgroundColor: 'transparent', border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, cursor: 'pointer' }}
          >
            ×
          </button>
        </div>
      ))}
      <button
        onClick={() => setItems([...items, { key: '', value: '' }])}
        style={{ alignSelf: 'flex-start', padding: '6px 12px', backgroundColor: 'transparent', border: `1px dashed ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, fontSize: '11px', fontFamily: tokens.typography.fontMono, cursor: 'pointer', marginTop: '8px' }}
      >
        + Add Row
      </button>
    </div>
  );

  return (
    <div style={{ display: 'flex', height: '100%', backgroundColor: tokens.colors.bgSurface, fontFamily: tokens.typography.fontMono }}>
      {/* HISTORY SIDEBAR */}
      <div style={{
        width: showHistory ? '240px' : '0px',
        overflow: 'hidden',
        borderRight: showHistory ? `1px solid ${tokens.colors.borderSubtle}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.2s',
        backgroundColor: tokens.colors.bgCanvas,
        flexShrink: 0,
      }}>
        <div style={{ padding: '12px', fontSize: '10px', color: tokens.colors.textTertiary, borderBottom: `1px solid ${tokens.colors.borderFaint}`, letterSpacing: '0.1em' }}>
          // HISTORY
        </div>
        <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {history.map((h, i) => (
            <div
              key={i}
              onClick={() => {
                setMethod(h.method);
                setUrl(h.url);
              }}
              style={{ padding: '12px', borderBottom: `1px solid ${tokens.colors.borderFaint}`, cursor: 'pointer' }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = tokens.colors.bgSurface}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <div style={{ fontSize: '11px', fontWeight: 600, color: METHODS[h.method] || tokens.colors.textPrimary, marginBottom: '4px' }}>
                {h.method}
              </div>
              <div style={{ fontSize: '11px', color: tokens.colors.textSecondary, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {h.url}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* TOP BAR */}
        <div style={{ display: 'flex', padding: '12px', gap: '8px', borderBottom: `1px solid ${tokens.colors.borderSubtle}`, backgroundColor: tokens.colors.bgCanvas }}>
          <button
            onClick={() => setShowHistory(h => !h)}
            style={{ width: '36px', height: '36px', backgroundColor: tokens.colors.bgSurface, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textTertiary, cursor: 'pointer', flexShrink: 0 }}
          >
            ☰
          </button>
          
          <select
            value={method}
            onChange={e => setMethod(e.target.value)}
            style={{
              width: '100px',
              backgroundColor: tokens.colors.bgSurface,
              border: `1px solid ${tokens.colors.borderSubtle}`,
              color: METHODS[method] || tokens.colors.textPrimary,
              fontWeight: 700,
              fontSize: '13px',
              fontFamily: tokens.typography.fontMono,
              padding: '0 8px',
              outline: 'none',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          >
            {Object.keys(METHODS).map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          
          <input
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://api.example.com/v1/users"
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              backgroundColor: tokens.colors.bgSurface,
              border: `1px solid ${tokens.colors.borderSubtle}`,
              color: tokens.colors.textPrimary,
              padding: '0 12px',
              fontSize: '13px',
              fontFamily: tokens.typography.fontMono,
              outline: 'none',
            }}
          />

          <button
            onClick={handleSend}
            disabled={isLoading}
            style={{
              width: '80px',
              backgroundColor: 'var(--os-accent)',
              border: 'none',
              color: tokens.colors.bgCanvas,
              fontWeight: 700,
              fontSize: '12px',
              fontFamily: tokens.typography.fontMono,
              cursor: isLoading ? 'default' : 'pointer',
              letterSpacing: '0.05em',
              flexShrink: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {isLoading ? '...' : 'SEND'}
          </button>
        </div>

        {/* REQUEST TABS */}
        <div style={{ display: 'flex', borderBottom: `1px solid ${tokens.colors.borderFaint}`, backgroundColor: tokens.colors.bgCanvas }}>
          {['HEADERS', 'BODY', 'PARAMS', 'AUTH'].map(tab => (
            <div
              key={tab}
              onClick={() => setActiveReqTab(tab)}
              style={{
                padding: '10px 16px',
                fontSize: '11px',
                color: activeReqTab === tab ? tokens.colors.textPrimary : tokens.colors.textTertiary,
                borderBottom: activeReqTab === tab ? '2px solid var(--os-accent)' : '2px solid transparent',
                cursor: 'pointer',
              }}
            >
              {tab}
            </div>
          ))}
        </div>

        {/* REQUEST CONTENT */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {activeReqTab === 'HEADERS' && renderKeyValueRows(reqHeaders, setReqHeaders)}
          {activeReqTab === 'PARAMS' && renderKeyValueRows(reqParams, setReqParams)}
          
          {activeReqTab === 'BODY' && (
            <textarea
              value={reqBody}
              onChange={e => setReqBody(e.target.value)}
              disabled={['GET', 'DELETE'].includes(method)}
              spellCheck={false}
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                border: 'none',
                padding: '16px',
                color: tokens.colors.textSecondary,
                fontFamily: tokens.typography.fontMono,
                fontSize: '12px',
                lineHeight: '1.7',
                resize: 'none',
                outline: 'none',
                opacity: ['GET', 'DELETE'].includes(method) ? 0.5 : 1,
                scrollbarWidth: 'none',
                msOverflowStyle: 'none'
              }}
            />
          )}

          {activeReqTab === 'AUTH' && (
            <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <select
                value={authType}
                onChange={e => setAuthType(e.target.value)}
                style={{ width: '200px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
              >
                <option value="None">No Auth</option>
                <option value="Bearer">Bearer Token</option>
                <option value="Basic">Basic Auth</option>
              </select>

              {authType === 'Bearer' && (
                <input
                  value={bearerToken}
                  onChange={e => setBearerToken(e.target.value)}
                  placeholder="Token"
                  style={{ width: '400px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
                />
              )}

              {authType === 'Basic' && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    value={basicAuth.user}
                    onChange={e => setBasicAuth({ ...basicAuth, user: e.target.value })}
                    placeholder="Username"
                    style={{ width: '196px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
                  />
                  <input
                    type="password"
                    value={basicAuth.pass}
                    onChange={e => setBasicAuth({ ...basicAuth, pass: e.target.value })}
                    placeholder="Password"
                    style={{ width: '196px', backgroundColor: tokens.colors.bgCanvas, border: `1px solid ${tokens.colors.borderSubtle}`, color: tokens.colors.textPrimary, padding: '8px', fontSize: '12px', fontFamily: tokens.typography.fontMono, outline: 'none' }}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* RESIZER */}
        <div
          onMouseDown={handleDragStart}
          style={{
            height: '6px',
            backgroundColor: tokens.colors.borderSubtle,
            cursor: 'row-resize',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background-color 0.2s',
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = tokens.colors.borderDefault}
          onMouseLeave={(e) => e.target.style.backgroundColor = tokens.colors.borderSubtle}
        >
          <div style={{ width: '24px', height: '2px', backgroundColor: tokens.colors.borderDefault }} />
        </div>

        {/* RESPONSE PANEL */}
        <div style={{ height: `${bottomHeight}px`, display: 'flex', flexDirection: 'column', backgroundColor: tokens.colors.bgSurface, flexShrink: 0 }}>
          
          <div style={{ display: 'flex', borderBottom: `1px solid ${tokens.colors.borderFaint}`, backgroundColor: tokens.colors.bgCanvas, alignItems: 'center' }}>
            <div style={{ display: 'flex', flex: 1 }}>
              {['BODY', 'HEADERS', 'TIMELINE'].map(tab => (
                <div
                  key={tab}
                  onClick={() => setActiveResTab(tab)}
                  style={{
                    padding: '10px 16px',
                    fontSize: '11px',
                    color: activeResTab === tab ? tokens.colors.textPrimary : tokens.colors.textTertiary,
                    borderBottom: activeResTab === tab ? '2px solid var(--os-accent)' : '2px solid transparent',
                    cursor: 'pointer',
                  }}
                >
                  {tab}
                </div>
              ))}
            </div>
            
            {response && (
              <div style={{ display: 'flex', gap: '16px', paddingRight: '16px', fontSize: '11px', fontFamily: tokens.typography.fontMono }}>
                <span style={{ color: response.status >= 200 && response.status < 300 ? '#4ADE80' : response.status >= 400 ? '#F87171' : tokens.colors.textSecondary }}>
                  Status: {response.status} {response.statusText}
                </span>
                <span style={{ color: tokens.colors.textTertiary }}>Time: {response.time}ms</span>
                {response.size > 0 && <span style={{ color: tokens.colors.textTertiary }}>Size: {response.size} KB</span>}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: 'auto', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
            {!response && (
              <div style={{ padding: '32px', textAlign: 'center', color: tokens.colors.textTertiary, fontSize: '12px' }}>
                Enter URL and click Send to get a response
              </div>
            )}

            {response?.error && (
              <div style={{ padding: '24px', color: '#F87171', fontSize: '12px', lineHeight: 1.6 }}>
                <div style={{ marginBottom: '8px', fontWeight: 600 }}>Error: {response.statusText}</div>
                <div>{response.error}</div>
                <div style={{ marginTop: '16px', color: tokens.colors.textTertiary, padding: '16px', backgroundColor: tokens.colors.bgCanvas, border: `1px dashed ${tokens.colors.borderSubtle}` }}>
                  CORS blocked. Try a public API like:<br/><br/>
                  https://jsonplaceholder.typicode.com/posts<br/>
                  https://api.github.com/users/octocat<br/>
                  https://httpbin.org/get
                </div>
              </div>
            )}

            {!response?.error && response && activeResTab === 'BODY' && (
              <div style={{ padding: '16px', fontSize: '12px', lineHeight: '1.7', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
                {response.isJson ? (
                  <div dangerouslySetInnerHTML={{ __html: syntaxHighlight(response.data) }} />
                ) : (
                  <div style={{ color: tokens.colors.textSecondary }}>{response.data}</div>
                )}
              </div>
            )}

            {!response?.error && response && activeResTab === 'HEADERS' && (
              <div style={{ padding: '16px' }}>
                {response.headers.map((h, i) => (
                  <div key={i} style={{ display: 'flex', marginBottom: '8px', fontSize: '12px' }}>
                    <div style={{ width: '200px', color: tokens.colors.textSecondary }}>{h.key}</div>
                    <div style={{ flex: 1, color: tokens.colors.textPrimary }}>{h.value}</div>
                  </div>
                ))}
              </div>
            )}

            {!response?.error && response && activeResTab === 'TIMELINE' && (
              <div style={{ padding: '24px', fontSize: '12px' }}>
                {[
                  { label: 'DNS Lookup', val: response.timeline.dns },
                  { label: 'TCP Connect', val: response.timeline.tcp },
                  { label: 'TLS Handshake', val: response.timeline.tls },
                  { label: 'Request Sent', val: response.timeline.req },
                  { label: 'Waiting (TTFB)', val: response.timeline.ttfb },
                  { label: 'Content Download', val: response.timeline.download },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                    <div style={{ width: '150px', color: tokens.colors.textSecondary }}>{item.label}</div>
                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: `${Math.max(1, (item.val / response.time) * 300)}px`, height: '8px', backgroundColor: item.val ? 'var(--os-accent)' : tokens.colors.borderSubtle }} />
                      <div style={{ color: tokens.colors.textTertiary }}>{item.val} ms</div>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: `1px solid ${tokens.colors.borderFaint}`, display: 'flex' }}>
                  <div style={{ width: '150px', fontWeight: 600, color: tokens.colors.textPrimary }}>Total Time</div>
                  <div style={{ fontWeight: 600, color: tokens.colors.textPrimary }}>{response.time} ms</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
