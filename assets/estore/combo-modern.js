
async function loadComboXOffers() {
  const sheetId = getComboSheetId();
  const apiKey = getComboApiKey();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/Sheet1!A1:Z?key=${apiKey}`;
  const container = document.getElementById("comboX-offers");
  container.innerHTML = "";

  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values;
    if (!rows || rows.length < 2) {
      container.innerHTML = `<p class="comboX-empty">No combo data loaded.</p>`;
      return;
    }

    const combos = {};
    const headers = rows[0];
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      const comboName = row[18]; // Column S
      const comboEndTime = row[20]; // Column U
      if (!comboName) continue;

      const product = {
        name: row[0],
        mrp: parseFloat(row[3]) || 0,
        price: parseFloat(row[19]) || 0,
        img: row[4],
        comboEndTime: comboEndTime
      };

      if (!combos[comboName]) {
        combos[comboName] = {
          products: [],
          totalMrp: 0,
          totalPrice: 0,
          comboEndTime: null
        };
      }

      combos[comboName].products.push(product);
      combos[comboName].totalMrp += product.mrp;
      combos[comboName].totalPrice += product.price;

      if (!combos[comboName].comboEndTime && comboEndTime) {
        combos[comboName].comboEndTime = comboEndTime;
      }
    }

    const sortedCombos = Object.entries(combos).sort((a, b) => {
      const aNum = parseInt(a[0].replace(/\D/g, ""));
      const bNum = parseInt(b[0].replace(/\D/g, ""));
      return aNum - bNum;
    });

    const now = new Date();
    const html = sortedCombos.map(([comboName, combo], index) => {
      if (combo.comboEndTime) {
        const expiry = new Date(combo.comboEndTime);
        if (expiry < now) return ""; // 🔴 Auto-hide expired
      }

      const names = combo.products.map(p => p.name).join(", ");
      const images = combo.products.map(p => `<img src="${p.img}" alt="${p.name}">`).join("");

      const youSave = combo.totalMrp - combo.totalPrice;
      const savePercent = Math.round((youSave / combo.totalMrp) * 100);

      return `
        <div class="comboX-card">
          <div class="comboX-badge">${savePercent}% OFF</div>
          <h3 class="comboX-title">📦 ${comboName}
            ${combo.comboEndTime ? `
            <span class="comboX-time-tag green" data-endtime="${combo.comboEndTime}" id="timer-${index}">
              ⏳ <span class="time">Loading...</span>
            </span>` : ``}
          </h3>
          <div class="comboX-imgs">${images}</div>
          <p class="comboX-products">Includes: ${names}</p>
          <div class="comboX-price">
            <span style="text-decoration:line-through;color:#999;">₹${combo.totalMrp.toFixed(2)}</span>
            &nbsp; <span style="font-weight:bold;color:#2ecc71;">₹${combo.totalPrice.toFixed(2)}</span>
            <div class="comboX-save">You Save: ₹${youSave.toFixed(2)} (${savePercent}% OFF)</div>
          </div>
          <button class="comboX-toggle" onclick="toggleComboXBenefits(this)">
            <span>View Benefits</span><span class="comboX-arrow">▼</span>
          </button>
          <ul class="comboX-benefits hidden">
            <li>✔️ Premium Access to 3 Tools</li>
            <li>📱 24x7 WhatsApp Support</li>
            <li>📄 Instant PDF Invoice</li>
          </ul>
          <button class="comboX-btn" onclick="payWithRazorpay('${comboName}', ${combo.totalPrice})">✨ Avail Combo</button>
        </div>`;
    }).filter(Boolean).join("");

    container.innerHTML = `<h2 class="comboX-header">🔥 Combo Offers</h2><div class="comboX-list">${html}</div>`;

    initComboCountdownTimers();

  } catch (err) {
    console.error("Combo load error:", err);
    container.innerHTML = `<p class="comboX-error">Error loading combo offers</p>`;
  }
}

function initComboCountdownTimers() {
  const allTags = document.querySelectorAll('.comboX-time-tag');

  allTags.forEach(tag => {
    const endTimeStr = tag.getAttribute('data-endtime');
    if (!endTimeStr) return;
    const span = tag.querySelector('.time');
    const endTime = new Date(endTimeStr);

    function update() {
      const now = new Date();
      const diff = endTime - now;
      if (diff <= 0) {
        span.innerText = "Expired";
        tag.classList.remove("green", "orange", "red");
        tag.classList.add("red");
        return;
      }
      const h = Math.floor(diff / (1000 * 60 * 60));
      const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const s = Math.floor((diff % (1000 * 60)) / 1000);
      span.innerText = `${h}h ${m}m ${s}s`;

      tag.classList.remove("green", "orange", "red");
      if (diff <= 6 * 3600000) tag.classList.add("red");
      else if (diff <= 24 * 3600000) tag.classList.add("orange");
      else tag.classList.add("green");

      requestAnimationFrame(update);
    }

    update();
  });
}

function toggleComboXBenefits(el) {
  const list = el.nextElementSibling;
  const arrow = el.querySelector('.comboX-arrow');
  list.classList.toggle('hidden');
  el.querySelector('span').textContent = list.classList.contains('hidden') ? 'View Benefits' : 'Hide Benefits';
  arrow.textContent = list.classList.contains('hidden') ? '▼' : '▲';
}

loadComboXOffers();
