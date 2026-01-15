const form=document.getElementById("interest-form");
const phoneInput=document.getElementById("phone");
const codeSelect=document.getElementById("country-code");
const emailInput=document.getElementById("email");
const phoneError=document.getElementById("phone-error");
const emailError=document.getElementById("email-error");
const findBtn=document.getElementById("find");
const waitlistBtn=document.getElementById("waitlist");
const note=document.getElementById("form-note");
function toE164(v){if(!v)return"";let s=String(v).trim().replace(/[()\s-]/g,"");if(!s.startsWith("+"))s="+"+s;return/^\+\d{7,}$/.test(s)?s:""}
function validPhone(v){return /^\+?[0-9\s\-()]{7,}$/.test(v.trim())}
function validEmail(v){if(!v)return true;return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())}
function setError(el,msg){el.textContent=msg||""}
function updateState(){const p=phoneInput.value;const e=emailInput.value;const phoneOk=validPhone(p);const emailProvided=e.trim()!=="";const emailOk=validEmail(e);setError(phoneError,(phoneOk||!p)?"":"Enter a valid phone");setError(emailError,(emailOk||!emailProvided)?"":"Enter a valid email");findBtn.disabled=!phoneOk;waitlistBtn.disabled=!((emailProvided&&emailOk)||phoneOk)}
function buildPhone(){const p=phoneInput.value.trim();if(p.startsWith("+"))return p;return `${codeSelect.value} ${p}`}
function saveLocal(payload){const key="applycall_interest";const data=JSON.parse(localStorage.getItem(key)||"[]");data.push({...payload,timestamp:new Date().toISOString()});localStorage.setItem(key,JSON.stringify(data))}
async function submitData(payload){try{const endpoint=window.__APPLYCALL_ENDPOINT__;const timeoutMs=9000;const mk=async r=>({ok:!!(r&&r.ok),status:r?r.status:0});if(endpoint){if(/script\.google\.com\/macros/.test(endpoint)){try{const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),timeoutMs);const params=new URLSearchParams();params.set("phone",payload.phone||"");params.set("email",payload.email||"");params.set("action",payload.action||"");const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:params.toString(),signal:ctrl.signal});clearTimeout(t);const res=await mk(r);if(res.ok)return res}catch(e){}try{const ctrl2=new AbortController();const t2=setTimeout(()=>ctrl2.abort(),timeoutMs);const r2=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctrl2.signal});clearTimeout(t2);const res2=await mk(r2);if(res2.ok)return res2}catch(e){}try{const params2=new URLSearchParams();params2.set("phone",payload.phone||"");params2.set("email",payload.email||"");params2.set("action",payload.action||"");await fetch(endpoint,{method:"POST",mode:"no-cors",headers:{"Content-Type":"application/x-www-form-urlencoded"},body:params2.toString()});return{ok:true,status:0}}catch(e){return{ok:false,status:0}}}else{const ctrl=new AbortController();const t=setTimeout(()=>ctrl.abort(),timeoutMs);const r=await fetch(endpoint,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),signal:ctrl.signal});clearTimeout(t);return await mk(r)}}saveLocal(payload);return{ok:true,status:200} }catch(e){return{ok:false,status:0}}}
async function triggerAutoCall(rawPhone,email){try{const cfg=window.__AUTOCALLS__||{endpoint:"https://app.autocalls.ai/api/user/make_call",assistant_id:7633,token:"729|jbLVptwcSVU5qIjnjiofEcFoP9a13q4kO1boSFDef715fd32"};const p=toE164(rawPhone);if(!p||!cfg.token)return false;const payload={phone_number:p,assistant_id:cfg.assistant_id,variables:{email:email||""}};const r=await fetch(cfg.endpoint,{method:"POST",headers:{Authorization:`Bearer ${cfg.token}`,"Content-Type":"application/json"},body:JSON.stringify(payload)});return!!(r&&r.ok)}catch(e){try{const cfg2=window.__AUTOCALLS__||{endpoint:"https://app.autocalls.ai/api/user/make_call",assistant_id:7633,token:"729|jbLVptwcSVU5qIjnjiofEcFoP9a13q4kO1boSFDef715fd32"};const p2=toE164(rawPhone);if(!p2)return false;const payload2={phone_number:p2,assistant_id:cfg2.assistant_id};await fetch(cfg2.endpoint,{method:"POST",mode:"no-cors",headers:{Authorization:`Bearer ${cfg2.token}`,"Content-Type":"application/json"},body:JSON.stringify(payload2)});return true}catch(_){return false}}}
function setBusy(btn,msg){btn.disabled=true;btn.textContent=msg;note.textContent=""}
async function handleAction(action){updateState();const btn=action==="find"?findBtn:waitlistBtn;if(btn.disabled)return;setBusy(btn,"Submitting...");const p=phoneInput.value;const e=emailInput.value;const phoneOk=validPhone(p);const emailProvided=e.trim()!=="";const emailOk=validEmail(e);const payload={phone:phoneOk?buildPhone():null,email:(emailProvided&&emailOk)?e.trim():null,action};const res=await submitData(payload);if(action==="find"&&payload.phone){triggerAutoCall(payload.phone,payload.email||"")}if(res.ok){btn.textContent=action==="find"?"Submitted":"Joined";note.textContent=action==="find"?"We’ll reach out to start your job search.":"You’re on the list. We’ll text you when ready.";form.reset();updateState()}else{saveLocal(payload);btn.disabled=false;btn.textContent=action==="find"?"Find a Job":"Join the Waitlist";note.textContent="Submission failed. Saved locally."}}
phoneInput.addEventListener("input",updateState);
emailInput.addEventListener("input",updateState);
codeSelect.addEventListener("change",updateState);
findBtn.addEventListener("click",()=>handleAction("find"));
waitlistBtn.addEventListener("click",()=>handleAction("waitlist"));
updateState();

const API_BASE = 'https://basic.applycall.jobs';

const authModal = document.getElementById('auth-modal');
const btnLoginNav = document.getElementById('btn-login-nav');
const btnLogoutNav = document.getElementById('btn-logout-nav');
const closeModal = document.querySelector('.close-modal');
const btnRequestOtp = document.getElementById('btn-request-otp');
const btnVerifyOtp = document.getElementById('btn-verify-otp');
const stepPhone = document.getElementById('step-phone');
const stepOtp = document.getElementById('step-otp');
const authError = document.getElementById('auth-error');
const landingView = document.getElementById('landing-view');
const profileView = document.getElementById('profile-view');

const loginPhoneInput = document.getElementById('login-phone');
const loginOtpInput = document.getElementById('login-otp');

const pName = document.getElementById('p-name');
const pEmail = document.getElementById('p-email');
const pLocation = document.getElementById('p-location');
const pRecentRole = document.getElementById('p-recent-role');
const pYearsExp = document.getElementById('p-years-exp');
const pMotivation = document.getElementById('p-motivation');
const pMinPay = document.getElementById('p-min-pay');
const pWorkType = document.getElementById('p-work-type');
const pWeeklySchedule = document.getElementById('p-weekly-schedule');
const pAvailabilityNotes = document.getElementById('p-availability-notes');
const btnSaveProfile = document.getElementById('btn-save-profile');
const profileMsg = document.getElementById('profile-msg');
const callSummary = document.getElementById('call-summary');
const searchDnaBox = document.getElementById('search-dna');
const appList = document.getElementById('applications-list');
const recJobsList = document.getElementById('recommended-jobs-list');

const cvUpload = document.getElementById('cv-upload');
const btnUploadCv = document.getElementById('btn-upload-cv');
const cvMsg = document.getElementById('cv-msg');
const currentCv = document.getElementById('current-cv');
const statCalls = document.getElementById('stat-calls');
const statApplied = document.getElementById('stat-applied');

const btnShowMoreJobs = document.getElementById('btn-show-more-jobs');

let profileRecommendedJobs = [];
let showingAllJobs = false;

let authToken = localStorage.getItem('applycall_token');

function init() {
  if (authToken) {
    showProfile();
  } else {
    showLanding();
  }
}

function showLanding() {
  landingView.classList.remove('hidden');
  profileView.classList.add('hidden');
  btnLoginNav.classList.remove('hidden');
  btnLogoutNav.classList.add('hidden');
}

function showProfile() {
  landingView.classList.add('hidden');
  profileView.classList.remove('hidden');
  btnLoginNav.classList.add('hidden');
  btnLogoutNav.classList.remove('hidden');
  loadProfileData();
  loadRecommendedJobs();
}

if (btnLoginNav) {
  btnLoginNav.addEventListener('click', () => {
    console.log('Login button clicked');
    if (authModal) {
      authModal.classList.remove('hidden');
      if (stepPhone) stepPhone.classList.remove('hidden');
      if (stepOtp) stepOtp.classList.add('hidden');
      if (authError) authError.textContent = '';
      if (loginPhoneInput) loginPhoneInput.value = '';
      if (loginOtpInput) loginOtpInput.value = '';
    }
  });
}

closeModal.addEventListener('click', () => {
  authModal.classList.add('hidden');
});

window.addEventListener('click', (e) => {
  if (e.target === authModal) {
    authModal.classList.add('hidden');
  }
});

btnLogoutNav.addEventListener('click', () => {
  authToken = null;
  localStorage.removeItem('applycall_token');
  showLanding();
});


btnRequestOtp.addEventListener('click', async () => {
  const phone = loginPhoneInput.value.trim();
  if (!phone) {
    authError.textContent = 'Please enter a phone number.';
    return;
  }
  
  btnRequestOtp.disabled = true;
  btnRequestOtp.textContent = 'Sending...';
  
  try {
    const res = await fetch(`${API_BASE}/api/auth/otp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    });
    const data = await res.json();
    
    if (data.success) {
      stepPhone.classList.add('hidden');
      stepOtp.classList.remove('hidden');
      authError.textContent = '';
    } else {
      authError.textContent = data.error || 'Failed to send code.';
    }
  } catch (err) {
    authError.textContent = 'Network error. Check console.';
    console.error(err);
  } finally {
    btnRequestOtp.disabled = false;
    btnRequestOtp.textContent = 'Send Code';
  }
});

btnVerifyOtp.addEventListener('click', async () => {
  const phone = loginPhoneInput.value.trim();
  const code = loginOtpInput.value.trim();
  
  if (!code) {
    authError.textContent = 'Enter the code.';
    return;
  }

  btnVerifyOtp.disabled = true;
  btnVerifyOtp.textContent = 'Verifying...';

  try {
    const res = await fetch(`${API_BASE}/api/auth/verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, code })
    });
    const data = await res.json();

    if (data.success) {
      authToken = data.token; // In this mock, token is just the phone number
      localStorage.setItem('applycall_token', authToken);
      authModal.classList.add('hidden');
      showProfile();
    } else {
      authError.textContent = data.error || 'Invalid code.';
    }
  } catch (err) {
    authError.textContent = 'Error verifying code.';
    console.error(err);
  } finally {
    btnVerifyOtp.disabled = false;
    btnVerifyOtp.textContent = 'Verify & Login';
  }
});

async function loadProfileData() {
  if (!authToken) return;

  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();

    if (data.success) {
      const p = data.profile;
      pName.value = p.name || '';
      pEmail.value = p.email || '';
      pLocation.value = p.location || '';
      pRecentRole.value = p.recent_role || '';
      pYearsExp.value = p.years_experience || '';
      pMotivation.value = p.motivation || '';
      pMinPay.value = p.min_pay || '';
      pWorkType.value = p.work_type || '';
      pWeeklySchedule.value = p.weekly_schedule || '';
      pAvailabilityNotes.value = p.availability_notes || '';
      
      if (p.cv_filename) {
        currentCv.textContent = `Current CV: ${p.cv_filename}`;
      } else {
        currentCv.textContent = '';
      }

      if (searchDnaBox) {
        searchDnaBox.textContent = p.search_dna || 'No search DNA available yet.';
      } else {
        callSummary.textContent = p.search_dna || 'No search DNA available yet.';
      }

      if (statCalls) {
        const c = typeof p.call_count === 'number' ? p.call_count : (Array.isArray(p.call_ids) ? p.call_ids.length : 0);
        statCalls.textContent = String(c);
      }

      if (statApplied) {
        const a = typeof p.application_count === 'number' ? p.application_count : (Array.isArray(p.application_ids) ? p.application_ids.length : 0);
        statApplied.textContent = String(a);
      }

      appList.innerHTML = '';
      if (p.applications && p.applications.length > 0) {
        p.applications.forEach((app, index) => {
          const div = document.createElement('div');
          div.className = 'app-item';
          
          // Format as requested: Job X - Title, Company, Location...
          // We'll use a clean layout but include all details.
          const title = app.title || 'Unknown Role';
          const company = app.company || 'Unknown Company';
          const location = app.location || '';
          const status = app.status || 'Unknown Status';
          const feedback = app.feedback || '';
          
          div.innerHTML = `
            <div style="width:100%">
              <div style="font-weight:700; font-size:16px; margin-bottom:4px; color: #fff;">
                Job ${index + 1} - ${title}
              </div>
              <div style="font-size:14px; color:var(--muted); margin-bottom:6px;">
                ${company} ${location ? `• ${location}` : ''}
              </div>
              <div style="font-size:13px; margin-bottom:8px;">
                <span style="color: var(--muted)">Status:</span> <span style="font-weight:600; color:var(--brand-2)">${status}</span>
                ${feedback ? `<br><span style="color: var(--muted)">Feedback:</span> ${feedback}` : ''}
              </div>
              <div style="font-size:11px; color: var(--muted); opacity: 0.7;">
                Detected: ${new Date(app.date).toLocaleDateString()}
              </div>
            </div>
          `;
          appList.appendChild(div);
        });
      } else {
        appList.innerHTML = '<p class="hint">No applications found.</p>';
      }

      // Recommendations are now fetched separately via loadRecommendedJobs()

    } else {
      if (res.status === 401) {
        authToken = null;
        localStorage.removeItem('applycall_token');
        showLanding();
      }
    }
  } catch (err) {
    console.error('Error loading profile:', err);
  }
}

async function loadRecommendedJobs() {
  if (!authToken || !recJobsList) return;
  
  // Show loading state
  recJobsList.innerHTML = '<div style="padding: 20px; text-align: center; color: var(--muted);"><div class="spinner"></div><p style="margin-top:10px;">Finding the best matches for you...</p></div>';
  
  try {
    const res = await fetch(`${API_BASE}/api/recommendations`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });
    const data = await res.json();
    
    if (data.success) {
      profileRecommendedJobs = data.recommendations || [];
      showingAllJobs = false;
      renderRecommendedJobs();
    } else {
       recJobsList.innerHTML = '<p class="hint">Unable to load recommendations.</p>';
    }
  } catch (err) {
    console.error('Error loading recommendations:', err);
    recJobsList.innerHTML = '<p class="hint">Error loading recommendations.</p>';
  }
}

btnSaveProfile.addEventListener('click', async () => {
  if (!authToken) return;
  
  btnSaveProfile.disabled = true;
  btnSaveProfile.textContent = 'Saving...';
  profileMsg.textContent = '';

  const updates = {
    name: pName.value,
    email: pEmail.value,
    location: pLocation.value,
    recent_role: pRecentRole.value,
    years_experience: pYearsExp.value,
    motivation: pMotivation.value,
    min_pay: pMinPay.value,
    work_type: pWorkType.value,
    weekly_schedule: pWeeklySchedule.value,
    availability_notes: pAvailabilityNotes.value
  };

  try {
    const res = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.success) {
      profileMsg.textContent = 'Profile updated successfully.';
      profileMsg.style.color = 'var(--success)';
    } else {
      profileMsg.textContent = 'Update failed.';
      profileMsg.style.color = 'var(--error)';
    }
  } catch (err) {
    profileMsg.textContent = 'Error saving profile.';
    profileMsg.style.color = 'var(--error)';
  } finally {
    btnSaveProfile.disabled = false;
    btnSaveProfile.textContent = 'Save Changes';
  }
});

btnUploadCv.addEventListener('click', async () => {
  if (!authToken) return;
  
  const file = cvUpload.files[0];
  if (!file) {
    cvMsg.textContent = 'Please select a file.';
    return;
  }

  const formData = new FormData();
  formData.append('file', file);

  btnUploadCv.disabled = true;
  btnUploadCv.textContent = 'Uploading...';
  cvMsg.textContent = '';

  try {
    const res = await fetch(`${API_BASE}/api/upload-cv`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${authToken}` },
      body: formData
    });
    const data = await res.json();
    
    if (data.success) {
      cvMsg.textContent = 'CV uploaded!';
      cvMsg.style.color = 'var(--success)';
      currentCv.textContent = `Current CV: ${data.filename}`;
      cvUpload.value = '';
    } else {
      cvMsg.textContent = data.error || 'Upload failed.';
      cvMsg.style.color = 'var(--error)';
    }
  } catch (err) {
    cvMsg.textContent = 'Error uploading file.';
    cvMsg.style.color = 'var(--error)';
  } finally {
    btnUploadCv.disabled = false;
    btnUploadCv.textContent = 'Upload CV';
  }
});

const btnToggleDetails = document.getElementById('btn-toggle-details');
const profileExtraFields = document.getElementById('profile-extra-fields');

function renderRecommendedJobs() {
  if (!recJobsList) return;

  recJobsList.innerHTML = '';

  if (!profileRecommendedJobs || profileRecommendedJobs.length === 0) {
    recJobsList.innerHTML = '<p class="hint">No recommendations available.</p>';
    if (btnShowMoreJobs) {
      btnShowMoreJobs.classList.add('hidden');
    }
    return;
  }

  const jobsToShow = showingAllJobs ? profileRecommendedJobs : profileRecommendedJobs.slice(0, 3);

  jobsToShow.forEach(job => {
    const div = document.createElement('div');
    div.className = 'rec-job-item';

    window.toggleJobDesc = (id) => {
      const descEl = document.getElementById(`job-desc-${id}`);
      const btnEl = document.getElementById(`job-btn-${id}`);
      if (descEl && btnEl) {
        if (descEl.classList.contains('hidden')) {
          descEl.classList.remove('hidden');
          btnEl.textContent = 'Hide Description';
        } else {
          descEl.classList.add('hidden');
          btnEl.textContent = 'Show Description';
        }
      }
    };

    const description = job.description || "No description available for this role.";
    const justification = job.match_justification ? 
      `<div style="margin-bottom: 12px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.1);">
         <div style="font-weight: 700; color: var(--brand-2); margin-bottom: 4px;">Why you match:</div>
         <div style="font-style: italic; color: #fff;">${job.match_justification}</div>
       </div>` : '';

    div.innerHTML = `
      <div class="rec-job-header">
        <div>
          <div class="rec-job-title">${job.title}</div>
          <div class="rec-job-company">${job.company}</div>
          <div class="rec-job-location">📍 ${job.location}</div>
        </div>
        <div style="display: flex; flex-direction: column; align-items: flex-end; gap: 8px;">
           <div class="rec-job-match">${job.match_score}% Match</div>
           <button class="button small" style="padding: 4px 12px; font-size: 12px;" onclick="window.open('${job.apply_url || '#'}', '_blank')">Apply Online</button>
        </div>
      </div>

      <div style="margin-top: 12px;">
         <button id="job-btn-${job.id}" class="button secondary small" style="width: 100%;" onclick="toggleJobDesc('${job.id}')">Show Description</button>
         <div id="job-desc-${job.id}" class="job-description hidden" style="margin-top: 10px; font-size: 13px; color: var(--text-secondary); line-height: 1.5; background: rgba(255,255,255,0.05); padding: 10px; border-radius: 8px;">
            ${justification}
            ${description}
         </div>
      </div>
    `;
    recJobsList.appendChild(div);
  });

  if (btnShowMoreJobs) {
    if (profileRecommendedJobs.length > 3) {
      btnShowMoreJobs.classList.remove('hidden');
      btnShowMoreJobs.textContent = showingAllJobs ? 'Show fewer matches' : 'Show more matches';
    } else {
      btnShowMoreJobs.classList.add('hidden');
    }
  }
}

if (btnToggleDetails && profileExtraFields) {
  btnToggleDetails.addEventListener('click', () => {
    const isExpanded = profileExtraFields.classList.toggle('expanded');
    btnToggleDetails.classList.toggle('expanded');
    
    // Update text
    const span = btnToggleDetails.querySelector('span');
    if (span) {
      span.textContent = isExpanded ? 'Show Less Details' : 'Show More Details';
    }
  });
}

if (btnShowMoreJobs) {
  btnShowMoreJobs.addEventListener('click', () => {
    showingAllJobs = !showingAllJobs;
    renderRecommendedJobs();
  });
}

init();
