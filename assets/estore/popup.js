const POPUP_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo/gviz/tq?tqx=out:json&sheet=CRM Leads';
const POPUP_JSON_URL = 'assets/estore/popup-data.json';

let popupData = [];

// Helper: Convert ISO time to "minutes ago"
function getMinutesAgo(isoTime) {
    const eventTime = new Date(isoTime).getTime();
    const now = Date.now();
    const mins = Math.floor((now - eventTime) / (1000 * 60));
    return mins === 0 ? "Just now" : `${mins} min ago`;
}

// Fetch from Google Sheet
async function fetchSheetData() {
    try {
        const res = await fetch(POPUP_SHEET_URL);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;

        const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000);
        const filteredOrders = [];

        for (let i = rows.length - 1; i >= 0; i--) {
            const cells = rows[i].c;
            const timeISO = cells[0]?.v;
            const name = cells[1]?.v || "Customer";
            const product = cells[4]?.v || "Product";
            const status = cells[6]?.v;

            if (status === "Paid Order") {
                const eventTime = new Date(timeISO).getTime();

                if (eventTime >= fiveHoursAgo) {
                    filteredOrders.push({
                        name: name,
                        product: product,
                        minutesAgo: getMinutesAgo(timeISO)
                    });
                }
            }
        }

        return filteredOrders;
    } catch (err) {
        console.error("Popup: Error fetching Google Sheet:", err);
        return [];
    }
}

// Fetch from JSON
async function fetchJSONData() {
    try {
        const res = await fetch(POPUP_JSON_URL);
        const jsonData = await res.json();

        return jsonData.map(item => ({
            name: item.name || "Customer",
            product: item.product || "Product",
            minutesAgo: item.minutesAgo ? `${item.minutesAgo} min ago` : `${Math.floor(Math.random() * 10) + 1} min ago`
        }));
    } catch (err) {
        console.error("Popup: Error fetching popup-data.json:", err);
        return [];
    }
}

// Show popup with modern UI
function showPopup(item) {
    const popup = document.getElementById("popup");

    popup.innerHTML = `
        <div class="popup-inner">
            <div class="popup-avatar">🛍️</div>
            <div class="popup-content">
                <strong>${item.name}</strong> purchased <span class="popup-product">${item.product}</span>
                <div class="popup-time">⏱️ ${item.minutesAgo}</div>
            </div>
        </div>
        <div class="popup-progress"></div>
    `;

    popup.classList.add("show");

    setTimeout(() => {
        popup.classList.remove("show");
    }, 4000);
}

// Rotate popups in order
function startRotation() {
    let index = 0;
    setInterval(() => {
        if (popupData.length === 0) return;
        showPopup(popupData[index]);
        index = (index + 1) % popupData.length;
    }, 7000);
}

// Initialize popup system
async function initPopup() {
    const sheetData = await fetchSheetData();
    const jsonData = await fetchJSONData();

    popupData = [...sheetData, ...jsonData];

    if (popupData.length === 0) {
        console.warn("Popup: No data found");
        return;
    }

    // Inject styles and container
    injectPopupStyles();
    startRotation();
}

window.addEventListener('load', initPopup);

// Inject popup container and styles dynamically
function injectPopupStyles() {
    // Create popup container
    const popup = document.createElement('div');
    popup.id = "popup";
    document.body.appendChild(popup);

    // Create styles
    const style = document.createElement('style');
    style.innerHTML = `
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

    #popup {
        position: fixed;
        bottom: 30px;
        left: 30px;
        background: rgba(30, 30, 30, 0.85);
        color: #fff;
        padding: 18px 22px;
        border-radius: 16px;
        box-shadow: 0 12px 32px rgba(0,0,0,0.3);
        backdrop-filter: blur(10px);
        font-family: 'Poppins', sans-serif;
        font-size: 15px;
        max-width: 360px;
        line-height: 1.5;
        display: none;
        opacity: 0;
        transform: translateY(20px) scale(0.95);
        transition: opacity 0.4s ease, transform 0.4s ease;
        z-index: 9999;
    }

    #popup.show {
        display: block;
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    .popup-inner {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .popup-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #4caf50;
        font-size: 24px;
        flex-shrink: 0;
    }

    .popup-content {
        flex: 1;
    }

    .popup-product {
        background: #ffc107;
        color: #000;
        padding: 2px 8px;
        border-radius: 8px;
        font-weight: 600;
        margin-left: 4px;
    }

    .popup-time {
        font-size: 12px;
        color: #ccc;
        margin-top: 4px;
    }

    .popup-progress {
        height: 4px;
        background: #4caf50;
        width: 100%;
        margin-top: 10px;
        border-radius: 2px;
        animation: progressBar 4s linear forwards;
    }

    @keyframes progressBar {
        from { width: 100%; }
        to { width: 0%; }
    }
    `;
    document.head.appendChild(style);
}
