const API_BASE = window.__APPLYCALL_API_BASE__ || ((window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1") ? "" : "");

const searchTextEl = document.getElementById("admin-search-text");
const topKEl = document.getElementById("admin-top-k");
const matchModeEl = document.getElementById("admin-match-mode");
const filterListEl = document.getElementById("admin-filter-list");
const addFilterBtn = document.getElementById("admin-add-filter");
const runSearchBtn = document.getElementById("admin-run-search");
const exportJsonBtn = document.getElementById("admin-export-json");
const exportCsvBtn = document.getElementById("admin-export-csv");
const statusEl = document.getElementById("admin-status");
const notesEl = document.getElementById("admin-notes");
const resultsSummaryEl = document.getElementById("admin-results-summary");
const resultsEl = document.getElementById("admin-results");

let fieldConfig = [];
let operatorConfig = [];
let lastPayload = null;
let lastResults = [];

function setStatus(message, isError = false) {
  statusEl.textContent = message || "";
  statusEl.style.color = isError ? "var(--error)" : "var(--muted)";
}

function makeOption(value, label) {
  const option = document.createElement("option");
  option.value = value;
  option.textContent = label;
  return option;
}

function buildSelect(options, selectedValue) {
  const select = document.createElement("select");
  select.className = "select";
  options.forEach((item) => {
    select.appendChild(makeOption(item.value, item.label));
  });
  if (selectedValue !== undefined) {
    select.value = selectedValue;
  }
  return select;
}

function getDefaultField() {
  return fieldConfig.length ? fieldConfig[0].name : "title";
}

function renderFilterRow(filter = {}) {
  const row = document.createElement("div");
  row.className = "admin-filter-row";

  const fieldSelect = buildSelect(
    fieldConfig.map((item) => ({ value: item.name, label: item.label })),
    filter.field || getDefaultField()
  );
  fieldSelect.classList.add("admin-filter-field");

  const operatorSelect = buildSelect(operatorConfig, filter.operator || "eq");
  operatorSelect.classList.add("admin-filter-operator");

  const valueInput = document.createElement("input");
  valueInput.type = "text";
  valueInput.className = "admin-filter-value";
  valueInput.placeholder = "Value or comma-separated list";
  valueInput.value = filter.value || "";

  const removeBtn = document.createElement("button");
  removeBtn.type = "button";
  removeBtn.className = "button secondary small";
  removeBtn.textContent = "Remove";
  removeBtn.addEventListener("click", () => {
    row.remove();
  });

  function syncValueState() {
    const operator = operatorSelect.value;
    const disableValue = operator === "exists";
    valueInput.disabled = disableValue;
    if (disableValue && !valueInput.value) {
      valueInput.value = "true";
    }
  }

  operatorSelect.addEventListener("change", syncValueState);
  syncValueState();

  row.appendChild(fieldSelect);
  row.appendChild(operatorSelect);
  row.appendChild(valueInput);
  row.appendChild(removeBtn);
  filterListEl.appendChild(row);
}

function collectFilters() {
  return Array.from(filterListEl.querySelectorAll(".admin-filter-row"))
    .map((row) => {
      const field = row.querySelector(".admin-filter-field")?.value || "";
      const operator = row.querySelector(".admin-filter-operator")?.value || "eq";
      const value = row.querySelector(".admin-filter-value")?.value || "";
      return { field, operator, value };
    })
    .filter((item) => item.field && (item.operator === "exists" || String(item.value).trim()));
}

function buildPayload() {
  return {
    search_text: searchTextEl.value.trim(),
    top_k: Number(topKEl.value) || 100,
    match_mode: matchModeEl.value || "all",
    filters: collectFilters(),
  };
}

function renderResults(items) {
  if (!items.length) {
    resultsEl.innerHTML = '<div class="info-box">No jobs matched the current search criteria.</div>';
    return;
  }

  resultsEl.innerHTML = items.map((item) => {
    const title = item.title || "Untitled Job";
    const company = item.company || "Unknown Company";
    const location = [item.city, item.state, item.country].filter(Boolean).join(", ");
    const skills = Array.isArray(item.transferable_skills) ? item.transferable_skills.join("; ") : "";
    const minimumCriteria = Array.isArray(item.minimum_criteria) ? item.minimum_criteria.join("; ") : "";
    const description = String(item.description_clean || "").trim();
    return `
      <div class="admin-result-card">
        <div class="admin-result-top">
          <div>
            <div class="rec-job-title">${title}</div>
            <div class="rec-job-company">${company}</div>
            <div class="tag">${location || "No location"} | ${item.source || "No source"}</div>
          </div>
          <div class="admin-score-chip">${(Number(item.score) || 0).toFixed(3)}</div>
        </div>
        <div class="admin-result-meta">
          <span>ID: ${item.id || ""}</span>
          <span>Type: ${item.job_type || "n/a"}</span>
          <span>Category: ${item.category || "n/a"}</span>
          <span>Salary: ${item.salary || "n/a"}</span>
        </div>
        ${skills ? `<div class="admin-result-block"><strong>Transferable skills:</strong> ${skills}</div>` : ""}
        ${minimumCriteria ? `<div class="admin-result-block"><strong>Minimum criteria:</strong> ${minimumCriteria}</div>` : ""}
        ${description ? `<div class="admin-result-block"><strong>Description:</strong> ${description}</div>` : ""}
        <div class="admin-result-links">
          ${item.apply_url ? `<a href="${item.apply_url}" target="_blank" rel="noopener noreferrer">Apply</a>` : ""}
          ${item.questions_url ? `<a href="${item.questions_url}" target="_blank" rel="noopener noreferrer">Questions</a>` : ""}
          ${item.url ? `<a href="${item.url}" target="_blank" rel="noopener noreferrer">Job URL</a>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

async function runSearch() {
  const payload = buildPayload();
  lastPayload = payload;
  setStatus("Running search...");
  resultsSummaryEl.textContent = "Searching...";
  runSearchBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/admin/job-search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Search failed.");
    }
    lastResults = data.results || [];
    resultsSummaryEl.textContent = `Returned ${data.returned_count} jobs from ${data.raw_match_count} Pinecone matches. Query used: "${data.query_text_used}".`;
    renderResults(lastResults);
    setStatus("Search complete.");
  } catch (error) {
    console.error(error);
    lastResults = [];
    renderResults([]);
    resultsSummaryEl.textContent = "Search failed.";
    setStatus(error.message || "Search failed.", true);
  } finally {
    runSearchBtn.disabled = false;
  }
}

async function exportResults(format) {
  const payload = lastPayload || buildPayload();
  setStatus(`Preparing ${format.toUpperCase()} export...`);

  try {
    const response = await fetch(`${API_BASE}/api/admin/job-search/export`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, format }),
    });

    if (!response.ok) {
      let message = "Export failed.";
      try {
        const data = await response.json();
        message = data.error || message;
      } catch (err) {
        // Ignore JSON parse failures for export errors.
      }
      throw new Error(message);
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const contentDisposition = response.headers.get("Content-Disposition") || "";
    const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/i);
    link.href = url;
    link.download = filenameMatch ? filenameMatch[1] : `pinecone_job_search.${format}`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setStatus(`${format.toUpperCase()} export downloaded.`);
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Export failed.", true);
  }
}

async function init() {
  setStatus("Loading filter configuration...");

  try {
    const response = await fetch(`${API_BASE}/api/admin/job-search/config`);
    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || "Failed to load configuration.");
    }
    fieldConfig = data.fields || [];
    operatorConfig = data.operators || [];
    topKEl.value = (data.defaults && data.defaults.top_k) || 100;
    matchModeEl.value = (data.defaults && data.defaults.match_mode) || "all";
    notesEl.innerHTML = (data.notes || []).map((note) => `<div>${note}</div>`).join("");
    renderFilterRow({ field: "source", operator: "eq", value: "" });
    renderFilterRow({ field: "city", operator: "eq", value: "" });
    renderResults([]);
    setStatus("Ready.");
  } catch (error) {
    console.error(error);
    setStatus(error.message || "Failed to load configuration.", true);
  }
}

addFilterBtn.addEventListener("click", () => renderFilterRow());
runSearchBtn.addEventListener("click", runSearch);
exportJsonBtn.addEventListener("click", () => exportResults("json"));
exportCsvBtn.addEventListener("click", () => exportResults("csv"));

init();
