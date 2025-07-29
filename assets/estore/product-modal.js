// ✅ Open modal with product data
async function rsShowProduct(title) {
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${dealSheetId}/values/${dealRange}?key=${dealApiKey}`;
  try {
    const res = await fetch(url);
    const data = await res.json();
    const rows = data.values;

    const nameCol = 16, imgCol = 17, descCol = 18, b1 = 19, b2 = 20, b3 = 21;
    const product = rows.find(r => r[nameCol] === title);
    if (!product) return alert("Product not found.");

    document.getElementById("rs-modal-img").src = product[imgCol];
    document.getElementById("rs-modal-title").textContent = product[nameCol];
    document.getElementById("rs-modal-desc").textContent = product[descCol] || "";

    const benefits = [product[b1], product[b2], product[b3]].filter(Boolean);
    document.getElementById("rs-modal-benefits").innerHTML = benefits.map(b => `<li>${b}</li>`).join("");

    // ✅ Use your existing Razorpay or buy logic here
    document.getElementById("rs-buy-btn").onclick = () => {
      openCheckout(product[nameCol], product[18]); // Replace 18 if price column is different
    };

    document.getElementById("rs-product-popup").style.display = "block";
  } catch (err) {
    console.error("Product Modal Error:", err);
  }
}

// ✅ Close modal
function rsCloseModal() {
  document.getElementById("rs-product-popup").style.display = "none";
}
