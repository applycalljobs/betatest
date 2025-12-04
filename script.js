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
async function submitData(payload){try{const endpoint=window.__APPLYCALL_ENDPOINT__;if(endpoint){const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)});return r.ok}const key="applycall_interest";const data=JSON.parse(localStorage.getItem(key)||"[]");data.push({...payload,timestamp:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(data));return true}catch{return false}}
function setBusy(btn,msg){btn.disabled=true;btn.textContent=msg;note.textContent=""}
async function handleAction(action){updateState();const btn=action==="find"?findBtn:waitlistBtn;if(btn.disabled)return;setBusy(btn,"Submitting...");const p=phoneInput.value;const e=emailInput.value;const phoneOk=validPhone(p);const emailProvided=e.trim()!=="";const emailOk=validEmail(e);const payload={phone:phoneOk?buildPhone():null,email:(emailProvided&&emailOk)?e.trim():null,action};const ok=await submitData(payload);if(ok){btn.textContent=action==="find"?"Submitted":"Joined";note.textContent=action==="find"?"We’ll reach out to start your job search.":"You’re on the list. We’ll text you when ready.";form.reset();updateState()}else{btn.disabled=false;btn.textContent=action==="find"?"Find a Job":"Join the Waitlist";note.textContent="Submission failed. Try again later."}}
phoneInput.addEventListener("input",updateState);
emailInput.addEventListener("input",updateState);
codeSelect.addEventListener("change",updateState);
findBtn.addEventListener("click",()=>handleAction("find"));
waitlistBtn.addEventListener("click",()=>handleAction("waitlist"));
updateState();
