const tickerSheetId = "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU";
const tickerApiKey = "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE";
const tickerRange = "Sheet1!K2:K50";

let currentIndex = 0;
let flashDeals = [];

async function fetchFlashDeals() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${tickerSheetId}/values/${tickerRange}?key=${tickerApiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data.values && data.values.length > 0) {
      flashDeals = data.values.map(row => row[0]).filter(Boolean);
      if (flashDeals.length > 0) {
        startFlashingDeals();
      } else {
        showDeal("No flash deals currently");
      }
    } else {
      showDeal("No flash deals found");
    }
  } catch (err) {
    console.error("❌ Error fetching deals:", err);
    showDeal("Error loading deals");
  }
}

function showDeal(text) {
  const container = document.getElementById("flash-deals-ticker");
  if (container) {
    container.innerHTML = `<div class="fd-ticker-content">${text}</div>`;
  }
}

function startFlashingDeals() {
  showDeal(flashDeals[currentIndex]);

  setInterval(() => {
    currentIndex = (currentIndex + 1) % flashDeals.length;
    showDeal(flashDeals[currentIndex]);
  }, 8000);
}

document.addEventListener("DOMContentLoaded", fetchFlashDeals);
