document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("offersToggleBtn");
  const offerPanel = document.getElementById("offersPanel");

  // Toggle Offers Panel on Button Click
  toggleBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    offerPanel.classList.toggle("active");
  });

  // Close panel if clicked outside
  document.addEventListener("click", (e) => {
    if (!offerPanel.contains(e.target) && !toggleBtn.contains(e.target)) {
      offerPanel.classList.remove("active");
    }
  });

  // Optional: ESC key to close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      offerPanel.classList.remove("active");
    }
  });

  // 🔁 Dynamic Amazon Deal Rotator
  const dealText = document.getElementById("amazonDealText");
  const amazonDeals = [
    "⚡ 80% Off on Electronics",
    "🎧 Noise Cancelling Headphones ₹1,999",
    "📱 Best Phones Under ₹10K",
    "💻 Top Laptops Deals",
    "📦 Combo: Amazon + Flipkart + Meesho"
  ];

  if (dealText) {
    setInterval(() => {
      const random = Math.floor(Math.random() * amazonDeals.length);
      dealText.textContent = `🔥 ${amazonDeals[random]}`;
    }, 5000);
  }
});
