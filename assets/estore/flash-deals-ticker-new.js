// ✅ RanSan Groups - Isolated Flash Deals Right Ticker JS

const rsgSheetId = '1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU';
const rsgApiKey = 'AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE';
const rsgRange = 'Sheet1!A2:M';

async function loadRsgFlashTicker() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${rsgSheetId}/values/${rsgRange}?key=${rsgApiKey}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values || data.values.length === 0) return;

    const tickerWrapper = document.getElementById('rsg-ticker-items');
    let tickerHTML = '';

    data.values.forEach(row => {
      const name = row[0] || "";
      const img = row[4] || "https://via.placeholder.com/40";
      const emoji = row[11] || "🔥";
      const isDealOfDay = row[12] && row[12].toLowerCase() === "yes";

      if (isDealOfDay) {
        tickerHTML += `
          <div class="rsg-ticker-item">
            <img src="${img}" alt="${name}">
            <div class="rsg-item-text">${emoji} ${name}</div>
          </div>
        `;
      }
    });

    tickerWrapper.innerHTML = tickerHTML + tickerHTML; // Duplicate for smooth loop
  } catch(e) {
    console.error("Ticker Load Failed", e);
  }
}

window.addEventListener('load', loadRsgFlashTicker);
