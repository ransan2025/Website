const FD_SHEET_URL = 'https://docs.google.com/spreadsheets/d/1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU/gviz/tq?tqx=out:json&sheet=Sheet1';

async function loadFlashDeals() {
    try {
        const res = await fetch(FD_SHEET_URL);
        const text = await res.text();
        const json = JSON.parse(text.substr(47).slice(0, -2));
        const rows = json.table.rows;

        let content = '';

        rows.forEach(row => {
            const product = row.c[0]?.v || 'Product';
            const image = row.c[4]?.v || 'https://via.placeholder.com/40';
            const tag = (row.c[9]?.v || '').toLowerCase();

            let badgeClass = 'fd-badge';
            if (tag === 'deal') badgeClass += ' deal';

            content += `
                <div class="swiper-slide fd-slide">
                    <img src="${image}" class="fd-image" alt="${product}" />
                    <div class="fd-info">
                        <div class="fd-name">${product}</div>
                        <div class="${badgeClass}">${tag || 'Trending'}</div>
                    </div>
                </div>
            `;
        });

        document.getElementById('fd-content').innerHTML = content;

        new Swiper('.fd-swiper', {
            loop: true,
            autoplay: { delay: 2500, disableOnInteraction: false },
            slidesPerView: 3,
            spaceBetween: 10,
            breakpoints: {
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 }
            }
        });

    } catch (err) {
        console.error('Flash Deals Error:', err);
    }
}

window.addEventListener('load', loadFlashDeals);
