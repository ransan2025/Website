function doPost(e) {
  try {
    Logger.log("🔧 Incoming Request: " + JSON.stringify(e));

    if (!e.parameter) {
      Logger.log("❌ Error: No parameters received.");
      return ContentService.createTextOutput("❌ Error: No parameters received.");
    }

    const ss = SpreadsheetApp.openById("1t2143Z6f0vP_waQ1ARJdQpTj22LM6vU7fPSOxwDK6xU");
    const params = e.parameter;

    // Service key determination
    const mainService = params.mainService || "General";
    const subService = params.subService || "";
    const nestedSubService = params.nestedSubService || "";
    const serviceKey = nestedSubService || subService || mainService;

    let sheet = ss.getSheetByName(serviceKey);
    if (!sheet) {
      sheet = ss.insertSheet(serviceKey);
      const keys = Object.keys(params);
      sheet.appendRow(keys);
      Logger.log("✅ Created new sheet: " + serviceKey);
    }

    // Append data
    const headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
    const row = headers.map(h => params[h] || "");
    sheet.appendRow(row);
    Logger.log("✅ Data saved for: " + serviceKey);

    // Send email confirmation
    const email = params.email;
    if (email) {
      GmailApp.sendEmail(email, "Thank you for your enquiry!", `Hi ${params.name},

Your enquiry for ${serviceKey} has been received. Our team will contact you shortly.

- RanSan Groups`);
      Logger.log("📧 Email sent to: " + email);
    }

    // Send WhatsApp using bdwamaster.site API
    const mobile = params.mobile;
    if (mobile) {
      const cleanPhone = formatPhoneNumber(mobile);
      const message = `Hi ${params.name}, your enquiry for ${serviceKey} has been received by RanSan Groups. We'll contact you soon.`;

      const payload = {
        instance_id: "68761C38A48AC",
        access_token: "685b00ae77342",
        to: cleanPhone,
        message: message
      };

      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload),
        muteHttpExceptions: true
      };

      const whatsappUrl = "https://bdwamaster.site/api/send";

      const response = UrlFetchApp.fetch(whatsappUrl, options);
      Logger.log("📲 WhatsApp API Response: " + response.getContentText());
    }

    return ContentService.createTextOutput("✅ Success: Data saved and WhatsApp sent.");

  } catch (err) {
    Logger.log("❌ Global Error: " + err.message);
    return ContentService.createTextOutput("❌ Error: " + err.message);
  }
}

/**
 * Format mobile number to include +91 if missing.
 */
function formatPhoneNumber(number) {
  let cleaned = number.toString().replace(/[^0-9]/g, "");
  if (!cleaned.startsWith("91")) {
    cleaned = "91" + cleaned;
  }
  return "+" + cleaned;
}
