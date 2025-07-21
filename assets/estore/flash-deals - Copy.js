const SHEET_URL = 'https://docs.google.com/spreadsheets/d/1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo/gviz/tq?tqx=out:json&sheet=CRM Leads';
const JSON_URL = 'assets/popup-data.json';

let dealsData = [];

function getMinutesAgo(isoTime) {
    const eventTime = new Date(isoTime).getTime();
    const now = Date.now();
    return Math.floor((now - eventTime) / (1000 * 60));
}

async function fetchSheet() {
    try {
        const res = await fetch(SHEET_URL);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;

        const recent = [];
        const fiveHoursAgo = Date.now() - (5 * 60 * 60 * 1000);

        for (let i = rows.length - 1; i >= 0; i--) {
            const c = rows[i].c;
            const timeISO = c[0]?.v;
            const name = c[1]?.v || "Customer";
            const product = c[4]?.v || "Product";
            const status = c[6]?.v;

            if (status === "Paid Order" && new Date(timeISO).getTime() >= fiveHoursAgo) {
                recent.push({
                    name, product, minutesAgo: getMinutesAgo(timeISO)
                });
            }
        }

        return recent;
    } catch (err) {
        console.error("Error fetching sheet", err);
        return [];
    }
}

async function fetchJson() {
    try {
        const res = await fetch(JSON_URL);
        const data = await res.json();
        return data.map(item => ({
            name: item.name,
            product: item.product,
            minutesAgo: item.minutesAgo
        }));
    } catch (err) {
        console.error("Error fetching JSON", err);
        return [];
    }
}

function createPopup(item) {
    const wrapper = document.createElement("div");
    wrapper.className = "flash-deals-popup";

    const badge = document.createElement("div");
    badge.className = "badge";
    badge.innerText = item.minutesAgo < 5 ? "⚡ Just Now" : "🔥 Trending";

    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML = `<strong>${item.name}</strong> purchased <strong>${item.product}</strong> <em>${item.minutesAgo} min ago</em>`;

    wrapper.appendChild(badge);
    wrapper.appendChild(content);

    return wrapper;
}

function startTicker() {
    let index = 0;
    const container = document.getElementById("flash-deals-content");

    setInterval(() => {
        container.innerHTML = "";
        if (dealsData.length === 0) return;

        const popup = createPopup(dealsData[index]);
        const slide = document.createElement("div");
        slide.className = "swiper-slide";
        slide.appendChild(popup);

        container.appendChild(slide);

        index = (index + 1) % dealsData.length;
    }, 6000);
}

async function initDeals() {
    const sheet = await fetchSheet();
    const json = await fetchJson();
    dealsData = [...sheet, ...json];

    if (dealsData.length === 0) {
        console.warn("No deals to display.");
        return;
    }

    startTicker();
}

window.addEventListener('load', initDeals);
