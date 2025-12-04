:root{--bg-0:#08080d;--bg-1:#0e0f17;--fg:#e9eef7;--muted:#a9b0be;--brand-1:#6e78ff;--brand-2:#4cc9f0;--accent:#f8b4d9;--success:#86efac;--error:#fca5a5}
*{box-sizing:border-box}
html,body{height:100%}
body{margin:0;background:linear-gradient(120deg,var(--bg-0),var(--bg-1));color:var(--fg);font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif}
.bg{position:fixed;inset:0;pointer-events:none;background:radial-gradient(1200px 500px at 20% 10%,rgba(78,201,240,.22),transparent),radial-gradient(900px 400px at 80% 30%,rgba(110,120,255,.25),transparent),radial-gradient(700px 300px at 50% 90%,rgba(248,180,217,.18),transparent)}
.bg::before,.bg::after{content:"";position:absolute;border-radius:50%;filter:blur(60px);opacity:.35}
.bg::before{width:900px;height:900px;left:-200px;top:-160px;background:radial-gradient(closest-side,rgba(110,120,255,.35),transparent);animation:orbit1 12s ease-in-out infinite alternate}
.bg::after{width:800px;height:800px;right:-160px;bottom:-120px;background:radial-gradient(closest-side,rgba(76,201,240,.35),transparent);animation:orbit2 14s ease-in-out infinite alternate}
.page{min-height:100vh;display:grid;grid-template-rows:auto 1fr auto;gap:24px;align-items:center;justify-items:center;padding:48px 24px}
.brand{text-align:center}
.logo{font-weight:700;font-size:36px;letter-spacing:.6px;background:linear-gradient(90deg,var(--brand-1),var(--brand-2));-webkit-background-clip:text;background-clip:text;color:transparent;text-shadow:0 8px 30px rgba(110,120,255,.35)}
.tag{margin-top:8px;color:var(--muted);font-size:14px}
.card{width:100%;max-width:980px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:24px;padding:34px;backdrop-filter:saturate(180%) blur(22px);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 60px rgba(110,120,255,.18),0 0 50px rgba(76,201,240,.12)}
.title{margin:0 0 8px;font-size:24px;font-weight:600}
.subtitle{margin:0 0 20px;color:#cbd2e0;font-size:16px;line-height:1.6}
form{display:grid;gap:16px}
.form-grid{display:grid;grid-template-columns:1fr 1fr;gap:26px}
.panel{display:grid;gap:16px;align-content:start;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:16px}
.field-group{display:grid;gap:8px}
.label{font-size:13px;color:var(--muted)}
.phone-row{display:grid;grid-template-columns:160px 1fr;gap:10px}
.select{width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(8,10,20,.6);color:var(--fg);outline:none;appearance:none}
.select:focus{border-color:var(--brand-2);box-shadow:0 0 0 4px rgba(76,201,240,.15)}
input{width:100%;padding:14px 16px;border-radius:12px;border:1px solid rgba(255,255,255,.22);background:rgba(8,10,20,.6);color:var(--fg);outline:none;transition:border-color .18s,box-shadow .18s,transform .08s}
input::placeholder{color:#7c8191}
input:focus{border-color:var(--brand-2);box-shadow:0 0 0 5px rgba(76,201,240,.18);transform:translateZ(0)}
.error{min-height:18px;color:var(--error);font-size:12px}
.hint{margin-top:4px;color:var(--muted);font-size:13px}
.buttons{display:flex;gap:12px;flex-wrap:wrap}
.button{padding:14px 18px;border-radius:12px;border:0;background:linear-gradient(100deg,var(--brand-1),var(--brand-2));color:white;font-weight:700;cursor:pointer;transition:transform .08s ease,filter .2s,box-shadow .2s,background-position .3s;background-size:200%}
.button.secondary{background:transparent;border:1px solid rgba(255,255,255,.28);color:var(--fg)}
.button:hover{filter:brightness(1.1);box-shadow:0 10px 30px rgba(110,120,255,.28),0 8px 24px rgba(76,201,240,.18);background-position:80%}
.button:active{transform:scale(.99)}
.button[disabled]{opacity:.6;cursor:not-allowed}
.form-note{min-height:20px;color:var(--muted);font-size:13px}
.footer{color:#7c8191;font-size:12px;text-align:center}
@media (max-width:768px){.form-grid{grid-template-columns:1fr}.panel{padding:14px}}
@media (max-width:480px){.card{padding:22px}.title{font-size:22px}.subtitle{font-size:14px}.phone-row{grid-template-columns:120px 1fr}}

@keyframes orbit1{0%{transform:translate(0,0)}100%{transform:translate(40px,30px)}}
@keyframes orbit2{0%{transform:translate(0,0)}100%{transform:translate(-30px,-40px)}}
