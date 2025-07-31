function doPost(e) {
  const data = e.parameter;
  const service = data.service || "General";
  const sheetId = "1mAh1r_Z3gs_UjkeCej00p-D_UIIaJW_EPYhGJSKLQws"; // ✅ Your Google Sheet ID
  const ss = SpreadsheetApp.openById(sheetId);

  // ✅ 1. Auto-create sheet tab based on service
  let sheet = ss.getSheetByName(service);
  if (!sheet) {
    sheet = ss.insertSheet(service);
    sheet.appendRow(["Timestamp", "Name", "Phone", "Email", "Message"]);
  }

  // ✅ 2. Store form data
  sheet.appendRow([
    new Date(),
    data.name || "",
    data.phone || "",
    data.email || "",
    data.message || ""
  ]);

  // ✅ 3. Send autoresponder email to user
  if (data.email) {
    const subject = `Thanks for contacting RanSan - ${service}`;
    const body = `Hi ${data.name || "User"},

Thank you for contacting RanSan Groups regarding our ${service} services.

We have received your message and will get back to you shortly.

✅ Your Message:
${data.message || "No message provided"}

Regards,  
RanSan Groups  
📧 support@ransangroups.com  
🌐 www.ransangroups.com`;

    MailApp.sendEmail(data.email, subject, body);
  }

  // ✅ 4. Send WhatsApp confirmation (if phone number present)
  try {
    if (data.phone) {
      const phoneFormatted = data.phone.replace(/\D/g, '');
      const waNumber = phoneFormatted.startsWith("91") ? phoneFormatted : "91" + phoneFormatted;

      const messageText = `Hi ${data.name || "there"},\n\nThanks for contacting RanSan Groups regarding "${service}".\nWe’ll reach out to you soon.\n\n🌐 www.ransangroups.com\n📞 8148610567`;

      const payload = {
        number: waNumber,
        type: "text",
        message: messageText,
        instance_id: "68761C38A48AC",         // ✅ Your instance ID
        access_token: "685b00ae77342"         // ✅ Your access token
      };

      const options = {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(payload)
      };

      UrlFetchApp.fetch("https://bdwamaster.site/api/send", options); // ✅ WhatsApp API endpoint
    }
  } catch (err) {
    Logger.log("WhatsApp Error: " + err);
  }

  // ✅ 5. Respond to client-side JS
  return ContentService
    .createTextOutput("Success")
    .setMimeType(ContentService.MimeType.TEXT);
}
