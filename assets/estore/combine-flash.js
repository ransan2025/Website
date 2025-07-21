const sheetIdDeals = '1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU';
const apiKeyDeals = 'AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE';
const rangeDeals = 'Sheet1!K2:T';

async function fetchDeals() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetIdDeals}/values/${rangeDeals}?key=${apiKeyDeals}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.values) {
    renderModules(data.values);
  }
}

function renderModules(rows) {
  let flashDeals = '';
  let dealsOfDay = '';
  let bestValue = '';
  let justDropped = '';
  let comboOffers = '';

  rows.forEach(row => {
    const [flashMsg, dealName, origPrice, dealPrice, bestValueText, stockText, newDropName, newDropImg, comboDesc, comboPrice] = row;

    // 🔥 Flash Deals Ticker (Auto-scroll with multiple messages)
    if (flashMsg) {
      flashDeals += `<span style="margin-right:40px;">${flashMsg}</span>`;
    }

    // 🚀 Deals of the Day
    if (dealName && origPrice && dealPrice) {
      dealsOfDay += `
        <div class="deals-of-day-item">
          <h3>${dealName}</h3>
          <div>
            <span style="font-size:16px; font-weight:bold;">₹${dealPrice}</span> 
            <del style="font-size:14px; opacity:0.7; margin-left:5px;">₹${origPrice}</del>
          </div>
          <button class="buy-btn" onclick="alert('Buying ${dealName}')">Buy</button>
        </div>
      `;
    }

    // 🎯 Best Value Picks
    if (bestValueText) {
      bestValue += `
        <div class="best-value-card">
          ${bestValueText}
          <div style="font-size:12px; color:#666; margin-top:5px;">${stockText || ''}</div>
        </div>
      `;
    }

    // 🆕 Just Dropped
    if (newDropName && newDropImg) {
      justDropped += `
        <div class="just-dropped-card">
          <img src="${newDropImg}" alt="${newDropName}" width="100" style="border-radius:8px; margin-bottom:5px;"><br>
          ${newDropName}
        </div>
      `;
    }

    // 📦 Combo Offers
    if (comboDesc && comboPrice) {
      comboOffers += `
        <div class="combo-offer-card">
          ${comboDesc}<br>
          <span style="color:#2196f3; font-weight:bold;">${comboPrice}</span>
        </div>
      `;
    }
  });

  // Inject into HTML

  document.getElementById('flash-deals-ticker').innerHTML = flashDeals || '🔥 No flash deals currently';

  document.getElementById('deals-of-day-section').innerHTML = `
    <h2 style="margin-bottom:10px;">🚀 Deals of the Day</h2>
    ${dealsOfDay || '<p>No deals today.</p>'}
  `;

  document.getElementById('best-value-picks').innerHTML = `
    <h2 style="margin-bottom:10px;">🎯 Best Value Picks</h2>
    <div class="best-value-picks-grid">${bestValue || '<p>No best picks.</p>'}</div>
  `;

  document.getElementById('just-dropped').innerHTML = `
    <h2 style="margin-bottom:10px;">🆕 Just Dropped</h2>
    <div style="display:flex; overflow-x:auto; gap:15px;">${justDropped || '<p>No new drops.</p>'}</div>
  `;

  document.getElementById('combo-offers').innerHTML = `
    <h2 style="margin-bottom:10px;">📦 Combo Offers</h2>
    ${comboOffers || '<p>No combos available.</p>'}
  `;
}

// Initialize
window.addEventListener('load', fetchDeals);
