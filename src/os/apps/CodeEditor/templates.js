export const TEMPLATES = {
  calculator: {
    name: 'Calculator',
    keywords: ['calculator', 'calc', 'math', 'calculate'],
    description: 'A clean dark calculator',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body {
    background: #0C0A08;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    font-family: 'JetBrains Mono', monospace;
  }
  .calc {
    background: #141210;
    border: 1px solid rgba(240,237,232,0.12);
    border-radius: 4px;
    padding: 16px;
    width: 280px;
  }
  .display {
    background: #080604;
    border: 1px solid rgba(240,237,232,0.08);
    padding: 16px;
    text-align: right;
    margin-bottom: 12px;
    border-radius: 2px;
  }
  .display .expr { font-size: 11px; color: #8A8480; min-height: 16px; }
  .display .val { font-size: 28px; color: #F5F2EE; margin-top: 4px; }
  .grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 8px; }
  button {
    padding: 14px;
    border: 1px solid rgba(240,237,232,0.08);
    background: #1C1916;
    color: #C4BFB8;
    font-family: 'JetBrains Mono', monospace;
    font-size: 14px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.1s;
  }
  button:hover { background: rgba(232,160,32,0.12); color: #E8A020; border-color: rgba(232,160,32,0.3); }
  button.op { color: #E8A020; }
  button.eq { background: #E8A020; color: #0C0A08; font-weight: 700; border-color: #E8A020; }
  button.eq:hover { background: #F0B030; }
  button.span2 { grid-column: span 2; }
</style>
</head>
<body>
<div class="calc">
  <div class="display">
    <div class="expr" id="expr"></div>
    <div class="val" id="val">0</div>
  </div>
  <div class="grid">
    <button onclick="clr()">C</button>
    <button onclick="tog()">+/-</button>
    <button onclick="pct()">%</button>
    <button class="op" onclick="op('/')">÷</button>
    <button onclick="num('7')">7</button>
    <button onclick="num('8')">8</button>
    <button onclick="num('9')">9</button>
    <button class="op" onclick="op('*')">×</button>
    <button onclick="num('4')">4</button>
    <button onclick="num('5')">5</button>
    <button onclick="num('6')">6</button>
    <button class="op" onclick="op('-')">−</button>
    <button onclick="num('1')">1</button>
    <button onclick="num('2')">2</button>
    <button onclick="num('3')">3</button>
    <button class="op" onclick="op('+')">+</button>
    <button class="span2" onclick="num('0')">0</button>
    <button onclick="dot()">.</button>
    <button class="eq" onclick="eq()">=</button>
  </div>
</div>
<script>
  let cur='0', prev='', oper='', fresh=false;
  const V=()=>document.getElementById('val');
  const E=()=>document.getElementById('expr');
  function num(n){ if(fresh){cur=n;fresh=false;}else{cur=cur==='0'?n:cur+n;} V().textContent=cur; }
  function dot(){ if(!cur.includes('.'))cur+='.'; V().textContent=cur; }
  function op(o){ prev=cur; oper=o; fresh=true; E().textContent=cur+' '+o; }
  function eq(){ if(!oper)return; const r=eval(prev+oper+cur); E().textContent=prev+oper+cur+'='; cur=String(parseFloat(r.toFixed(8))); V().textContent=cur; oper=''; fresh=true; }
  function clr(){ cur='0';prev='';oper='';fresh=false; V().textContent='0'; E().textContent=''; }
  function tog(){ cur=String(-parseFloat(cur)); V().textContent=cur; }
  function pct(){ cur=String(parseFloat(cur)/100); V().textContent=cur; }
</script>
</body>
</html>`,
  },

  todo: {
    name: 'Todo App',
    keywords: ['todo', 'task', 'list', 'tasks'],
    description: 'A minimal task list',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0C0A08; font-family:'JetBrains Mono',monospace; color:#F5F2EE; padding:32px; min-height:100vh; }
  h1 { font-size:14px; color:#E8A020; letter-spacing:0.1em; margin-bottom:20px; }
  .input-row { display:flex; gap:8px; margin-bottom:20px; }
  input { flex:1; background:#141210; border:1px solid rgba(240,237,232,0.12); color:#F5F2EE; padding:10px 12px; font-family:'JetBrains Mono',monospace; font-size:12px; border-radius:2px; outline:none; }
  input:focus { border-color:rgba(232,160,32,0.4); }
  button { background:#E8A020; border:none; color:#0C0A08; padding:10px 16px; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; border-radius:2px; cursor:pointer; }
  .task { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid rgba(240,237,232,0.06); }
  .task.done span { text-decoration:line-through; color:#5C5854; }
  .check { width:16px; height:16px; border:1px solid rgba(240,237,232,0.2); border-radius:2px; cursor:pointer; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .check.done { background:#E8A020; border-color:#E8A020; color:#0C0A08; font-size:10px; }
  .del { margin-left:auto; color:#5C5854; cursor:pointer; font-size:16px; }
  .del:hover { color:#F87171; }
  .empty { color:#5C5854; font-size:12px; padding:20px 0; }
</style>
</head>
<body>
<h1>// TASKS</h1>
<div class="input-row">
  <input id="inp" placeholder="Add a task..." onkeydown="if(event.key==='Enter')add()">
  <button onclick="add()">ADD</button>
</div>
<div id="list"></div>
<script>
  let tasks=JSON.parse(localStorage.getItem('smit-tasks')||'[]');
  function save(){localStorage.setItem('smit-tasks',JSON.stringify(tasks));}
  function render(){
    const l=document.getElementById('list');
    if(!tasks.length){l.innerHTML='<div class="empty">no tasks yet.</div>';return;}
    l.innerHTML=tasks.map((t,i)=>\`<div class="task \${t.done?'done':''}">
      <div class="check \${t.done?'done':''}" onclick="tog(\${i})">\${t.done?'✓':''}</div>
      <span>\${t.text}</span>
      <div class="del" onclick="del(\${i})">×</div>
    </div>\`).join('');
  }
  function add(){const i=document.getElementById('inp');if(!i.value.trim())return;tasks.push({text:i.value.trim(),done:false});i.value='';save();render();}
  function tog(i){tasks[i].done=!tasks[i].done;save();render();}
  function del(i){tasks.splice(i,1);save();render();}
  render();
</script>
</body>
</html>`,
  },

  timer: {
    name: 'Countdown Timer',
    keywords: ['timer', 'countdown', 'pomodoro', 'stopwatch', 'time'],
    description: 'A precision countdown timer',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0C0A08; font-family:'JetBrains Mono',monospace; color:#F5F2EE; display:flex; align-items:center; justify-content:center; height:100vh; flex-direction:column; gap:32px; }
  .time { font-size:72px; font-weight:700; color:#E8A020; letter-spacing:0.05em; }
  .controls { display:flex; gap:12px; }
  button { padding:10px 24px; background:#141210; border:1px solid rgba(240,237,232,0.12); color:#C4BFB8; font-family:'JetBrains Mono',monospace; font-size:11px; border-radius:2px; cursor:pointer; letter-spacing:0.06em; transition:all 0.15s; }
  button:hover { border-color:rgba(232,160,32,0.3); color:#E8A020; }
  button.primary { background:#E8A020; color:#0C0A08; font-weight:700; border-color:#E8A020; }
  button.primary:hover { background:#F0B030; }
  .presets { display:flex; gap:8px; }
  .preset { padding:6px 12px; background:transparent; border:1px solid rgba(240,237,232,0.08); color:#8A8480; font-family:'JetBrains Mono',monospace; font-size:10px; border-radius:2px; cursor:pointer; }
  .preset:hover { border-color:rgba(232,160,32,0.3); color:#E8A020; }
  .label { font-size:11px; color:#8A8480; letter-spacing:0.1em; }
</style>
</head>
<body>
<div class="label" id="lbl">TIMER</div>
<div class="time" id="disp">25:00</div>
<div class="presets">
  <div class="preset" onclick="set(25*60)">25 MIN</div>
  <div class="preset" onclick="set(10*60)">10 MIN</div>
  <div class="preset" onclick="set(5*60)">5 MIN</div>
  <div class="preset" onclick="set(60)">1 MIN</div>
</div>
<div class="controls">
  <button onclick="toggle()" id="btn" class="primary">START</button>
  <button onclick="reset()">RESET</button>
</div>
<script>
  let total=25*60, remaining=25*60, interval=null, running=false;
  function fmt(s){return Math.floor(s/60).toString().padStart(2,'0')+':'+((s%60).toString().padStart(2,'0'));}
  function set(s){reset();total=s;remaining=s;document.getElementById('disp').textContent=fmt(s);}
  function toggle(){
    if(running){clearInterval(interval);running=false;document.getElementById('btn').textContent='START';}
    else{running=true;document.getElementById('btn').textContent='PAUSE';interval=setInterval(()=>{if(remaining<=0){clearInterval(interval);running=false;document.getElementById('btn').textContent='START';document.getElementById('lbl').textContent='DONE!';return;}remaining--;document.getElementById('disp').textContent=fmt(remaining);},1000);}
  }
  function reset(){clearInterval(interval);running=false;remaining=total;document.getElementById('disp').textContent=fmt(total);document.getElementById('btn').textContent='START';document.getElementById('lbl').textContent='TIMER';}
</script>
</body>
</html>`,
  },

  quiz: {
    name: 'Quiz App',
    keywords: ['quiz', 'test', 'question', 'trivia', 'game'],
    description: 'An interactive quiz',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0C0A08; font-family:'JetBrains Mono',monospace; color:#F5F2EE; padding:32px; min-height:100vh; }
  .header { display:flex; justify-content:space-between; margin-bottom:24px; font-size:11px; color:#8A8480; letter-spacing:0.08em; }
  .question { font-size:16px; color:#F5F2EE; line-height:1.6; margin-bottom:24px; padding:20px; background:#141210; border:1px solid rgba(240,237,232,0.08); border-radius:2px; border-left:2px solid #E8A020; }
  .options { display:flex; flex-direction:column; gap:10px; }
  .opt { padding:12px 16px; background:#141210; border:1px solid rgba(240,237,232,0.08); border-radius:2px; cursor:pointer; font-size:12px; color:#C4BFB8; transition:all 0.15s; }
  .opt:hover { border-color:rgba(232,160,32,0.3); color:#E8A020; }
  .opt.correct { border-color:#4ADE80; color:#4ADE80; background:rgba(74,222,128,0.08); }
  .opt.wrong { border-color:#F87171; color:#F87171; background:rgba(248,113,113,0.08); }
  .result { margin-top:24px; text-align:center; padding:20px; }
  .score { font-size:32px; font-weight:700; color:#E8A020; }
  button { margin-top:16px; padding:10px 24px; background:#E8A020; border:none; color:#0C0A08; font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:700; border-radius:2px; cursor:pointer; }
</style>
</head>
<body>
<div id="app"></div>
<script>
const questions=[
  {q:"What does HTML stand for?",opts:["HyperText Markup Language","High Tech Modern Language","HyperText Modern Links","HyperText Machine Language"],ans:0},
  {q:"Which is NOT a JavaScript data type?",opts:["String","Boolean","Character","Object"],ans:2},
  {q:"What does CSS stand for?",opts:["Computer Style Sheets","Cascading Style Sheets","Creative Style System","Colorful Style Sheets"],ans:1},
  {q:"Which company created React?",opts:["Google","Microsoft","Facebook","Apple"],ans:2},
  {q:"What does 'npm' stand for?",opts:["Node Package Manager","New Programming Method","Node Project Module","Network Package Module"],ans:0},
];
let cur=0,score=0,answered=false;
function render(){
  const app=document.getElementById('app');
  if(cur>=questions.length){
    app.innerHTML=\`<div class="result"><div class="score">\${score}/\${questions.length}</div><div style="color:#8A8480;font-size:12px;margin-top:8px">\${score>=4?'impressive.':score>=2?'not bad.':'keep building.'}</div><button onclick="restart()">TRY AGAIN</button></div>\`;
    return;
  }
  const q=questions[cur];
  app.innerHTML=\`<div class="header"><span>Q \${cur+1}/\${questions.length}</span><span>SCORE: \${score}</span></div><div class="question">\${q.q}</div><div class="options">\${q.opts.map((o,i)=>\`<div class="opt" id="o\${i}" onclick="pick(\${i})">\${o}</div>\`).join('')}</div>\`;
}
function pick(i){
  if(answered)return;answered=true;
  const q=questions[cur];
  if(i===q.ans)score++;
  document.getElementById('o'+i).className='opt '+(i===q.ans?'correct':'wrong');
  document.getElementById('o'+q.ans).className='opt correct';
  setTimeout(()=>{cur++;answered=false;render();},800);
}
function restart(){cur=0;score=0;answered=false;render();}
render();
</script>
</body>
</html>`,
  },

  landing: {
    name: 'Landing Page',
    keywords: ['landing', 'page', 'website', 'hero', 'portfolio'],
    description: 'A minimal landing page template',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0C0A08; font-family:'JetBrains Mono',monospace; color:#F5F2EE; }
  nav { padding:20px 40px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(240,237,232,0.06); }
  .logo { color:#E8A020; font-weight:700; letter-spacing:0.1em; font-size:14px; }
  .nav-links { display:flex; gap:24px; font-size:12px; color:#8A8480; }
  .nav-links a { color:#8A8480; text-decoration:none; transition:color 0.15s; }
  .nav-links a:hover { color:#E8A020; }
  .hero { padding:80px 40px; max-width:700px; }
  .tag { font-size:11px; color:#E8A020; letter-spacing:0.12em; margin-bottom:16px; }
  h1 { font-size:48px; line-height:1.2; color:#F5F2EE; margin-bottom:20px; font-family:'JetBrains Mono',monospace; }
  h1 span { color:#E8A020; }
  p { font-size:14px; color:#8A8480; line-height:1.8; max-width:500px; margin-bottom:32px; font-family:'DM Sans',sans-serif; }
  .cta { display:flex; gap:12px; }
  .btn { padding:12px 28px; border-radius:2px; font-family:'JetBrains Mono',monospace; font-size:12px; cursor:pointer; letter-spacing:0.06em; }
  .btn-primary { background:#E8A020; color:#0C0A08; font-weight:700; border:none; }
  .btn-secondary { background:transparent; color:#C4BFB8; border:1px solid rgba(240,237,232,0.12); }
  .stats { display:flex; gap:40px; padding:40px; border-top:1px solid rgba(240,237,232,0.06); }
  .stat-val { font-size:28px; font-weight:700; color:#E8A020; }
  .stat-lbl { font-size:11px; color:#8A8480; margin-top:4px; letter-spacing:0.06em; }
</style>
</head>
<body>
<nav>
  <div class="logo">YOUR.OS</div>
  <div class="nav-links">
    <a href="#">Work</a>
    <a href="#">About</a>
    <a href="#">Contact</a>
  </div>
</nav>
<div class="hero">
  <div class="tag">// DEVELOPER · BUILDER · CREATOR</div>
  <h1>I Build Things<br>That <span>Actually Work.</span></h1>
  <p>Edit this template. Change the headline, update the stats, make it yours. Built with zero frameworks.</p>
  <div class="cta">
    <button class="btn btn-primary">VIEW WORK</button>
    <button class="btn btn-secondary">CONTACT</button>
  </div>
</div>
<div class="stats">
  <div><div class="stat-val">#1</div><div class="stat-lbl">GOOGLE RANK</div></div>
  <div><div class="stat-val">3+</div><div class="stat-lbl">LIVE PRODUCTS</div></div>
  <div><div class="stat-val">0</div><div class="stat-lbl">FRAMEWORKS NEEDED</div></div>
</div>
</body>
</html>`,
  },

  weather: {
    name: 'Weather Widget',
    keywords: ['weather', 'forecast', 'temperature', 'climate'],
    description: 'A weather display widget',
    html: `<!DOCTYPE html>
<html>
<head>
<style>
  * { margin:0; padding:0; box-sizing:border-box; }
  body { background:#0C0A08; font-family:'JetBrains Mono',monospace; color:#F5F2EE; display:flex; align-items:center; justify-content:center; height:100vh; }
  .card { background:#141210; border:1px solid rgba(240,237,232,0.08); border-radius:4px; padding:32px; width:320px; }
  .location { font-size:11px; color:#8A8480; letter-spacing:0.12em; margin-bottom:20px; }
  .temp { font-size:72px; font-weight:700; color:#E8A020; line-height:1; margin-bottom:8px; }
  .condition { font-size:14px; color:#C4BFB8; margin-bottom:24px; }
  .grid { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .cell { background:#1C1916; padding:12px; border-radius:2px; }
  .cell-lbl { font-size:10px; color:#8A8480; letter-spacing:0.08em; margin-bottom:4px; }
  .cell-val { font-size:14px; color:#F5F2EE; }
  .loading { text-align:center; color:#8A8480; font-size:12px; }
</style>
</head>
<body>
<div class="card">
  <div class="location">◎ MUMBAI, INDIA</div>
  <div id="content" class="loading">// fetching weather...</div>
</div>
<script>
async function load(){
  try {
    const r=await fetch('https://wttr.in/Mumbai?format=j1');
    const d=await r.json();
    const c=d.current_condition[0];
    document.getElementById('content').innerHTML=\`
      <div class="temp">\${c.temp_C}°</div>
      <div class="condition">\${c.weatherDesc[0].value}</div>
      <div class="grid">
        <div class="cell"><div class="cell-lbl">FEELS LIKE</div><div class="cell-val">\${c.FeelsLikeC}°C</div></div>
        <div class="cell"><div class="cell-lbl">HUMIDITY</div><div class="cell-val">\${c.humidity}%</div></div>
        <div class="cell"><div class="cell-lbl">WIND</div><div class="cell-val">\${c.windspeedKmph} km/h</div></div>
        <div class="cell"><div class="cell-lbl">VISIBILITY</div><div class="cell-val">\${c.visibility} km</div></div>
      </div>\`;
  } catch(e) {
    document.getElementById('content').innerHTML=\`
      <div class="temp">31°</div>
      <div class="condition">Partly Cloudy</div>
      <div class="grid">
        <div class="cell"><div class="cell-lbl">FEELS LIKE</div><div class="cell-val">35°C</div></div>
        <div class="cell"><div class="cell-lbl">HUMIDITY</div><div class="cell-val">78%</div></div>
        <div class="cell"><div class="cell-lbl">WIND</div><div class="cell-val">14 km/h</div></div>
        <div class="cell"><div class="cell-lbl">CITY</div><div class="cell-val">Mumbai</div></div>
      </div>\`;
  }
}
load();
</script>
</body>
</html>`,
  },
};

// Match user prompt to template
export const matchTemplate = (prompt) => {
  const lower = prompt.toLowerCase();
  for (const [key, template] of Object.entries(TEMPLATES)) {
    if (template.keywords.some(kw => lower.includes(kw))) {
      return { key, ...template };
    }
  }
  return null;
};
