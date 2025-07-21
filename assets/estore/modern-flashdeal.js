
const sheetId = '1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU';
const apiKey = 'AIzaSyD910WtP7mqTugPsEv8ZQIMUbyNxOJlDqE';
const range = 'Sheet1!A2:J';

async function loadFlashDeals() {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();

  const track = document.getElementById('modern-deals-track');
  track.innerHTML = '';

  if (!data.values) {
    track.innerHTML = '<div style="color:#fff; padding:10px;">No deals available</div>';
    return;
  }

  const trending = data.values.filter(p => (p[9] && p[9].toLowerCase() === 'yes'));

  if (trending.length === 0) {
    track.innerHTML = '<div style="color:#fff; padding:10px;">🚀 No Trending Deals</div>';
    return;
  }

  // Duplicate list for infinite scroll illusion
  const allDeals = [...trending, ...trending];

  allDeals.forEach(p => {
    const [name,, , , img] = p;
    const item = document.createElement('div');
    item.className = 'deal-item';

    item.innerHTML = `
      <img src="${img}" alt="${name}">
      <span class="deal-name">🔥 ${name} <span class="pulse"></span></span>
    `;

    item.onclick = () => alert('Clicked on ' + name);
    track.appendChild(item);
  });
}

window.addEventListener('load', loadFlashDeals);

