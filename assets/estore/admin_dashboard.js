/* global getScriptURL */ // (optional hint for IDE)


function checkLogin() {
  const user = document.getElementById('username').value.trim();
  const pass = document.getElementById('password').value.trim();

  // 🔐 Hardcoded credentials (you can replace or expand with more)
  const VALID_USER = 'admin';
  const VALID_PASS = 'sud@1728';

  if (user === VALID_USER && pass === VALID_PASS) {
    document.getElementById('login-screen').style.display = 'none';
    document.getElementById('mainContent').classList.remove('hidden');
  } else {
    document.getElementById('login-error').classList.remove('hidden');
  }
}

const scriptURL = getScriptURL("admin_dashboard");
const crmScriptURL = getScriptURL("admin_leads");


let headers = [], crmHeaders = [];



function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const main = document.getElementById('mainContent');

  document.getElementById('openSidebar').onclick = () => {
    sidebar.style.left = '0';
    overlay.classList.remove('hidden');
    main.style.marginLeft = '260px';
  };
  document.getElementById('closeSidebar').onclick = closeSidebar;
  overlay.onclick = closeSidebar;

  function closeSidebar() {
    sidebar.style.left = '-260px';
    overlay.classList.add('hidden');
    main.style.marginLeft = '0';
  }
}


document.addEventListener('DOMContentLoaded', () => {
  initSidebar();
  initTabs();
  hideAllSubTabs();

  window.addEventListener("DOMContentLoaded", () => {
    document.getElementById('openSidebar')?.click(); // simulate sidebar open
  });

  // 🧪 Debug: Check visibility of Sales Tabs every second
  setInterval(() => {
    const box = document.getElementById('salesTabs');
    console.log("🧪 Visible?", box && !box.classList.contains('hidden'));
  }, 1000);
});

function initTabs() {
  // Handle main tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active from all main tab buttons
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Hide all tab contents
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));

      // Show the selected main tab content
      const tab = btn.dataset.tab;
      document.getElementById('tab-' + tab)?.classList.add('active');

      // Hide sub-tabs initially
      document.querySelectorAll('.tab-estore').forEach(st => st.classList.remove('active', 'hidden'));

      // Only show sub-tabs when eStore is selected
      if (tab === 'estore') {
        document.querySelectorAll('[id^="add-tab-btn"], [id^="view-tab-btn"]').forEach(st => st.classList.remove('hidden'));
      }

      // Hide all sub-tab wrappers (like sales/leads inside CRM Dashboard)
      document.querySelectorAll('.sub-tab-wrapper').forEach(w => w.classList.add('hidden'));

      // Show sub-tab wrapper only for CRM Dashboard
      if (tab === 'crm-dashboard') {
        document.querySelector('#tab-crm-dashboard .sub-tab-wrapper')?.classList.remove('hidden');
      }

      hideAllSubTabs(); // Hide all sub-tabs
    });
  });

  // Handle sub-tab switching
  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subtabId = btn.dataset.subtab;

      // ❗ NEW: Highlight active sub-tab
      document.querySelectorAll('.sub-tab-btn').forEach(b => b.classList.remove('active-subtab'));
      btn.classList.add('active-subtab');

      showSub(subtabId);

      // Additional logic based on sub-tab
      if (subtabId === 'view-leads') {
        loadCRMHeaders().then(loadCRMEntries);
      }
      if (subtabId === 'add-estore') loadHeaders();
      if (subtabId === 'view-estore') loadExistingEntries();
      if (subtabId === 'sales-dashboard') {
        loadSalesDashboard();
      }
      if (subtabId === 'leads-dashboard') {
        loadLeadsDashboard();
      }
    });
  });
}



function hideAllSubTabs() {
  document.querySelectorAll('.sub-tab-content').forEach(div => div.classList.remove('active'));
  document.querySelectorAll('.sub-tab-btn').forEach(btn => btn.classList.remove('gradient-tab'));
}


// Existing sub-tab listeners
document.getElementById('view-tab-btn')?.addEventListener('click', () => {
  showSub('view-estore');
  loadExistingEntries();
});


document.getElementById('leads-view-tab-btn')?.addEventListener('click', async () => {
  showSub('view-leads');
  await loadCRMHeaders();
  loadCRMEntries();
});



document.getElementById('view-tab-btn')?.addEventListener('click', () => {
  showSub('view-estore');
  loadExistingEntries();
});



document.getElementById('leads-view-tab-btn')?.addEventListener('click', async () => {
  showSub('view-leads');
  await loadCRMHeaders();
  loadCRMEntries();
});

document.querySelectorAll('[data-subtab="sales-dashboard"]')[0]?.addEventListener('click', () => {
  showSub('sales-dashboard');

  loadSalesDashboard();

});

document.querySelectorAll('[data-subtab="leads-dashboard"]')[0]?.addEventListener('click', () => {
  showSub('leads-dashboard');
  loadLeadsDashboard();
});

document.getElementById('add-tab-btn')?.addEventListener('click', async () => {
  const headers = await fetchHeaders(); // Fetch latest headers
  generateAddForm(headers);             // Generate dynamic form fields
  window.currentHeaders = headers;      // Store globally for submitForm
});





//Enter key
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('addForm');

  form?.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      const formElements = Array.from(
        form.querySelectorAll('input, textarea, select')
      ).filter(el => !el.disabled && el.offsetParent !== null); // Only visible/usable ones

      const index = formElements.indexOf(e.target);
      if (index > -1 && index < formElements.length - 1) {
        e.preventDefault();
        formElements[index + 1].focus();
      } else if (index === formElements.length - 1) {
        // last field
        e.preventDefault();
        submitForm(); // Or simulate click on submit button
      }
    }
  });
});
//Enter key

function showSub(id) {
  // Hide all other sub-tab contents
  document.querySelectorAll('.sub-tab-content').forEach(div => {
    div.classList.remove('active');
    div.classList.add('hidden');
    div.style.display = 'none';
    div.style.visibility = 'hidden';
  });

  // Deactivate all sub-tab buttons
  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.classList.remove('gradient-tab');
  });

  // Activate the clicked sub-tab content
  const subContent = document.getElementById('subtab-' + id);
  if (subContent) {
    subContent.classList.remove('hidden');
    subContent.classList.add('active');
    subContent.style.display = 'block';
    subContent.style.visibility = 'visible';
  }

  // Activate the clicked sub-tab button
  const subBtn = document.querySelector(`[data-subtab="${id}"]`);
  if (subBtn) subBtn.classList.add('gradient-tab');

  // Show KPI section only for sales-dashboard
  const kpiReport = document.getElementById('kpi-sales-report');
  if (kpiReport) {
    if (id === 'sales-dashboard') {
      kpiReport.classList.remove('hidden');
    } else {
      kpiReport.classList.add('hidden');
    }
  }

  // Force re-show sales dashboard and report container if it's that subtab
  if (id === 'sales-dashboard') {
    document.getElementById('salesTabs')?.classList.remove('hidden');
    document.getElementById('sales-report-container')?.classList.remove('hidden');
  }
}

// 🌟 Add this ONLY ONCE after your DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const addTabBtn = document.getElementById('add-tab-btn');
  if (addTabBtn) {
    addTabBtn.addEventListener('click', () => {
      console.log("🧩 Add Products tab clicked — loading form headers...");
      loadHeaders();
    });
  }
});

async function loadHeaders() {
  const res = await fetch(`${scriptURL}?action=getHeaders`);
  headers = await res.json();
  window.currentHeaders = headers;

  const form = document.getElementById('addForm');
  form.innerHTML = '';

  const tooltipHints = {
    0: "Enter Product Name",
    1: "Enter Product Description",
    2: "Enter Original Price",
    3: "Discounted Price",
    4: "Image URL",
    5: "Buy Now URL",
    6: "Select Category (office, marketing, design, AI)",
    7: "Enter Rating",
    8: "Setup URL",
    9: "Deal (Yes/No)",
    10: "Product Name🔥 Mega Sale - 70% Off Today Only!",
    11: "Deal Product Name",
    12: "Deal Price Before",
    13: "Deal Price After",
    14: "e.g., 5 hr left",
    15: "e.g., Stock left 2",
    16: "Just Dropped Product Name",
    17: "Just Dropped Product URL",
    18: "Combo Name (1+2+3)",
    19: "₹49,999 (Save ₹7,000)"
  };

  form.className = 'grid grid-cols-1 md:grid-cols-4 gap-6';

  headers.forEach((h, i) => {
    const placeholder = tooltipHints[i] || `Enter ${h}`;
    const titleAttr = `title="${placeholder}"`;

    let icon = '🖊️';
    let inputType = 'text';
    let inputExtra = '';

    if (h.toLowerCase().includes('price')) {
      icon = '💵';
      inputType = 'number';
      inputExtra = 'min="0" step="1" required';
    } else if (h.toLowerCase().includes('url')) {
      icon = '🌐';
      inputType = 'url';
      inputExtra = 'required';
    } else if (h.toLowerCase().includes('rating')) {
      icon = '⭐';
    }

    let fieldHTML = '';

    // Category dropdown
    if (h.toLowerCase().includes('category')) {
      fieldHTML = `
        <div class="relative" ${titleAttr}>
          <label class="text-white text-sm font-semibold">${h}</label>
          <div class="relative mt-1">
            <fieldset class="mb-4 border border-gray-200 p-3 rounded">
              <legend class="text-sm font-semibold text-gray-700 px-1">Category</legend>
              <label class="block text-sm font-medium text-gray-700">
                <select name="${h}" class="w-full p-2 pl-3 pr-8 rounded bg-white text-black shadow focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select Category</option>
                  <option value="ai">AI</option>
                  <option value="design">Design</option>
                  <option value="marketing">Marketing</option>
                  <option value="office">Office</option>
                </select>
              </label>
            </fieldset>
            <span class="text-red-500 text-xs mt-1 hidden absolute right-2 top-2 whitespace-nowrap"></span>
          </div>
        </div>`;

      // Rating dropdown
    } else if (h.toLowerCase().includes('rating')) {
      fieldHTML = `
        <div class="relative" ${titleAttr}>
          <label class="text-white text-sm font-semibold">${h}</label>
          <div class="relative mt-1">
            <fieldset class="mb-4 border border-gray-200 p-3 rounded">
              <legend class="text-sm font-semibold text-gray-700 px-1">Rating</legend>
              <label class="block text-sm font-medium text-gray-700">
                <select name="${h}" class="w-full p-2 pl-3 pr-8 rounded bg-white text-black shadow focus:ring-2 focus:ring-purple-500" required>
                  <option value="">Select Rating</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">3.5</option>
                  <option value="4">4</option>
                  <option value="4">4.5</option>
                  <option value="4">5</option>
                </select>
              </label>
            </fieldset>
            <span class="text-red-500 text-xs mt-1 hidden absolute right-2 top-2 whitespace-nowrap"></span>
          </div>
        </div>`;

      // Textarea (description)
    } else if (h.toLowerCase().includes('description')) {
      fieldHTML = `
        <div class="relative" ${titleAttr}>
          <label class="text-white text-sm font-semibold">${h}</label>
          <textarea name="${h}" rows="4" placeholder="${placeholder}" class="w-full mt-1 p-2 pl-10 rounded bg-white text-black shadow focus:ring-2 focus:ring-purple-500">${icon}</textarea>
          <span class="text-red-500 text-xs mt-1 hidden absolute right-2 top-2 whitespace-nowrap"></span>
        </div>`;

      // All other inputs
    } else {
      fieldHTML = `
        <div class="relative" ${titleAttr}>
          <span class="absolute left-3 top-3 text-gray-500">${icon}</span>
          <input
            type="${inputType}"
            name="${h}"
            placeholder="${placeholder}"
            class="peer w-full mt-1 pl-10 p-2 rounded bg-white text-black shadow focus:ring-2 focus:ring-purple-500"
            ${inputExtra}
          />
          <span class="error-message text-red-500 text-sm mt-1 block hidden"></span>
          <span class="text-red-500 text-xs mt-1 hidden absolute right-2 top-2 whitespace-nowrap"></span>
        </div>`;
    }



    const wrapper = document.createElement('div');
    wrapper.innerHTML = fieldHTML;
    form.appendChild(wrapper);
  });
}



function validateField(input) {
  const name = input.name;
  const value = input.value.trim();
  let error = '';

  // 🟡 Show error element below the field (if missing, create it)
  let errorSpan = input.parentElement.querySelector('.error-msg');
  if (!errorSpan) {
    errorSpan = document.createElement('span');
    errorSpan.className = 'error-msg text-sm text-red-500 block mt-1';
    input.parentElement.appendChild(errorSpan);
  }

  // ✅ Validate required for these 4 core fields
  const mustHave = ['Product Name', 'Original Price', 'Discounted Price', 'Image URL'];
  if (mustHave.includes(name) && !value) {
    error = 'This field is required';
  }

  // ✅ Check duplicate Product Name (first field of headers)
  if (name === headers[0] && value) {
    const duplicate = existingData?.some(entry =>
      (entry[headers[0]] || '').trim().toLowerCase() === value.toLowerCase()
    );
    if (duplicate) error = 'Product name already exists';
  }

  // Final display logic
  if (error) {
    input.classList.add('border-red-500');
    errorSpan.textContent = error;
    return false;
  } else {
    input.classList.remove('border-red-500');
    errorSpan.textContent = '';
    return true;
  }
}

async function submitForm() {
  const form = document.getElementById('addForm');
  const fd = new FormData(form);
  const msg = document.getElementById('submit-message');
  const loader = document.getElementById('submit-loader');

  const data = {};
  headers.forEach(h => data[h] = fd.get(h)?.trim() || '');

  const inputs = form.querySelectorAll('input, textarea, select');
  let isValid = true;

  inputs.forEach(input => {
    const valid = validateField(input);
    if (!valid) isValid = false;
  });

  if (!isValid) return;

  // Hide message, show loader
  msg.classList.add('hidden');
  loader.classList.remove('hidden');

  try {
    await fetch(`${scriptURL}?action=submit`, {
      method: 'POST',
      body: JSON.stringify(data)
    });

    msg.textContent = '✅ Entry Added!';
    form.reset();
    loadExistingEntries(); // refresh table
  } catch (err) {
    msg.textContent = '❌ Failed to submit entry.';
  }

  loader.classList.add('hidden');
  msg.classList.remove('hidden');
}



/** @type {{ [key: string]: string }[]} */
let existingData = [];


async function loadExistingEntries() {
  const container = document.getElementById('estore-existing-table');
  container.innerHTML = getLoader();

  try {
    const res = await fetch(`${scriptURL}?action=getAllEntries`);
    const data = await res.json();
    console.log("📦 eStore Data Received:", data);

    if (!Array.isArray(data)) throw new Error("Invalid data format");

    // 🔄 Normalize and store for validation use
    existingData = data.map(row => ({
      ...row,
      'Product Name': (row['Product Name'] || '').trim().toLowerCase()
    }));

    renderTable(container, data, headers, false);
  } catch (err) {
    container.innerHTML = `<p class="text-red-600">❌ Error loading eStore data: ${err.message}</p>`;
  }
}



async function loadCRMHeaders() {
  const res = await fetch(`${crmScriptURL}?action=getHeaders&type=crm`);
  crmHeaders = await res.json();
}

async function loadCRMEntries() {
  const container = document.getElementById('crm-existing-table');
  container.innerHTML = getLoader("Loading CRM Leads...");
  const res = await fetch(`${crmScriptURL}?action=getAllEntries&type=crm`);
  const data = await res.json();
  renderTable(container, data, crmHeaders, true);
}

function getLoader(text = "Loading...") {
  return `
        <div class="text-center my-4 text-purple-600 font-medium">
          <svg class="animate-spin h-8 w-8 mx-auto mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
          </svg>
          ${text}
        </div>`;
}

function renderTable(container, data, columns, isCRM = false) {
  if (!data.length) {
    container.innerHTML = `<p class="text-gray-500">No entries found.</p>`;
    return;
  }

  const table = document.createElement('table');
  table.className = 'min-w-full text-sm text-left border sticky-header freeze-column divide-y divide-gray-200';

  const thead = document.createElement('thead');
  thead.className = 'bg-gray-100 sticky top-0 z-10';
  thead.innerHTML = `<tr class="text-gray-700 font-semibold text-sm">
    <th class="px-4 py-2 border">#</th>` +
    columns.map(h => `<th class="px-4 py-2 border">${h}</th>`).join('') +
    `<th class="px-4 py-2 border min-w-[200px]">Actions</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  tbody.className = 'text-gray-800';

  data.forEach((r, i) => {
    const row = document.createElement('tr');
    row.ondblclick = () => openEditModal(row);
    row.setAttribute('data-id', r.id);
    row.className = `${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-all`;

    row.innerHTML =
      `<td class="px-4 py-2 border">${i + 1}</td>` +
      columns.map(h => `
        <td class="px-4 py-2 border">
          <input class="w-[200px] p-1 border rounded text-black" value="${r[h] || ''}" data-key="${h}" disabled/>
        </td>
      `).join('') +
      `<td class="px-4 py-2 border flex flex-wrap gap-2 items-center justify-start">
        <!-- ✏️ Edit -->
<button 
  onclick="editRow(this)" 
  title="Edit Inline" 
  role="button" 
  aria-label="Edit this entry"
  class="text-blue-600 hover:text-blue-800 transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
      d="M15.232 5.232l3.536 3.536M4 13.5V19h5.5L19 9.5l-5.5-5.5L4 13.5z" />
  </svg>
  <span class="sr-only">Edit this entry</span>
</button>

        <!-- ❌ Cancel -->
<button 
  onclick="cancelRow(this)" 
  title="Cancel Edit" 
  role="button"
  aria-label="Cancel editing this entry" 
  class="btn-ripple text-yellow-500 hover:text-yellow-600 transition hidden focus:outline-none focus:ring-2 focus:ring-yellow-400 rounded hover:scale-105 hover:bg-yellow-50"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
  <span class="sr-only">Cancel editing this entry</span>
</button>

<!-- ✅ Save -->
<button 
  onclick="updateRow(this, ${r.id}, ${isCRM}); showLoadingSpinner(this)" 
  title="Save Changes" 
  role="button"
  aria-label="Save changes to this entry" 
  class="btn-ripple text-green-600 hover:text-green-700 transition hidden focus:outline-none focus:ring-2 focus:ring-green-500 rounded hover:scale-105 hover:bg-green-50"
>
  <span class="inline-flex items-center gap-1">
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 spinner-icon hidden animate-spin text-green-500" viewBox="0 0 24 24" fill="none">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
    </svg>
    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 save-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
    </svg>
  </span>
  <span class="sr-only">Save changes to this entry</span>
</button>

<!-- 🗑️ Delete -->
<button 
  onclick="deleteRow(this, ${r.id}, ${isCRM})" 
  title="Delete Entry" 
  role="button"
  aria-label="Delete this entry" 
  class="btn-ripple text-red-600 hover:text-red-700 transition focus:outline-none focus:ring-2 focus:ring-red-500 rounded hover:scale-105 hover:bg-red-50"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
  </svg>
  <span class="sr-only">Delete this entry</span>
</button>

<!-- 📝 Modal Editor -->
<button 
  onclick="openEditModal(this.closest('tr'))" 
  title="Open Modal Editor" 
  role="button"
  aria-label="Open modal editor for this entry" 
  class="text-purple-600 hover:text-white transition focus:outline-none focus:ring-2 focus:ring-purple-500 rounded btn-ripple btn-glow"
>
  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M5 3a2 2 0 00-2 2v14l4-4h13a2 2 0 002-2V5a2 2 0 00-2-2H5z"/>
  </svg>
  <span class="sr-only">Open modal editor</span>
</button>
      </td>`;
    tbody.appendChild(row);
  });

  table.appendChild(tbody);

  // Create a tfoot summary row
  // ✅ Calculate total from a specific column (e.g., "Discounted Price" or "Price")
  let totalPrice = 0;
  let priceColumnName = ["Discounted Price", "Price", "Amount", "Total"]; // Add synonyms
  columns.forEach(col => {
    if (priceColumnName.includes(col)) {
      data.forEach(r => {
        let value = parseFloat(r[col]);
        if (!isNaN(value)) totalPrice += value;
      });
    }
  });

  // ✅ Create timestamp (assuming current date/time)
  const updatedAt = new Date().toLocaleString();

  // ✅ Footer Element
  const tfoot = document.createElement('tfoot');
  tfoot.className = 'bg-gray-100 sticky bottom-0 z-10';
  tfoot.innerHTML = `
  <tr>
    <td colspan="${columns.length + 2}" class="px-4 py-2 font-semibold text-gray-700">
      🧾 Total Entries: ${data.length}
      ${totalPrice > 0 ? ` | 💰 Total Amount: ₹${totalPrice.toLocaleString()}` : ''}
      <span class="float-right text-sm text-gray-500">Last Updated: ${updatedAt}</span>
    </td>
  </tr>
`;
  table.appendChild(tfoot);

  container.innerHTML = '';
  container.appendChild(table);
}

function editRow(btn) {
  const row = btn.closest('tr');
  row.querySelectorAll('input[data-key]').forEach(i => i.disabled = false);
  btn.classList.add('hidden');
  row.querySelector('.text-yellow-500').classList.remove('hidden');
  row.querySelector('.text-green-600').classList.remove('hidden');
}

function cancelRow(btn) {
  const row = btn.closest('tr');
  row.querySelectorAll('input[data-key]').forEach(i => {
    i.value = i.defaultValue;
    i.disabled = true;
  });
  row.querySelector('.text-blue-500').classList.remove('hidden');
  row.querySelector('.text-yellow-500').classList.add('hidden');
  row.querySelector('.text-green-600').classList.add('hidden');
}

async function updateRow(btn, id, isCRM) {
  const row = btn ? btn.closest('tr') : selectedRow;
  const data = {};
  row.querySelectorAll('input[data-key]').forEach(i => data[i.dataset.key] = i.value);
  const url = isCRM ? crmScriptURL : scriptURL;

  await fetch(`${url}?action=update&row=${id}`, {
    method: 'POST',
    body: JSON.stringify(data)
  });

  alert('✅ Updated!');
  isCRM ? loadCRMEntries() : loadExistingEntries();
}

async function deleteRow(btn, id, isCRM) {
  const url = isCRM ? crmScriptURL : scriptURL;
  const row = btn.closest('tr');
  const cell = row.querySelector("td:last-child");
  cell.innerHTML = getLoader("Deleting...");
  try {
    const res = await fetch(`${url}?action=delete&row=${id}`, { method: 'POST' });
    const json = await res.json();
    if (json.status === 'deleted') {
      alert("✅ Deleted");
      isCRM ? loadCRMEntries() : loadExistingEntries();
    } else {
      cell.innerHTML = `<span class="text-red-600 font-medium">❌ Delete Failed</span>`;
    }
  } catch (e) {
    cell.innerHTML = `<span class="text-red-600 font-medium">🚨 Delete failed</span>`;
  }
}


// Fix tab switching inside Sales Dashboard Tabs (📈, 🥧, etc.)
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('#salesTabs .tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('#salesTabs .tab-btn').forEach(b => b.classList.remove('border-b-2', 'border-blue-600'));
      btn.classList.add('border-b-2', 'border-blue-600');

      const tabId = btn.getAttribute('data-tab');
      showReport(tabId);
    });
  });
});


// 📈 Sales Reports Logic
async function loadSalesDashboard() {
  try {


    const dashboard = document.getElementById("subtab-sales-dashboard");
    const salesTabs = document.getElementById("salesTabs");
    const container = document.getElementById("sales-report-container");

    if (!dashboard || !salesTabs || !container) {
      console.error("❌ Required elements missing", { dashboard, salesTabs, container });
      return;
    }

    // Force visibility of dashboard and components
    dashboard.classList.remove("hidden");
    dashboard.classList.add("active");
    dashboard.style.display = 'block';
    dashboard.style.visibility = 'visible';

    salesTabs.classList.remove("hidden");
    salesTabs.style.display = "flex";

    container.classList.remove("hidden");
    container.style.display = "block";
    container.style.visibility = "visible";

    // ✅ Remove existing click handlers by cloning buttons
    const oldButtons = salesTabs.querySelectorAll(".tab-btn");
    oldButtons.forEach(btn => {
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
    });

    // ✅ Add new click handlers to new buttons
    const newButtons = salesTabs.querySelectorAll(".tab-btn");
    newButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        newButtons.forEach(b => b.classList.remove("border-b-2", "border-blue-600"));
        btn.classList.add("border-b-2", "border-blue-600");

        const tabId = btn.getAttribute("data-tab");
        showReport(tabId);
      });
    });

    // ✅ Fetch CRM data
    const res = await fetch(`${crmScriptURL}?action=getAllEntries&type=crm`);
    const data = await res.json();
    window._crmData = data; // 🧠 Save globally for later use
    if (!Array.isArray(data)) throw new Error("❌ Invalid CRM response");

    // ✅ Render all charts + tables


    renderLeadVolume(data);
    renderPaidUnpaid(data);
    renderTopProducts(data);
    renderLeadsByProduct(data);
    renderRevenueOverTime(data);
    renderConversion(data);
    renderDailyRevenue(data);
    renderUniqueUsers(data);
    renderAbandoned(data);
    renderTotalRevenue(data, 'day'); // Default view
    initSalesReportTabs(); // 👈 Add this line to activate the logic

    setTimeout(() => {
      const revenueFilter = document.getElementById("revenueFilter");
      if (revenueFilter) {
        revenueFilter.onchange = (e) => {
          const filterType = e.target.value;
          renderTotalRevenue(window._crmData || [], filterType);
        };
      }
    }, 300);


    // ✅ Hide all tabs initially
    container.querySelectorAll('.tab-content').forEach(tab => {
      tab.classList.remove("active");
      tab.classList.add("hidden");
      tab.style.display = 'none';
      tab.style.visibility = 'hidden';
    });

    // ✅ Auto-load default tab
    const defaultReport = document.getElementById("leadVolumeTab");
    if (defaultReport) {
      defaultReport.classList.remove("hidden");
      defaultReport.classList.add("active");
      defaultReport.style.display = 'block';
      defaultReport.style.visibility = 'visible';
    }


    reportButtons.forEach((btn) => {
      const reportId = btn.getAttribute("data-tab");

      btn.addEventListener("click", () => {
        // Remove active highlight from all
        reportButtons.forEach(b => b.classList.remove('active', 'bg-blue-600', 'text-white'));

        // Add highlight to clicked
        btn.classList.add('active', 'bg-blue-600', 'text-white');

        showReport(reportId);
      });
    });



    console.log("✅ Sales Dashboard fully loaded");

  } catch (err) {
    console.error("❌ Error in loadSalesDashboard:", err);
  }
}

function animateCounter(elementId, target, isCurrency = false, suffix = "") {
  const el = document.getElementById(elementId);
  let current = 0;
  target = parseFloat(target);
  const steps = 40;
  const increment = target / steps;

  const animate = () => {
    current += increment;
    if (current >= target) current = target;

    const formatted = isCurrency
      ? "₹" + Math.round(current).toLocaleString()
      : suffix === "%"
        ? current.toFixed(2) + "%"
        : Math.round(current);

    el.textContent = formatted;

    if (current < target) {
      requestAnimationFrame(animate);
    }
  };

  animate();
}



const reportContainer = document.getElementById('sales-report-container');
if (reportContainer) {
  reportContainer.classList.remove('hidden');
  reportContainer.style.display = 'block';
  reportContainer.style.visibility = 'visible';
  console.log("✅ Forced display of #sales-report-container");
} else {
  console.error("❌ Missing #sales-report-container element in DOM");
}

const revenueFilter = document.getElementById("revenueFilter");

if (revenueFilter) {
  revenueFilter.onchange = (e) => {
    const filterType = e.target.value;
    console.log("📌 Filter selected:", filterType);
    renderTotalRevenue(window._crmData || [], filterType);
  };
} else {
  console.warn("❌ revenueFilter dropdown not found in DOM");
}



function showReport(id) {
  const container = document.getElementById("sales-report-container");
  if (!container) return;

  // Show container
  container.classList.remove("hidden");
  container.style.display = "block";
  container.style.visibility = "visible";

  // Hide all reports
  container.querySelectorAll(".tab-content").forEach(rep => {
    rep.classList.remove("active");
    rep.classList.add("hidden");
    rep.style.display = 'none';
    rep.style.visibility = 'hidden';
  });

  // Show selected tab
  const report = document.getElementById(id);
  if (report) {
    report.classList.remove("hidden");
    report.classList.add("active");
    report.style.display = 'block';
    report.style.visibility = 'visible';
    renderMiniCards(id); // ✅ Call here    
    console.log("✅ Showing report:", id);
  } else {
    console.warn("⚠️ Report not found:", id);
  }
}

// 🌐 Global store data for mini card color with no icon, still no icon done icon animation
window._reportData = {};
let colorRotationIndex = 0;

// 🌈 Modern Glass UI Themes
const glassThemes = [
  { bg: 'bg-gradient-to-br from-purple-200 to-blue-200', text: 'text-purple-800' },
  { bg: 'bg-gradient-to-br from-pink-200 to-blue-200', text: 'text-pink-800' },
  { bg: 'bg-gradient-to-br from-yellow-100 to-orange-200', text: 'text-amber-900' },
  { bg: 'bg-gradient-to-br from-lime-200 to-green-200', text: 'text-green-800' },
  { bg: 'bg-gradient-to-br from-blue-100 to-cyan-200', text: 'text-blue-800' },
  { bg: 'bg-gradient-to-br from-orange-100 to-rose-200', text: 'text-orange-800' },
  { bg: 'bg-gradient-to-br from-indigo-100 to-purple-200', text: 'text-indigo-800' },
];


function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// ✅ Draw + Store Table Data for MiniCard Sync
function drawTableWithStore(tableId, columns, rows, tabId) {
  const container = document.getElementById(tableId);
  if (!container) return;

  window._reportData[tabId] = rows.map(row => {
    const obj = {};
    columns.forEach((col, i) => obj[col] = row[i]);
    return obj;
  });

  let html = `<table class="min-w-full text-sm text-left border divide-y divide-gray-200">
    <thead class="bg-gray-100"><tr>${columns.map(c => `<th class="px-4 py-2">${c}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(row => `<tr>${row.map(cell => `<td class="px-4 py-2">${cell}</td>`).join('')}</tr>`).join('')}</tbody>
  </table>`;

  container.innerHTML = html;
}



// 🎨 Metric Card Generator with rotating modern glass style
function metricCard(icon, label, value) {
  const theme = glassThemes[colorRotationIndex++ % glassThemes.length];

  // 🔍 Debug: Log the color index being used
  console.log("🎨 Using color index:", colorRotationIndex - 1);

  const rawValue = parseFloat(value.toString().replace(/[^\d.-]/g, ''));
  const isNumeric = !isNaN(rawValue);

  const animateClass = isNumeric ? 'countup' : '';

  return `
    <div class="metric-card card-enter ${theme.bg} ${theme.text} backdrop-blur-md bg-opacity-60 shadow-lg hover:scale-105 transform transition-all duration-300 rounded-xl p-4 text-center border border-white">
      <div class="text-2xl font-bold metric-value ${animateClass} flex items-center justify-center gap-2 leading-none" data-count="${isNumeric ? rawValue : ''}">
        <span class="text-xl floating-icon">${icon}</span> ${value}
      </div>
      <div class="text-sm mt-1">${label}</div>
    </div>
  `;
}



// 📊 Render Cards Per Tab with Synced Table Data
function renderMiniCards(tabId) {
  const container = document.getElementById(`mini-metrics-${tabId}`);
  if (!container) return;

  const data = window._reportData?.[tabId] || [];
  if (!data.length) {
    container.innerHTML = `<div class="text-gray-500 italic">No data found.</div>`;
    hideSalesTabLoader(); // hide here for empty states
    return;
  }

  // 💡 Reset color rotation for each report
  colorRotationIndex = 0;
  shuffleArray(glassThemes); // ✅ Now rotates each render

  const getSum = key => data.reduce((sum, row) => sum + (parseFloat(row[key]) || 0), 0);
  const getTop = key => [...data].sort((a, b) => (parseFloat(b[key]) || 0) - (parseFloat(a[key]) || 0))[0] || {};
  const getVal = (col, val) => parseFloat(data.find(d => d[col] === val)?.Count || 0);

  const cards = [];

  switch (tabId) {
    case 'leadVolumeTab':
      cards.push(metricCard("🧾", "Total Leads", getSum("Leads")));
      cards.push(metricCard("📆", "This Month", Math.round(getSum("Leads") * 0.6)));
      cards.push(metricCard("📅", "Today", Math.round(getSum("Leads") * 0.2)));
      break;

    case 'paidUnpaidTab':
      cards.push(metricCard("💰", "Paid Orders", getVal("Status", "Paid")));
      cards.push(metricCard("❌", "Unpaid Orders", getVal("Status", "Unpaid")));
      cards.push(metricCard("📦", "Total Collected", "₹" + getSum("Count") * 1000));
      break;

    case 'topProductsTab':
      const top = getTop("Revenue");
      cards.push(metricCard("⭐", "Best Seller", top?.Product || "-"));
      cards.push(metricCard("📦", "Units Sold", Math.floor((top?.Revenue || 0) / 1000)));
      cards.push(metricCard("💵", "Revenue", "₹" + (top?.Revenue || 0)));
      break;

    case 'leadsByProductTab':
      const topLead = getTop("Count");
      cards.push(metricCard("🛒", "Top Product", topLead?.Product || "-"));
      cards.push(metricCard("👥", "Unique Leads", getSum("Count")));
      cards.push(metricCard("🔁", "Repeat Leads", Math.floor(getSum("Count") / 3)));
      break;

    case 'revenueOverTimeTab':
    case 'totalRevenueTab':
      const total = getSum("Revenue");
      cards.push(metricCard("📈", "Total Revenue", "₹" + total.toLocaleString()));
      cards.push(metricCard("📅", "Transactions", data.length));
      cards.push(metricCard("💵", "Avg Order Value", "₹" + Math.round(total / data.length || 0)));
      break;

    case 'conversionRateTab':
      const leads = parseFloat(data.find(d => d.Metric === "Total Leads")?.Count || 0);
      const paid = parseFloat(data.find(d => d.Metric === "Paid Orders")?.Count || 0);
      const rate = leads ? ((paid / leads) * 100).toFixed(1) + "%" : "0%";
      cards.push(metricCard("🎯", "Conversion Rate", rate));
      cards.push(metricCard("👥", "Total Leads", leads));
      cards.push(metricCard("✅", "Converted", paid));
      break;

    case 'dailyRevenueTab':
      cards.push(metricCard("📆", "Today", "₹" + Math.round(getSum("Revenue"))));
      cards.push(metricCard("📅", "Yesterday", "₹" + Math.round(getSum("Revenue") * 0.8)));
      cards.push(metricCard("🚀", "Growth", "+20%"));
      break;

    case 'uniqueUsersTab':
      cards.push(metricCard("📧", "Emails", getVal("Type", "Emails")));
      cards.push(metricCard("📱", "Phones", getVal("Type", "Phones")));
      cards.push(metricCard("🌐", "Web/Mobile", "82% / 18%"));
      break;

    case 'abandonedLeadsTab':
      cards.push(metricCard("🚫", "Abandoned", data.length));
      cards.push(metricCard("📩", "Contacted", Math.floor(data.length / 2)));
      cards.push(metricCard("✅", "Recovered", Math.floor(data.length / 5)));
      break;
  }

  container.innerHTML = cards.join("");

  // ✨ Animate numbers
  setTimeout(() => {
    container.querySelectorAll(".metric-value.countup").forEach(el => {
      const count = parseFloat(el.dataset.count);
      if (!isNaN(count)) countUpAnimation(el, count);
    });
  }, 30);
}

// ⏫ Count Up Animation for all numeric cards
function countUpAnimation(el, target, duration = 1000) {
  let start = 0;
  const frameRate = 60;
  const totalFrames = Math.round(duration / (1000 / frameRate));
  let frame = 0;

  const animate = () => {
    frame++;
    const progress = frame / totalFrames;
    const current = Math.round(target * progress);
    el.innerHTML = el.innerHTML.replace(/\d[\d,\,\.]*/, current.toLocaleString());

    if (frame < totalFrames) {
      requestAnimationFrame(animate);
    } else {
      el.innerHTML = el.innerHTML.replace(/\d[\d,\,\.]*/, target.toLocaleString());
    }
  };

  animate();
}




// 🧠 Group by helper
function groupBy(arr, key) {
  return arr.reduce((acc, obj) => {
    const val = obj[key] || "Unknown";
    acc[val] = acc[val] || [];
    acc[val].push(obj);
    return acc;
  }, {});
}

// 📊 Chart renderers
function renderLeadVolume(data) {
  const grouped = groupBy(data, 'Timestamp');
  const labels = Object.keys(grouped).sort();
  const values = labels.map(d => grouped[d].length);

  drawChart('leadVolumeChart', 'bar', labels, values, 'Leads per Day', '#6366f1');
  //drawTable('leadVolumeTable', ['Date', 'Leads'], labels.map((d, i) => [d, values[i]]));

  drawTableWithStore("leadVolumeTable", ["Date", "Leads"], labels.map((d, i) => [d, values[i]]), "leadVolumeTab");
  renderMiniCards("leadVolumeTab");

}

function renderPaidUnpaid(data) {
  const grouped = groupBy(data, 'Status');
  const labels = Object.keys(grouped);
  const values = labels.map(s => grouped[s].length);

  drawChart('paidUnpaidChart', 'pie', labels, values, '', ['#16a34a', '#facc15', '#f43f5e']);
  //drawTable('paidUnpaidTable', ['Status', 'Count'], labels.map((l, i) => [l, values[i]]));
  // 2. Paid vs Unpaid
  drawTableWithStore("paidUnpaidTable", ["Status", "Count"], labels.map((l, i) => [l, values[i]]), "paidUnpaidTab");
  renderMiniCards("paidUnpaidTab");
}

function renderTopProducts(data) {
  const paid = data.filter(d => d.Status === 'Paid Order');
  const grouped = {};
  paid.forEach(d => {
    const prod = d.Product || 'Unknown';
    const amt = parseFloat(d.Amount || 0);
    grouped[prod] = (grouped[prod] || 0) + amt;
  });
  const labels = Object.keys(grouped);
  const values = labels.map(l => grouped[l]);

  drawChart('topProductsChart', 'bar', labels, values, 'Revenue ₹', '#f97316', true);
  //drawTable('topProductsTable', ['Product', 'Revenue'], labels.map((l, i) => [l, values[i]]));
  // 3. Top Products
  drawTableWithStore("topProductsTable", ["Product", "Revenue"], labels.map((l, i) => [l, values[i]]), "topProductsTab");
  renderMiniCards("topProductsTab");

}

function renderLeadsByProduct(data) {
  const grouped = groupBy(data, 'Product');
  const labels = Object.keys(grouped);
  const values = labels.map(l => grouped[l].length);

  drawChart('leadsByProductChart', 'bar', labels, values, 'Leads', '#3b82f6');
  //drawTable('leadsByProductTable', ['Product', 'Count'], labels.map((l, i) => [l, values[i]]));
  // 4. Leads by Product
  drawTableWithStore("leadsByProductTable", ["Product", "Count"], labels.map((l, i) => [l, values[i]]), "leadsByProductTab");
  renderMiniCards("leadsByProductTab");
}

function renderRevenueOverTime(data) {
  const grouped = {};
  data.filter(d => d.Status === 'Paid Order').forEach(d => {
    const date = d.Timestamp;
    const amt = parseFloat(d.Amount || 0);
    grouped[date] = (grouped[date] || 0) + amt;
  });
  const labels = Object.keys(grouped).sort();
  const values = labels.map(d => grouped[d]);

  drawChart('revenueOverTimeChart', 'line', labels, values, 'Revenue ₹', '#22c55e');
  drawTable('revenueOverTimeTable', ['Date', 'Revenue'], labels.map((d, i) => [d, values[i]]));
  // 5. Revenue Over Time
  drawTableWithStore("revenueOverTimeTable", ["Date", "Revenue"], labels.map((d, i) => [d, values[i]]), "revenueOverTimeTab");
  renderMiniCards("revenueOverTimeTab");
}

function renderConversion(data) {
  const total = data.length;
  const paid = data.filter(d => d.Status === 'Paid Order').length;
  const rate = ((paid / total) * 100).toFixed(2);

  document.getElementById('conversionRateKPI').textContent = `Conversion Rate: ${rate}%`;
  //drawTable('conversionRateTable', ['Metric', 'Count'], [["Total Leads", total], ["Paid Orders", paid], ["Conversion %", `${rate}%`]]);

  // 6. Conversion Rate
  drawTableWithStore("conversionRateTable", ["Metric", "Count"], [
    ["Total Leads", total],
    ["Paid Orders", paid],
    ["Conversion %", `${rate}%`]
  ], "conversionRateTab");
  renderMiniCards("conversionRateTab");
}

function renderDailyRevenue(data) {
  const grouped = {};
  data.filter(d => d.Status === 'Paid Order').forEach(d => {
    const date = d.Timestamp;
    const amt = parseFloat(d.Amount || 0);
    grouped[date] = (grouped[date] || 0) + amt;
  });
  const labels = Object.keys(grouped).sort();
  const values = labels.map(d => grouped[d]);

  drawChart('dailyRevenueChart', 'line', labels, values, 'Daily Revenue ₹', '#6366f1');
  //drawTable('dailyRevenueTable', ['Date', 'Revenue'], labels.map((d, i) => [d, values[i]]));

  // 7. Daily Revenue
  drawTableWithStore("dailyRevenueTable", ["Date", "Revenue"], labels.map((d, i) => [d, values[i]]), "dailyRevenueTab");
  renderMiniCards("dailyRevenueTab");
}

function renderUniqueUsers(data) {
  const emails = new Set(data.map(d => d.Email).filter(Boolean));
  const phones = new Set(data.map(d => d.Phone).filter(Boolean));

  document.getElementById('uniqueUsersKPI').textContent = `Unique Users: ${emails.size + phones.size}`;
  //drawTable('uniqueUsersTable', ['Type', 'Count'], [["Emails", emails.size], ["Phones", phones.size]]);

  // 8. Unique Users
  drawTableWithStore("uniqueUsersTable", ["Type", "Count"], [
    ["Emails", emails.size],
    ["Phones", phones.size]
  ], "uniqueUsersTab");
  renderMiniCards("uniqueUsersTab");
}

function renderAbandoned(data) {
  const leads = data.filter(d => d.Status === 'Interested' && (!d.PaymentID || !parseFloat(d.Amount)));
  const rows = leads.map(d => [d.Timestamp, d.Name, d.Email, d.Phone, d.Product, d.Status]);
  //drawTable('abandonedLeadsTable', ['Date', 'Name', 'Email', 'Phone', 'Product', 'Status'], rows);

  // 9. Abandoned Leads
  drawTableWithStore("abandonedLeadsTable", ["Date", "Name", "Email", "Phone", "Product", "Status"], rows, "abandonedLeadsTab");
  renderMiniCards("abandonedLeadsTab");

}

function renderTotalRevenue(data, filter = "day") {
  const grouped = {};

  // Group based on filter
  data.filter(d => d.Status === "Paid Order").forEach(d => {
    const ts = new Date(d.Timestamp);
    if (isNaN(ts)) return;

    let key;
    if (filter === "day") {
      key = ts.toISOString().split("T")[0]; // yyyy-mm-dd
    } else if (filter === "month") {
      key = `${ts.getFullYear()}-${String(ts.getMonth() + 1).padStart(2, '0')}`; // yyyy-mm
    } else if (filter === "year") {
      key = ts.getFullYear().toString(); // yyyy
    }

    const amt = parseFloat(d.Amount || 0);
    grouped[key] = (grouped[key] || 0) + amt;
  });

  const labels = Object.keys(grouped).sort();
  const values = labels.map(k => grouped[k]);

  drawChart("totalRevenueChart", "bar", labels, values, `Revenue (₹) by ${filter}`, "#f97316");
  //drawTable("totalRevenueTable", ["Period", "Revenue"], labels.map((k, i) => [k, values[i]]));

  // 10. Total Revenue (By Month/Year/etc)
  drawTableWithStore("totalRevenueTable", ["Period", "Revenue"], labels.map((k, i) => [k, values[i]]), "totalRevenueTab");
  renderMiniCards("totalRevenueTab");
}

// 🎨 Chart Drawing
const chartInstances = {}; // Global object to store chart references

function drawChart(id, type, labels, data, label = '', color = '#6366f1', horizontal = false) {
  const el = document.getElementById(id);
  if (!el) {
    console.error("❌ Chart canvas not found:", id);
    return;
  }

  console.log("📊 Drawing chart:", id); // <-- Add this line

  // DESTROY existing
  if (chartInstances[id]) chartInstances[id].destroy();

  chartInstances[id] = new Chart(el, {
    type,
    data: {
      labels,
      datasets: [{
        label,
        data,
        backgroundColor: Array.isArray(color) ? color : color
      }]
    },
    options: horizontal ? { indexAxis: 'y' } : {}
  });
}

// 📋 Table Drawing
function drawTable(id, headers, rows) {
  const el = document.getElementById(id);
  if (!el) return;
  const table = document.createElement('table');
  table.className = 'min-w-full border text-sm';
  table.innerHTML = `
    <thead><tr>${headers.map(h => `<th class='p-2 border bg-gray-100'>${h}</th>`).join('')}</tr></thead>
    <tbody>${rows.map(r => `<tr>${r.map(c => `<td class='p-2 border'>${c}</td>`).join('')}</tr>`).join('')}</tbody>
  `;
  el.innerHTML = '';
  el.appendChild(table);
}

function renderFunnelChart(data) {
  const stageCounts = {
    "Leads": data.length,
    "Contacted": data.filter(d => d.Status === 'Contacted').length,
    "Demo Booked": data.filter(d => d.Status === 'Demo Booked').length,
    "Paid": data.filter(d => d.Status === 'Paid Order').length,
  };

  const ctx = document.getElementById('funnelChart');

  if (window.funnelInstance) window.funnelInstance.destroy(); // cleanup

  window.funnelInstance = new Chart(ctx, {
    type: 'funnel',
    data: {
      labels: Object.keys(stageCounts),
      datasets: [{
        label: 'Lead Funnel',
        data: Object.values(stageCounts),
        backgroundColor: ['#6366f1', '#10b981', '#f59e0b', '#ef4444'],
      }]
    },
    options: {
      plugins: {
        legend: { display: false },
        tooltip: {
          callbacks: {
            label: function (context) {
              const val = context.parsed.x;
              const percent = ((val / stageCounts["Leads"]) * 100).toFixed(1);
              return `${val} (${percent}%)`;
            }
          }
        }
      }
    }
  });
}

let selectedRow = null;

function openEditModal(rowElement) {
  selectedRow = rowElement;
  document.getElementById("editRowModal")?.classList.add("animate-modal-in");
  document.getElementById('editRowModal').style.display = 'flex';
  loadEditFields('all'); // default to 'all' or preserve last state
}

function closeEditModal() {
  document.getElementById('editRowModal').style.display = 'none';
  selectedRow = null;
}

function showEditStatus(msg, isSuccess = true) {
  const el = document.getElementById("editStatusMsg");
  el.innerText = msg;
  el.style.color = isSuccess ? "lightgreen" : "salmon";
  el.style.fontWeight = "bold";
}

async function handleEditUpdate() {
  const btn = document.getElementById("editUpdateButton");
  const spinner = document.getElementById("editUpdateSpinner");
  const statusBox = document.getElementById("editUpdateStatus");

  if (!btn || !selectedRow) {
    console.error("❌ Button or selectedRow not found!");
    if (statusBox) {
      statusBox.textContent = "❌ Button or row missing!";
      statusBox.className = "text-red-500 font-medium";
    }
    return;
  }

  if (spinner) spinner.classList.remove("hidden");
  if (statusBox) {
    statusBox.textContent = "🔄 Updating...";
    statusBox.className = "text-yellow-400 font-medium";
  }

  // Copy modal fields → table row inputs
  const modalInputs = document.querySelectorAll('#editFieldsContainer input[data-key]');
  modalInputs.forEach(input => {
    const key = input.dataset.key;
    const matching = selectedRow.querySelector(`input[data-key="${key}"]`);
    if (matching) {
      matching.value = input.value;
      matching.defaultValue = input.value;
    }
  });

  const id = selectedRow.dataset.id;

  try {
    await updateRow(null, id, false); // Your main function
    if (statusBox) {
      statusBox.textContent = "✅ Successfully updated!";
      statusBox.className = "text-green-500 font-medium";
    }
    setTimeout(() => {
      closeEditModal();
      loadExistingEntries();
    }, 1000);
  } catch (err) {
    console.error("❌ Update failed", err);
    if (statusBox) {
      statusBox.textContent = "❌ Failed to update!";
      statusBox.className = "text-red-500 font-medium";
    }
  } finally {
    if (spinner) spinner.classList.add("hidden");
  }
}

function showEditStatus(message, isSuccess) {
  const msgBox = document.getElementById("editStatusMsg");
  if (!msgBox) return;
  msgBox.textContent = message;
  msgBox.classList.remove("text-green-500", "text-red-500");
  msgBox.classList.add(isSuccess ? "text-green-500" : "text-red-500");
}

const tooltipHints = {
  0: "Enter Product Name",
  1: "Enter Product Description",
  2: "Enter Original Price",
  3: "Discounted Price",
  4: "Image URL",
  5: "Buy Now URL",
  6: "Select Category (office, marketing, design, AI)",
  7: "Enter Rating",
  8: "Setup URL",
  9: "Deal (Yes/No)",
  10: "Product Name🔥 Mega Sale - 70% Off Today Only!",
  11: "Deal Product Name",
  12: "Deal Price Before",
  13: "Deal Price After",
  14: "e.g., 5 hr left",
  15: "e.g., Stock left 2",
  16: "Just Dropped Product Name",
  17: "Just Dropped Product URL",
  18: "Combo Name (1+2+3)",
  19: "₹49,999 (Save ₹7,000)"
};


function loadEditFields(type) {
  const container = document.getElementById('editFieldsContainer');
  if (!selectedRow) return;
  const allInputs = selectedRow.querySelectorAll('input[data-key]');
  const fields = [];

  switch (type) {
    case 'deals':
      fields.push(...Array.from(allInputs).slice(11, 16));
      break;
    case 'flash':
      fields.push(allInputs[0], allInputs[10]);
      break;
    case 'jd':
      fields.push(allInputs[16], allInputs[17]);
      break;
    case 'combo':
      fields.push(allInputs[18], allInputs[19]);
      break;
    default:
      fields.push(...allInputs);
  }

  container.innerHTML = '';
  fields.forEach((input, index) => {
    const key = input.dataset.key;
    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.value = input.value;
    newInput.dataset.key = key;
    newInput.className = 'p-2 rounded border w-full text-black';

    // Show tooltip only if value is blank
    if (!newInput.value && tooltipHints[index] !== undefined) {
      newInput.setAttribute('placeholder', tooltipHints[index]);
      newInput.setAttribute('title', tooltipHints[index]);
    }

    // Optional disable for certain fields
    if (type === 'flash' && input === allInputs[0]) {
      newInput.disabled = true;
    }

    const label = document.createElement('label');
    label.className = 'block text-white text-sm font-semibold';
    label.innerHTML = `${key}<br/>`;
    label.appendChild(newInput);
    container.appendChild(label);
  });
}

function updateEditedRow() {
  const container = document.getElementById('editFieldsContainer');
  const inputs = container.querySelectorAll('input[data-key]');
  if (!selectedRow) return;

  inputs.forEach(input => {
    const key = input.dataset.key;
    const targetInput = selectedRow.querySelector(`input[data-key="${key}"]`);
    if (targetInput) {
      targetInput.value = input.value;
      targetInput.defaultValue = input.value;
    }
  });

  const id = selectedRow.dataset.id;
  updateRow(null, id, false).then(() => {
    showEditStatus("✅ Successfully updated!", true);
    closeEditModal();
    setTimeout(() => loadExistingEntries(), 1000); // ✅ Refresh after 1s
  }).catch(() => {
    showEditStatus("❌ Failed to update!", false);
  });
}

function showSuccessToast(msg) {
  const toast = document.createElement('div');
  toast.className = 'fixed bottom-5 right-5 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

async function updateRowFromModal(id) {
  if (!selectedRow) return;

  const container = document.getElementById('editFieldsContainer');
  const inputs = container.querySelectorAll('input[data-key]');
  const data = {};

  inputs.forEach(input => {
    data[input.dataset.key] = input.value || '';
  });

  try {
    const res = await fetch(`${scriptURL}?action=update&row=${id}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    const json = await res.json();
    console.log("🔁 Update response from server:", json); // Add this

    if (json.status === 'success' || json.result === 'success') {
      showSuccessMessage('✅ Row updated successfully!');
      loadExistingEntries(); // refresh
    } else {
      alert("❌ Update failed: " + (json.message || JSON.stringify(json)));
    }
  } catch (err) {
    console.error("❌ Error updating row from modal:", err);
    alert("❌ Update failed: " + err.message);
  }
}

function showSuccessMessage(msg) {
  const toast = document.createElement('div');
  toast.className = 'toast-success fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow z-50';
  toast.textContent = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

function showEditStatus(msg, isSuccess = true) {
  const el = document.getElementById("editStatusMsg");
  el.innerText = msg;
  el.style.color = isSuccess ? "green" : "red";
  el.style.fontWeight = "bold";
}

// side bar

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");
const openSidebar = document.getElementById("openSidebar");
const closeSidebar = document.getElementById("closeSidebar");

let isSidebarOpen = false;

openSidebar.addEventListener("click", () => {
  isSidebarOpen = !isSidebarOpen;
  sidebar.classList.toggle("active");
  overlay.classList.toggle("hidden");
  openSidebar.innerHTML = isSidebarOpen ? "×" : "☰";
});

closeSidebar.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.add("hidden");
  openSidebar.innerHTML = "☰"; // Toggle back
});

overlay.addEventListener("click", () => {
  sidebar.classList.remove("active");
  overlay.classList.add("hidden");
  openSidebar.innerHTML = "☰";
});

document.querySelectorAll('.btn-ripple').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const circle = document.createElement('span');
    circle.classList.add('ripple');
    this.appendChild(circle);

    const d = Math.max(this.clientWidth, this.clientHeight);
    circle.style.width = circle.style.height = d + 'px';
    circle.style.left = e.offsetX - d / 2 + 'px';
    circle.style.top = e.offsetY - d / 2 + 'px';
    circle.style.position = 'absolute';
    circle.style.borderRadius = '50%';
    circle.style.background = 'rgba(255,255,255,0.5)';
    circle.style.animation = 'ripple 0.6s linear';
    circle.style.pointerEvents = 'none';

    setTimeout(() => circle.remove(), 600);
  });
});

function setButtonLoading(btn, isLoading) {
  if (isLoading) {
    btn.classList.add('btn-loading');
    btn.disabled = true;
  } else {
    btn.classList.remove('btn-loading');
    btn.disabled = false;
  }
}

function handleSave(btn, id, isCRM) {
  setButtonLoading(btn, true);
  updateRow(btn, id, isCRM);
  setTimeout(() => {
    setButtonLoading(btn, false); // remove spinner after simulated delay
  }, 1000); // adjust this based on your actual update callback
}

document.addEventListener("click", function (e) {
  const target = e.target.closest(".btn-ripple");
  if (target) {
    const rect = target.getBoundingClientRect();
    target.style.setProperty('--ripple-x', `${e.clientX - rect.left}px`);
    target.style.setProperty('--ripple-y', `${e.clientY - rect.top}px`);
  }
});

function showLoadingSpinner(btn) {
  const spinner = btn.querySelector(".spinner-icon");
  const icon = btn.querySelector(".save-icon");
  if (spinner && icon) {
    spinner.classList.remove("hidden");
    icon.classList.add("hidden");
    // Remove spinner after 2s or based on update callback
    setTimeout(() => {
      spinner.classList.add("hidden");
      icon.classList.remove("hidden");
    }, 2000);
  }
}

document.getElementById('addForm').addEventListener('input', e => {
  if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) {
    validateField(e.target);
  }
});


document.addEventListener('DOMContentLoaded', () => {
  const addTabBtn = document.getElementById('add-tab-btn');

  if (addTabBtn) {
    addTabBtn.addEventListener('click', async () => {
      console.log("🧩 Add Products tab clicked — loading form headers...");

      const originalText = addTabBtn.innerHTML;
      addTabBtn.disabled = true;
      addTabBtn.innerHTML = `<svg class="animate-spin h-4 w-4 mr-2 inline" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10"
                stroke="currentColor" stroke-width="4" fill="none"/>
        <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
      </svg> Loading...`;

      showSub('add-estore');  // Optional if you want to show the form before headers load
      await loadHeaders();

      addTabBtn.innerHTML = originalText;
      addTabBtn.disabled = false;
    });
  }
});


function initSalesReportTabs() {
  const reportButtons = document.querySelectorAll('#salesTabs button');

  reportButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove highlight from all buttons
      reportButtons.forEach(b => b.classList.remove('active-report-btn'));

      // Add to the clicked one
      btn.classList.add('active-report-btn');

      // Existing chart/table load logic (if not already triggered elsewhere)
      const reportType = btn.dataset.report;
      if (reportType) showReport(reportType);
    });
  });
}

const salesTabDropdown = document.getElementById("salesTabDropdown");

if (salesTabDropdown) {
  salesTabDropdown.addEventListener("change", (e) => {
    const selectedTab = e.target.value;
    if (selectedTab) {
      showReport(selectedTab); // uses same data-tab logic as buttons
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const dropdown = document.getElementById("salesTabDropdown");
  const reportContainer = document.getElementById("sales-report-container");

  if (dropdown) {
    dropdown.addEventListener("change", () => {
      const selectedId = dropdown.value;

      // Hide all reports
      reportContainer.querySelectorAll(".tab-content").forEach(el => el.classList.add("hidden"));

      // Show selected
      const target = document.getElementById(selectedId);
      if (target) {
        target.classList.remove("hidden");
      }
    });
  }
});


function showSalesTabLoader() {
  const btn = document.getElementById("salesBtn");
  if (btn) {
    btn.querySelector(".btn-label").style.display = "none";
    btn.querySelector(".btn-spinner").style.display = "inline-flex";
  }
}

function hideSalesTabLoader() {
  const btn = document.getElementById("salesBtn");
  if (btn) {
    btn.querySelector(".btn-label").style.display = "inline-flex";
    btn.querySelector(".btn-spinner").style.display = "none";
  }
}

// ✨ Animate numbers and hide loader after all cards are rendered
setTimeout(() => {
  container.querySelectorAll(".metric-value.countup").forEach(el => {
    const count = parseFloat(el.dataset.count);
    if (!isNaN(count)) countUpAnimation(el, count);
  });

  // ✅ Hide loader AFTER metrics animate
  hideSalesTabLoader();
}, 30);

document.querySelectorAll(".sub-tab-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const subtab = btn.dataset.subtab;

    if (subtab === "sales-dashboard") {
      showSalesTabLoader(); // ✅ Show spinner on click
    }

    showReport(subtab); // 🔄 Your existing report function
  });
});

//Bell notification

document.getElementById("notifBell").addEventListener("click", () => {
  document.getElementById("notifDropdown").classList.toggle("hidden");
});

function getTodayISO() {
  const now = new Date();
  now.setMinutes(now.getMinutes() + 330); // IST offset
  return now.toISOString().split("T")[0]; // YYYY-MM-DD
}

// ✅ Enhanced format parser
function convertToISTDate(rawDate) {
  if (!rawDate) return "";

  let date;

  // Format 1: ISO string
  if (rawDate.includes("T") && rawDate.includes("Z")) {
    date = new Date(rawDate);
  }

  // Format 2: DD/MM/YYYY HH:mm:ss
  else if (/^\d{2}\/\d{2}\/\d{4} \d{2}:\d{2}:\d{2}$/.test(rawDate)) {
    const [d, m, y, h, min, s] = rawDate.match(/\d+/g).map(Number);
    date = new Date(Date.UTC(y, m - 1, d, h, min, s));
  }

  // Format 3: DD/MM/YYYY
  else if (/^\d{2}\/\d{2}\/\d{4}$/.test(rawDate)) {
    const [d, m, y] = rawDate.split('/').map(Number);
    date = new Date(Date.UTC(y, m - 1, d));
  }

  // Format 4: YYYY-MM-DD
  else if (/^\d{4}-\d{2}-\d{2}$/.test(rawDate)) {
    date = new Date(rawDate + "T00:00:00Z");
  }

  if (!date || isNaN(date.getTime())) return "";

  // Convert to IST
  date.setMinutes(date.getMinutes() + 330);
  return date.toISOString().split("T")[0];
}

async function fetchCSV(url) {
  const res = await fetch("https://api.allorigins.win/raw?url=" + encodeURIComponent(url));
  const text = await res.text();
  return text.trim().split('\n').map(row => row.split(','));
}

async function loadNotificationSummary() {
  const today = getTodayISO();

  //const newsletterUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8RmYsk-sUDiHF6t4Xfaj9Gzr0FaCvhurkDTV0bd-gJgqS8drz-warzxfgIyuchSPd4vpMeDkyw8tX/pub?gid=255856917&single=true&output=csv";
  //const crmUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vS8RmYsk-sUDiHF6t4Xfaj9Gzr0FaCvhurkDTV0bd-gJgqS8drz-warzxfgIyuchSPd4vpMeDkyw8tX/pub?gid=0&single=true&output=csv";

  const newsletterUrl = getScriptURL("newsletter_url");
  const crmUrl = getScriptURL("crm_url");

  let newUsers = 0;
  let totalRevenue = 0;
  let failedPayments = 0;

  try {
    const [newsletter, crm] = await Promise.all([
      fetchCSV(newsletterUrl),
      fetchCSV(crmUrl)
    ]);

    newsletter.forEach((row, i) => {
      if (i === 0) return;
      const istDate = convertToISTDate((row[0] || "").trim());
      if (istDate === today) newUsers++;
    });

    crm.forEach((row, i) => {
      if (i === 0) return;
      const istDate = convertToISTDate((row[0] || "").trim());
      const rawAmount = (row[5] || "").trim();
      const status = (row[6] || "").toLowerCase();

      if (istDate === today) {
        const cleanedAmount = rawAmount.replace(/[^0-9.]/g, "");
        const amount = parseFloat(cleanedAmount) || 0;

        if (status === "paid order") {
          totalRevenue += amount;
        } else if (status.includes("interested") && status.includes("not paid")) {
          failedPayments++;
        }
      }
    });

    document.getElementById("newUsersToday").textContent = newUsers;
    document.getElementById("totalRevenue").textContent = "₹" + totalRevenue.toFixed(2);
    document.getElementById("failedPayments").textContent = failedPayments;

    const totalAlerts = newUsers + failedPayments + (totalRevenue > 0 ? 1 : 0);
    document.getElementById("notifCount").textContent = totalAlerts;
    document.getElementById("totalAlertsLabel").textContent = `${totalAlerts} alert${totalAlerts !== 1 ? 's' : ''}`;
  } catch (err) {
    console.error("❌ Error loading data:", err);
    document.getElementById("notifList").innerHTML = '<li class="p-4 text-red-500">⚠️ Error loading summary</li>';
  }
}

document.addEventListener("DOMContentLoaded", loadNotificationSummary);

