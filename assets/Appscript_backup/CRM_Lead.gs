function doPost(e) {
  const sheetId = "1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo"; // CRM Google Sheet ID
  const crmSheet = SpreadsheetApp.openById(sheetId).getSheetByName("CRM Leads");
  const newsletterSheet = SpreadsheetApp.openById(sheetId).getSheetByName("Newsletter Leads");

  const params = JSON.parse(e.postData.contents);
  
  Logger.log("🔍 Incoming Lead Data: " + JSON.stringify(params));

  const timestamp = params.timestamp || new Date().toISOString();
  const name = params.name || "";
  const email = params.email || "";
  const phone = params.phone || "";
  const product = params.product || "";
  const amount = params.amount || "";
  const intent = params.intent || "";
  const paymentId = params.payment_id || "";

  // 1️⃣ Newsletter Lead Save
  if (intent === "Newsletter/WhatsApp Lead") {
    newsletterSheet.appendRow([
      new Date(),
      phone,
      timestamp
    ]);
    Logger.log("✅ Newsletter Lead Saved");
    return ContentService.createTextOutput("✅ Newsletter Lead Saved").setMimeType(ContentService.MimeType.TEXT);
  }

  // 2️⃣ Payment or Lead Handling
  const data = crmSheet.getDataRange().getValues();
  let found = false;

  for (let i = 1; i < data.length; i++) { // Skip header
    const existingTimestamp = data[i][0].toString().trim();
    if (existingTimestamp === timestamp.trim()) {
      found = true;

      // Update as Paid
      crmSheet.getRange(i + 1, 5).setValue(product); // Column E: Product
      crmSheet.getRange(i + 1, 6).setValue(amount);  // Column F: Amount
      crmSheet.getRange(i + 1, 7).setValue("Paid Order"); // Column G: Intent
      crmSheet.getRange(i + 1, 8).setValue(paymentId);   // Column H: Payment ID

      Logger.log("✅ Lead Updated to Paid");
      break;
    }
  }

  if (!found) {
    // New lead - Not Paid Yet
    const newRow = [
      timestamp,
      name,
      email,
      phone,
      product,
      amount,
      intent,
      paymentId
    ];

    crmSheet.appendRow(newRow);

    // Force timestamp column to stay as text
    crmSheet.getRange(crmSheet.getLastRow(), 1).setNumberFormat("@");

    Logger.log("✅ New Lead Saved as: " + intent);
  }

  return ContentService.createTextOutput("✅ CRM Lead Processed").setMimeType(ContentService.MimeType.TEXT);
}
