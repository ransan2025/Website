function displayFlashDeals(products) {
  const flashContent = document.getElementById('flash-deals-content');
  flashContent.innerHTML = '';

  const deals = products.filter(p => (p[9] && p[9].toLowerCase() === "yes"));

  if (deals.length === 0) {
    flashContent.innerHTML = '<div class="swiper-slide">🚀 No Flash Deals Now</div>';
    return;
  }

  deals.forEach(p => {
    const [name, desc, orig, disc, img] = p;

    const slide = document.createElement('div');
    slide.className = "swiper-slide";
    slide.innerHTML = `
      <img src="${img}" alt="${name}">
      <span class="icon">🔥</span>
      <span class="deal-text">${name}</span>
    `;

    slide.onclick = () => {
      showDetails(name, desc);
    };

    flashContent.appendChild(slide);
  });

  new Swiper('.flash-deals-swiper', {
    loop: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false
    },
    direction: 'vertical',
    slidesPerView: 3,
    spaceBetween: 10,
    allowTouchMove: false
  });
}
