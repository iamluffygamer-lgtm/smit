exports.handler = async (event) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers: corsHeaders, body: '' };
  }

  try {
    const { url, method, reqHeaders, body } = JSON.parse(event.body);

    if (!url) {
      return { statusCode: 400, headers: corsHeaders, body: JSON.stringify({ error: 'URL is required' }) };
    }

    const options = {
      method: method || 'GET',
      headers: reqHeaders || {},
    };

    if (['POST', 'PUT', 'PATCH'].includes(method) && body) {
      options.body = body;
    }

    const response = await fetch(url, options);
    
    let resBody;
    const contentType = response.headers.get('content-type');
    
    // Read the response as ArrayBuffer to handle both binary and text data properly,
    // though for simple APIs text is fine. Let's just use text() and let the client parse it.
    resBody = await response.text();

    const outHeaders = {};
    response.headers.forEach((value, key) => {
      outHeaders[key] = value;
    });

    return {
      statusCode: response.status,
      headers: {
        ...corsHeaders,
        'Content-Type': contentType || 'text/plain',
        'X-Proxied-Status': response.status.toString(),
        'X-Proxied-Status-Text': response.statusText,
        'X-Proxied-Headers': JSON.stringify(outHeaders)
      },
      body: resBody
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: error.message })
    };
  }
};
