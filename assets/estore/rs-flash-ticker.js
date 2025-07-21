// ✅ RanSan Groups - Flash Deals Loader (Completely Isolated)

(function() {
  const sheetId = '1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU';
  const apiKey = 'AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE';
  const range = 'Sheet1!A2:M';

  function loadRSFlashDeals() {
    fetch(`https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`)
      .then(res => res.json())
      .then(data => {
        const items = data.values || [];
        const container = document.getElementById('rs-flash-items');
        container.innerHTML = '';

        const flashDeals = items.filter(p => p[12] && p[12].toLowerCase() === 'yes');

        if (flashDeals.length === 0) {
          container.innerHTML = '<div style="padding:10px;text-align:center;">🚀 No Flash Deals</div>';
          return;
        }

        flashDeals.forEach(p => {
          const name = p[0];
          const img = p[4];
          const icon = p[11] || '🔥';
          const expiry = p[10] ? `${p[10]} left` : '';

          const dealDiv = document.createElement('div');
          dealDiv.className = 'rs-flash-item';
          dealDiv.innerHTML = `
            <img src="${img}" alt="${name}" />
            <div class="rs-flash-text">${icon} ${name}</div>
            ${expiry ? `<div class="rs-flash-badge">${expiry}</div>` : ''}
          `;

          dealDiv.onclick = function() {
            if (typeof showDetails === 'function') {
              showDetails(name, p[1]);
            } else {
              alert(name);
            }
          };

          container.appendChild(dealDiv);
        });
      })
      .catch(err => {
        console.error('Flash Deals Load Failed', err);
        document.getElementById('rs-flash-items').innerHTML = '<div style="padding:10px;">❌ Error loading deals.</div>';
      });
  }

  // Auto-run after page load
  window.addEventListener('load', loadRSFlashDeals);
})();
