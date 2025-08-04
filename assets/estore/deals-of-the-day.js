
// ✅ Isolated identifiers

const dealSheetId = getDealSheetId();
const dealApiKey = getDealApiKey();

const dealRange = "Sheet1!A2:T100";   // Adjust if needed

// Convert to viewable Google Drive image format
function convertToDirectImageUrl(originalUrl) {
  const match = originalUrl.match(/\/d\/([^/]+)/);
  return match ? `https://drive.google.com/uc?export=view&id=${match[1]}` : originalUrl;
}

// ✅ Load Deals of the Day (Only affects this block)
async function loadDealsOfTheDay() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${dealSheetId}/values/${dealRange}?key=${dealApiKey}`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!data.values || data.values.length === 0) {
      document.getElementById("dotd-container").innerHTML = "<p>No deals found.</p>";
      return;
    }

    const rows = data.values;
    const container = document.getElementById("dotd-container");
    if (!container) return;

    // Column mappings
    const nameCol = 11;
    const mrpCol = 12;
    const dealCol = 13;
    const descCol = 1; // ✅ Description from Column B
    const originalcol = 2; // orginal price
    const imagenamecol = 4; // Image URL
    const timerCol = 14; // Column K - e.g., "3h"
    const stockCol = 15; // Column P - stock left (e.g., "Only 12 left!")

    const filtered = rows.filter(row => row[nameCol] && row[dealCol]);
    const top3 = filtered.slice(0, 3);

    if (top3.length === 0) {
      container.innerHTML = "<p>No valid deals available.</p>";
      return;
    }

    container.innerHTML = top3.map(row => {
      const name = row[nameCol];
      const mrp = row[mrpCol] || '';
      const deal = row[dealCol];
      const origPrice = row[originalcol];
      const rawDriveUrl = row[imagenamecol]; // Column E
      let img = rawDriveUrl || "";
if (img.includes("drive.google.com")) {
  const match = img.match(/\/d\/([^/]+)/);
  if (match) {
    img = `https://drive.google.com/uc?export=view&id=${match[1]}`;
  }
}
      const desc = row[descCol] || `This is a great deal on ${name}!`;
      const timer = row[timerCol] || ''; // 🆕
      const stock = row[stockCol] || ''; // 🆕

      return `
        <div class="dotd-card">
          <div class="dotd-name">${name}</div>
          <div class="dotd-price"><del>₹${mrp}</del> <span>₹${deal}</span></div>
		  
		  <!-- 🆕 Deal badge area -->
          <div class="dotd-badges">
            ${timer ? `<span class="dotd-badge time">⏳ Ends in ${timer}</span>` : ""}
            ${stock ? `<span class="dotd-badge stock">📦 ${stock}</span>` : ""}
          </div>
		  
          <button class="dotd-button" onclick="showProductDetails('${name}', \`${desc}\`, ${deal}, '${img}', ${origPrice})">Buy Now</button>
        </div>
      `;
    }).join("");

  } catch (err) {
    console.error("Error fetching Deals of the Day:", err);
    document.getElementById("dotd-container").innerHTML = "<p>Error loading deals.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadDealsOfTheDay);
window.addEventListener("DOMContentLoaded", loadDealsOfTheDay);