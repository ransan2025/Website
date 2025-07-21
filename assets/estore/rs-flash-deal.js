// FLASH DEALS MODULE JS

function loadFlashDealsModule() {
    const flashDeals = [
        { emoji: "🔥", product: "AirPods Pro 2", tag: "Limited Offer", discount: "42% OFF", expiry: "" },
        { emoji: "🎮", product: "PS5 Controller", tag: "Deal of the Day", discount: "", expiry: "Ends in 3 hrs" }
    ];

    let container = document.getElementById('flashDealsModule');
    container.innerHTML = "<h4 style='margin-bottom:12px;'>🔥 Flash Deals</h4>";

    flashDeals.forEach(deal => {
        let dealHTML = `
            <div class="flashDealItem">
                <div class="flashDealIcon">${deal.emoji}</div>
                <div class="flashDealContent">
                    <div class="flashDealTitle">${deal.product}</div>
                    <div>
                        <span class="flashDealTag">&lt;${deal.tag}&gt;</span>
                        ${deal.discount ? `<span class="flashDealDiscount">⚡ ${deal.discount}</span>` : ''}
                        ${deal.expiry ? `<span class="flashDealExpiry">🕒 ${deal.expiry}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += dealHTML;
    });
}
