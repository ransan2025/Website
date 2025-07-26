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


const scriptURL = 'https://script.google.com/macros/s/AKfycbzwsnLhg4BrK3LfCgL9ZKfzrVjZyd6omq0x4W2BG0GLIMMRbg8NqqZxFFAEND3J-1hI/exec';
const crmScriptURL = 'https://script.google.com/macros/s/AKfycbxFX-rVFLtHUlwrZVJxu6ZhZk25oKPUYqT6cLo2j359fe_BndAg6BjOvGz6Y1R9R4wqBw/exec';
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

  // Add event listeners for sub-tabs
  document.querySelectorAll('.sub-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const subtabId = btn.dataset.subtab;
      showSub(subtabId);

      // Additional logic based on sub-tab
      if (subtabId === 'view-leads') {
        loadCRMHeaders().then(loadCRMEntries);
      }
      if (subtabId === 'add-estore') loadHeaders();
      if (subtabId === 'view-estore') loadExistingEntries();
      if (subtabId === 'sales-dashboard') {
        // Ensure chart buttons initialize once visible

        loadSalesDashboard();
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

document.getElementById('add-tab-btn')?.addEventListener('click', () => {
  showSub('add-estore');
  loadHeaders();
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

document.getElementById('add-tab-btn')?.addEventListener('click', () => {
  showSub('add-estore');
  loadHeaders();
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

  // Force re-show sales dashboard and report container if it's that subtab
  if (id === 'sales-dashboard') {
    document.getElementById('salesTabs')?.classList.remove('hidden');
    document.getElementById('sales-report-container')?.classList.remove('hidden');
  }
}


async function loadHeaders() {
  const res = await fetch(`${scriptURL}?action=getHeaders`);
  headers = await res.json();
  const form = document.getElementById('addForm');
  form.innerHTML = '';
  headers.forEach(h => {
    form.innerHTML += `
        <div class="flex flex-col">
          <label class="font-medium mb-1">${h}</label>
          <input type="text" name="${h}" class="p-2 rounded border w-full text-black" />
        </div>`;
  });
}

async function submitForm() {
  const form = document.getElementById('addForm');
  const fd = new FormData(form);
  const data = {};
  headers.forEach(h => data[h] = fd.get(h) || '');
  const msg = document.getElementById('submit-message');
  msg.classList.add('hidden');
  await fetch(`${scriptURL}?action=submit`, {
    method: 'POST',
    body: JSON.stringify(data)
  });
  msg.textContent = '✅ Entry Added!';
  msg.classList.remove('hidden');
  form.reset();
}

async function loadExistingEntries() {
  const container = document.getElementById('estore-existing-table');
  container.innerHTML = getLoader();
  try {
    const res = await fetch(`${scriptURL}?action=getAllEntries`);
    const data = await res.json();
    console.log("📦 eStore Data Received:", data); // ✅ Check if data arrives
    if (!Array.isArray(data)) throw new Error("Invalid data format");
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
  table.className = 'min-w-full text-sm text-left border sticky-header freeze-column';
  const thead = document.createElement('thead');
  thead.innerHTML = `<tr><th class="p-2 border">#</th>` +
    columns.map(h => `<th class="p-2 border">${h}</th>`).join('') +
    `<th class="p-2 border">Actions</th></tr>`;
  table.appendChild(thead);

  const tbody = document.createElement('tbody');
  data.forEach((r, i) => {
    const row = document.createElement('tr');
    row.innerHTML = `<td class="p-2 border bg-white">${i + 1}</td>` +
      columns.map(h => `<td class="p-2 border"><input class="w-[200px] p-1 border rounded text-black" value="${r[h] || ''}" data-key="${h}" disabled/></td>`).join('') +
      `<td class="p-2 border space-x-2">
            <button onclick="editRow(this)" class="text-blue-500">✏️</button>
            <button onclick="cancelRow(this)" class="text-yellow-500 hidden">❌</button>
            <button onclick="updateRow(this,${r.id}, ${isCRM})" class="text-green-600 hidden">✅</button>
            <button onclick="deleteRow(this,${r.id}, ${isCRM})" class="text-red-500">🗑️</button>
          </td>`;
    tbody.appendChild(row);
  });
  table.appendChild(tbody);
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
  const row = btn.closest('tr');
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

  // Hide all other report tabs
  container.querySelectorAll(".tab-content").forEach(rep => {
    rep.classList.remove("active");
    rep.classList.add("hidden");
    rep.style.display = 'none';
    rep.style.visibility = 'hidden';
  });

  // Show selected report tab
  const report = document.getElementById(id);
  if (report) {
    report.classList.remove("hidden");
    report.classList.add("active");
    report.style.display = 'block';
    report.style.visibility = 'visible';
    console.log("✅ Showing report:", id);
  } else {
    console.warn("⚠️ Report not found:", id);
  }
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
  drawTable('leadVolumeTable', ['Date', 'Leads'], labels.map((d, i) => [d, values[i]]));
}

function renderPaidUnpaid(data) {
  const grouped = groupBy(data, 'Status');
  const labels = Object.keys(grouped);
  const values = labels.map(s => grouped[s].length);

  drawChart('paidUnpaidChart', 'pie', labels, values, '', ['#16a34a', '#facc15', '#f43f5e']);
  drawTable('paidUnpaidTable', ['Status', 'Count'], labels.map((l, i) => [l, values[i]]));
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
  drawTable('topProductsTable', ['Product', 'Revenue'], labels.map((l, i) => [l, values[i]]));
}

function renderLeadsByProduct(data) {
  const grouped = groupBy(data, 'Product');
  const labels = Object.keys(grouped);
  const values = labels.map(l => grouped[l].length);

  drawChart('leadsByProductChart', 'bar', labels, values, 'Leads', '#3b82f6');
  drawTable('leadsByProductTable', ['Product', 'Count'], labels.map((l, i) => [l, values[i]]));
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
}

function renderConversion(data) {
  const total = data.length;
  const paid = data.filter(d => d.Status === 'Paid Order').length;
  const rate = ((paid / total) * 100).toFixed(2);

  document.getElementById('conversionRateKPI').textContent = `Conversion Rate: ${rate}%`;
  drawTable('conversionRateTable', ['Metric', 'Count'], [["Total Leads", total], ["Paid Orders", paid], ["Conversion %", `${rate}%`]]);
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
  drawTable('dailyRevenueTable', ['Date', 'Revenue'], labels.map((d, i) => [d, values[i]]));
}

function renderUniqueUsers(data) {
  const emails = new Set(data.map(d => d.Email).filter(Boolean));
  const phones = new Set(data.map(d => d.Phone).filter(Boolean));

  document.getElementById('uniqueUsersKPI').textContent = `Unique Users: ${emails.size + phones.size}`;
  drawTable('uniqueUsersTable', ['Type', 'Count'], [["Emails", emails.size], ["Phones", phones.size]]);
}

function renderAbandoned(data) {
  const leads = data.filter(d => d.Status === 'Interested' && (!d.PaymentID || !parseFloat(d.Amount)));
  const rows = leads.map(d => [d.Timestamp, d.Name, d.Email, d.Phone, d.Product, d.Status]);
  drawTable('abandonedLeadsTable', ['Date', 'Name', 'Email', 'Phone', 'Product', 'Status'], rows);
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
  drawTable("totalRevenueTable", ["Period", "Revenue"], labels.map((k, i) => [k, values[i]]));
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
