const form=document.getElementById("interest-form");
const phoneInput=document.getElementById("phone");
const codeSelect=document.getElementById("country-code");
const emailInput=document.getElementById("email");
const phoneError=document.getElementById("phone-error");
const emailError=document.getElementById("email-error");
const findBtn=document.getElementById("find");
const waitlistBtn=document.getElementById("waitlist");
const note=document.getElementById("form-note");
function validPhone(v){return /^\+?[0-9\s\-()]{7,}$/.test(v.trim())}
function validEmail(v){if(!v)return true;return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())}
function setError(el,msg){el.textContent=msg||""}
function updateState(){const p=phoneInput.value;const e=emailInput.value;const phoneOk=validPhone(p);const emailProvided=e.trim()!=="";const emailOk=validEmail(e);setError(phoneError,(phoneOk||!p)?"":"Enter a valid phone");setError(emailError,(emailOk||!emailProvided)?"":"Enter a valid email");findBtn.disabled=!phoneOk;waitlistBtn.disabled=!((emailProvided&&emailOk)||phoneOk)}
function buildPhone(){const p=phoneInput.value.trim();if(p.startsWith("+"))return p;return `${codeSelect.value} ${p}`}
function saveLocal(payload){const key="applycall_interest";const data=JSON.parse(localStorage.getItem(key)||"[]");data.push({...payload,timestamp:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(data))}
async function submitData(payload){try{const endpoint=window.__APPLYCALL_ENDPOINT__;const timeoutMs=9000;const mk=async r=>({ok:!!(r&&r.ok),status:r?r.status:0});if(endpoint){if(/script\.google\.com\/macros/.test(endpoint)){try{const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),timeoutMs);const params=new URLSearchParams();params.set("phone",payload.phone||"");params.set("email",payload.email||"");params.set("action",payload.action||"");const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:params.toString(),signal:ctrl.signal});clearTimeout(t);const res=await mk(r);if(res.ok)return res}catch(e){}try{const ctrl2=new AbortController();const t2=setTimeout(()=>ctrl2.abort(),timeoutMs);const r2=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctrl2.signal});clearTimeout(t2);const res2=await mk(r2);if(res2.ok)return res2}catch(e){}try{const params2=new URLSearchParams();params2.set("phone",payload.phone||"");params2.set("email",payload.email||"");params2.set("action",payload.action||"");await fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:params2.toString()});return{ok:true,status:0}}catch(e){return{ok:false,status:0}}}else{const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),timeoutMs);const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctrl.signal});clearTimeout(t);return await mk(r)}}saveLocal(payload);return{ok:true,status:200} }catch(e){return{ok:false,status:0}}}
function setBusy(btn,msg){btn.disabled=true;btn.textContent=msg;note.textContent=""}
async function handleAction(action){updateState();const btn=action==="find"?findBtn:waitlistBtn;if(btn.disabled)return;setBusy(btn,"Submitting...");const p=phoneInput.value;const e=emailInput.value;const phoneOk=validPhone(p);const emailProvided=e.trim()!=="";const emailOk=validEmail(e);const payload={phone:phoneOk?buildPhone():null,email:(emailProvided&&emailOk)?e.trim():null,action};const res=await submitData(payload);if(res.ok){btn.textContent=action==="find"?"Submitted":"Joined";note.textContent=action==="find"?"We’ll reach out to start your job search.":"You’re on the list. We’ll text you when ready.";form.reset();updateState()}else{saveLocal(payload);btn.disabled=false;btn.textContent=action==="find"?"Find a Job":"Join the Waitlist";note.textContent="Submission failed. Saved locally."}}
phoneInput.addEventListener("input",updateState);
emailInput.addEventListener("input",updateState);
codeSelect.addEventListener("change",updateState);
findBtn.addEventListener("click",()=>handleAction("find"));
waitlistBtn.addEventListener("click",()=>handleAction("waitlist"));
updateState();
