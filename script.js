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
const appList = document.getElementById('applications-list');
const recJobsList = document.getElementById('recommended-jobs-list');

const cvUpload = document.getElementById('cv-upload');
const btnUploadCv = document.getElementById('btn-upload-cv');
const cvMsg = document.getElementById('cv-msg');
const currentCv = document.getElementById('current-cv');

const statCallsCount = document.getElementById('stat-calls-count');
const statApplicationsCount = document.getElementById('stat-applications-count');

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
      
      // Update stats
      if (statCallsCount) {
        statCallsCount.textContent = (p.call_history && Array.isArray(p.call_history)) ? p.call_history.length : 0;
      }
      if (statApplicationsCount) {
        statApplicationsCount.textContent = (p.applications && Array.isArray(p.applications)) ? p.applications.length : 0;
      }

      if (p.cv_filename) {
        currentCv.textContent = `Current CV: ${p.cv_filename}`;
      } else {
        currentCv.textContent = '';
      }

      callSummary.innerHTML = p.search_dna 
          ? `<strong>Search DNA:</strong> ${p.search_dna}` 
          : (p.call_summary || 'No call data available yet.');

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

      if (recJobsList) {
        recJobsList.innerHTML = '';
        window.recommendedJobs = p.recommended_jobs || []; // Store for access
        
        if (p.recommended_jobs && p.recommended_jobs.length > 0) {
          
          const createJobCard = (job, idx) => {
            const div = document.createElement('div');
            div.className = 'rec-job-item';
            
            // Create unique ID for toggle
            const toggleId = `job-desc-${idx}`;
            
            div.innerHTML = `
              <div class="rec-job-header">
                <div>
                  <div class="rec-job-title">${job.title}</div>
                  <div class="rec-job-company">${job.company}</div>
                </div>
                <div class="rec-job-match">${job.match_score}% Match</div>
              </div>
              
              <div class="rec-job-details" style="display: flex; justify-content: space-between; align-items: center;">
                <div class="rec-job-detail-item">📍 ${job.location}</div>
                <button class="button small" style="margin: 0;" onclick="window.startJobApplication(${idx})">Apply Online</button>
              </div>

              <div class="rec-job-expand" onclick="document.getElementById('${toggleId}').classList.toggle('hidden'); this.querySelector('span').textContent = document.getElementById('${toggleId}').classList.contains('hidden') ? '▼' : '▲';" style="text-align: center; cursor: pointer; padding: 8px; color: var(--brand-2); margin-top: 4px;">
                <span style="font-size: 18px;">▼</span>
              </div>

              <div id="${toggleId}" class="rec-job-extra hidden" style="margin-top: 10px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px;">
                <div style="font-size: 13px; color: #ddd; margin-bottom: 12px; line-height: 1.5;">
                   ${job.match_justification ? `<div style="background: rgba(46, 204, 113, 0.1); padding: 8px; border-radius: 4px; margin-bottom: 8px; border-left: 2px solid var(--brand-2);"><strong>Why you fit:</strong> ${job.match_justification}</div>` : ''}
                   <p>${job.description || 'No description available.'}</p>
                   <p style="margin-top: 8px; color: var(--text);">💰 <strong>Pay:</strong> ${job.pay}</p>
                </div>
              </div>
            `;
            return div;
          };

          // Render first 3 jobs
          p.recommended_jobs.slice(0, 3).forEach((job, idx) => {
             recJobsList.appendChild(createJobCard(job, idx));
          });

          // Render remaining jobs hidden
          if (p.recommended_jobs.length > 3) {
              const moreContainer = document.createElement('div');
              moreContainer.className = 'hidden';
              moreContainer.style.marginTop = '10px';
              
              p.recommended_jobs.slice(3).forEach((job, idx) => {
                  // Adjust index: idx is 0-based from slice, so real index is idx + 3
                  moreContainer.appendChild(createJobCard(job, idx + 3));
              });
              
              recJobsList.appendChild(moreContainer);

              // Toggle Button
              const toggleBtn = document.createElement('div');
              toggleBtn.style.textAlign = 'center';
              toggleBtn.style.padding = '12px';
              toggleBtn.style.cursor = 'pointer';
              toggleBtn.style.background = 'rgba(255,255,255,0.05)';
              toggleBtn.style.borderRadius = '8px';
              toggleBtn.style.marginTop = '15px';
              toggleBtn.style.color = 'var(--brand-2)';
              toggleBtn.style.fontWeight = '600';
              toggleBtn.innerHTML = `See ${p.recommended_jobs.length - 3} more matches ▼`;
              
              toggleBtn.onclick = () => {
                  const isHidden = moreContainer.classList.contains('hidden');
                  if (isHidden) {
                      moreContainer.classList.remove('hidden');
                      toggleBtn.innerHTML = 'Show less ▲';
                  } else {
                      moreContainer.classList.add('hidden');
                      toggleBtn.innerHTML = `See ${p.recommended_jobs.length - 3} more matches ▼`;
                  }
              };
              recJobsList.appendChild(toggleBtn);
          }

        } else {
          recJobsList.innerHTML = '<p class="hint">No recommendations available.</p>';
        }
      }

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

// --- Job Application Logic ---

const applyModal = document.getElementById('job-apply-modal');
const btnCloseApplyModal = document.getElementById('btn-close-apply-modal');
const btnCloseSuccess = document.getElementById('btn-close-success');
const jobApplyForm = document.getElementById('job-apply-form');
const jobQuestionsContainer = document.getElementById('job-questions-container');
const jobApplyLoading = document.getElementById('job-apply-loading');
const jobApplyError = document.getElementById('job-apply-error');
const jobApplySuccess = document.getElementById('job-apply-success');
const jobApplyTitle = document.getElementById('job-apply-title');

let currentApplyJob = null;

window.startJobApplication = async (idx) => {
  const job = window.recommendedJobs[idx];
  if (!job) return;
  
  currentApplyJob = job;
  jobApplyTitle.textContent = `Apply for ${job.title}`;
  
  // Reset UI
  jobQuestionsContainer.innerHTML = '';
  jobApplyError.classList.add('hidden');
  jobApplySuccess.classList.add('hidden');
  jobApplyForm.classList.remove('hidden');
  jobApplyLoading.classList.remove('hidden');
  applyModal.classList.remove('hidden');
  
  // Check if we have a questions URL
  if (!job.questions_url) {
      jobApplyLoading.classList.add('hidden');
      
      if (job.apply_url) {
          jobQuestionsContainer.innerHTML = `
              <div style="text-align: center; padding: 20px;">
                  <p style="margin-bottom: 20px; color: var(--muted);">This job requires application on the company website.</p>
                  <a href="${job.apply_url}" target="_blank" class="btn btn-primary" style="display: inline-block;">
                      Apply on Company Site <i class="fas fa-external-link-alt"></i>
                  </a>
              </div>
          `;
          // Hide the main form submit button since we are redirecting
          const submitBtn = jobApplyForm.querySelector('button[type="submit"]');
          if (submitBtn) submitBtn.style.display = 'none';
      } else {
          jobApplyError.textContent = 'Application details not available for this job.';
          jobApplyError.classList.remove('hidden');
      }
      return;
  }

  // Fetch questions
  try {
    const res = await fetch(`${API_BASE}/api/autocalls/get-questions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ questions_url: job.questions_url })
    });
    
    const questions = await res.json();
    
    jobApplyLoading.classList.add('hidden');
    
    if (Array.isArray(questions)) {
      renderQuestions(questions);
    } else {
      console.error('Invalid questions format:', questions);
      throw new Error('Invalid questions format received.');
    }
    
  } catch (err) {
    jobApplyLoading.classList.add('hidden');
    jobApplyError.textContent = 'Failed to load application questions. Please try again.';
    jobApplyError.classList.remove('hidden');
    console.error(err);
  }
};

function renderQuestions(questions) {
  jobQuestionsContainer.innerHTML = '';
  
  questions.forEach(q => {
    const wrapper = document.createElement('div');
    wrapper.className = 'field-group';
    wrapper.style.marginBottom = '15px';
    
    const label = document.createElement('label');
    label.className = 'label';
    label.style.display = 'block';
    label.style.marginBottom = '5px';
    label.style.color = 'var(--muted)';
    label.textContent = q.question + (q.required ? ' *' : '');
    wrapper.appendChild(label);
    
    let input;
    
    if (q.type === 'select') {
      input = document.createElement('select');
      input.name = q.id;
      input.required = q.required;
      input.style.width = '100%';
      input.style.padding = '10px';
      input.style.background = 'rgba(255,255,255,0.05)';
      input.style.border = '1px solid var(--border)';
      input.style.borderRadius = '8px';
      input.style.color = '#fff';
      
      input.innerHTML = '<option value="">Select an option...</option>';
      if (q.options) {
        q.options.forEach(opt => {
          const option = document.createElement('option');
          option.value = opt.value;
          option.textContent = opt.label;
          input.appendChild(option);
        });
      }
    } else {
      // Default to text
      input = document.createElement('input');
      input.type = 'text';
      input.name = q.id;
      input.required = q.required;
      input.style.width = '100%';
      input.style.padding = '10px';
      input.style.background = 'rgba(255,255,255,0.05)';
      input.style.border = '1px solid var(--border)';
      input.style.borderRadius = '8px';
      input.style.color = '#fff';
    }
    
    wrapper.appendChild(input);
    jobQuestionsContainer.appendChild(wrapper);
  });
}

jobApplyForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  if (!currentApplyJob) return;
  
  const formData = new FormData(jobApplyForm);
  const answers = {};
  formData.forEach((value, key) => {
    answers[key] = value;
  });
  
  const btnSubmit = document.getElementById('btn-submit-application');
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Submitting...';
  jobApplyError.classList.add('hidden');
  
  try {
    const res = await fetch(`${API_BASE}/api/autocalls/submit-application`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        apply_url: currentApplyJob.apply_url,
        answers: answers
      })
    });
    
    const result = await res.json();
    
    if (result.success) {
      jobApplyForm.classList.add('hidden');
      jobApplySuccess.classList.remove('hidden');
    } else {
      throw new Error(result.error || 'Submission failed.');
    }
    
  } catch (err) {
    jobApplyError.textContent = err.message || 'Error submitting application.';
    jobApplyError.classList.remove('hidden');
  } finally {
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Submit Application';
  }
});

btnCloseApplyModal.addEventListener('click', () => {
  applyModal.classList.add('hidden');
});

btnCloseSuccess.addEventListener('click', () => {
  applyModal.classList.add('hidden');
});

init();
