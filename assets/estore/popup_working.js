const POPUP_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo/gviz/tq?tqx=out:json&sheet=CRM Leads';
const POPUP_JSON_URL = 'assets/estore/popup-data.json';

let popupData = [];

// Helper: Convert ISO time to "minutes ago"
function getMinutesAgo(isoTime) {
    const eventTime = new Date(isoTime).getTime();
    const now = Date.now();
    return Math.floor((now - eventTime) / (1000 * 60)); // in minutes
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
            const product = cells[4]?.v || "Product"; // FIXED: Take product from Column E (index 4)
            const status = cells[6]?.v;

            if (status === "Paid Order") {
                const eventTime = new Date(timeISO).getTime();

                if (eventTime >= fiveHoursAgo) {
                    const minutesAgo = getMinutesAgo(timeISO);
                    filteredOrders.push({
                        name: name,
                        product: product,
                        minutesAgo: minutesAgo
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
            minutesAgo: item.minutesAgo || (Math.floor(Math.random() * 10) + 1)
        }));
    } catch (err) {
        console.error("Popup: Error fetching popup-data.json:", err);
        return [];
    }
}

// Show popup
function showPopup(item) {
    const popup = document.getElementById("popup");
    popup.innerText = `${item.name} purchased ${item.product} ${item.minutesAgo} min ago`;
    popup.style.display = "block";

    setTimeout(() => {
        popup.style.display = "none";
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

    startRotation();
}

window.addEventListener('load', initPopup);
