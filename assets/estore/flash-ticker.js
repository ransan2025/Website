const tickerSheetId = "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU";
const tickerApiKey = "AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE";
const tickerRange = "Sheet1!K2:L50"; // K = Deal Text, L = URL (optional)

let tickerIndex = 0;
let tickerDeals = [];

async function fetchFlashDeals() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${tickerSheetId}/values/${tickerRange}?key=${tickerApiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.values && data.values.length > 0) {
      tickerDeals = data.values
        .filter(row => row[0]) // Only if text exists
        .map(row => ({
          text: row[0],
          link: row[1] || null
        }));

      if (tickerDeals.length > 0) {
        rotateDeals();
      } else {
        showDeal("No flash deals currently");
      }
    } else {
      showDeal("No flash deals found");
    }
  } catch (err) {
    console.error("❌ Error fetching flash deals:", err);
    showDeal("Error loading deals");
  }
}

function showDeal(text) {
  const container = document.querySelector(".fd-ticker-content");
  if (!container) return;

  container.classList.remove("fade-in");

  setTimeout(() => {
    // Try to find product in allProducts by matching Flash Deal text to Column A (Product Name)
    const match = allProducts.find(p => text.includes(p[0]));

    if (match) {
      const [name, desc, , price] = match;
      container.innerHTML = `<span 
  onclick="showProductDetails(\`${name}\`, \`${desc}\`, ${price})" 
  style="cursor:pointer;" 
  role="button" 
  tabindex="-1"
>${text}</span>`;
    } else {
      container.innerHTML = `<span>${text}</span>`;
    }

    container.classList.add("fade-in");
  }, 100);
}

function rotateDeals() {
  showDeal(tickerDeals[tickerIndex].text, tickerDeals[tickerIndex].link);

  setInterval(() => {
    tickerIndex = (tickerIndex + 1) % tickerDeals.length;
    showDeal(tickerDeals[tickerIndex].text, tickerDeals[tickerIndex].link);
  }, 8000);
}

document.addEventListener("DOMContentLoaded", fetchFlashDeals);
