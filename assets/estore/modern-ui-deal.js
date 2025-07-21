// flashdeals.js - Fully Isolated Flash Deals & Deals of the Day

const flashDealsSheetURL = "https://docs.google.com/spreadsheets/d/1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU/gviz/tq?tqx=out:json";

const enableDealsOfDaySection = true; // Set to false to disable homepage section

function loadFlashDeals() {
    fetch(flashDealsSheetURL)
        .then(res => res.text())
        .then(data => {
            const json = JSON.parse(data.substr(47).slice(0, -2));
            const rows = json.table.rows;

            let flashDeals = [];
            let dealsOfDay = [];

            rows.forEach(row => {
                const productName = row.c[0]?.v || "Unnamed";
                const productImage = row.c[4]?.v || "assets/fallback-product.png";
                const discount = row.c[5]?.v || "";
                const expiry = row.c[10]?.v || "";
                const icon = row.c[11]?.v || "🔥";
                const isDealOfDay = row.c[12]?.v || "";

                const dealObj = {
                    productName,
                    productImage,
                    discount,
                    expiry,
                    icon,
                    isDealOfDay
                };

                if (isDealOfDay === "Yes") {
                    dealsOfDay.push(dealObj);
                } else {
                    flashDeals.push(dealObj);
                }
            });

            renderFlashDeals(flashDeals);
            if (enableDealsOfDaySection) renderDealsOfDay(dealsOfDay);
        })
        .catch(err => {
            console.error("Flash Deals Error:", err);
            document.querySelector("#flash-deals-content").innerHTML = `<div class="flash-no-deals">Error loading deals</div>`;
        });
}

function renderFlashDeals(deals) {
    const container = document.querySelector("#flash-deals-content");
    if (deals.length === 0) {
        container.innerHTML = `<div class="flash-no-deals">🚫 No Flash Deals</div>`;
        return;
    }

    container.innerHTML = "";
    deals.forEach(deal => {
        const dealHTML = `
            <div class="flash-deal-item">
                <div class="flash-deal-title">${deal.icon} ${deal.productName}</div>
                <div class="flash-deal-badge">${deal.discount ? "⚡ " + deal.discount + " OFF" : ""} ${deal.expiry ? "🕒 " + deal.expiry : ""}</div>
            </div>
        `;
        container.innerHTML += dealHTML;
    });
}

function renderDealsOfDay(deals) {
    const section = document.createElement("section");
    section.id = "deals-of-day";

    let html = `<div class="deal-day-title">🎯 Deals of the Day</div><div class="deal-day-grid">`;

    if (deals.length === 0) {
        html += `<div class="flash-no-deals">🚫 No Deals of the Day</div>`;
    } else {
        deals.forEach(deal => {
            html += `
            <div class="deal-day-card">
                <img src="${deal.productImage}" alt="${deal.productName}" style="width:100%; border-radius:12px; margin-bottom:10px;">
                <div class="deal-day-name">${deal.icon} ${deal.productName}</div>
                <div class="deal-day-discount">${deal.discount ? deal.discount + " OFF" : ""}</div>
                <div class="flash-deal-meta">${deal.expiry ? "🕒 " + deal.expiry : ""}</div>
            </div>`;
        });
    }

    html += `</div>`;
    section.innerHTML = html;
    document.body.appendChild(section);
}

// Initialize widget
document.addEventListener("DOMContentLoaded", function() {
    const widget = document.createElement("div");
    widget.id = "flash-deals-widget";
    widget.innerHTML = `
        <div class="flash-deals-header">🔥 Flash Deals</div>
        <div id="flash-deals-content"><div class="flash-no-deals">Loading...</div></div>
    `;
    document.body.appendChild(widget);

    loadFlashDeals();
});
