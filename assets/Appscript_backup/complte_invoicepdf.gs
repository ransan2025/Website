function doPost(e) {
  Logger.log("🔍 Step 1: Triggered with params: " + JSON.stringify(e.parameter));

  const params = e.parameter;
  const name = params.name || "User";
  const email = params.email;
  const phone = params.phone;
  const product = params.product;
  const amount = params.amount;
  const paymentId = params.payment_id;

  const lookupSheetId = "1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU";  // 🔄 Setup URL + category
  const mainSheetId = "1zd53ma5HycyeQewHXGZt-2mz3-bMhVaBZ3GF5aXijUg";     // 📦 Order sheet

  // 🧩 Lookup product
  const setupData = getProductInfoFromLookup(product, lookupSheetId);
  if (!setupData) return ContentService.createTextOutput("❌ Product not found").setMimeType(ContentService.MimeType.TEXT);
  const category = setupData.category;
  const setupURL = setupData.setupURL;

  // 🧾 Store order (exclude setupURL)
  const ss = SpreadsheetApp.openById(mainSheetId);
  let sheet = ss.getSheetByName(category);
  if (!sheet) {
    sheet = ss.insertSheet(category);
    sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Product", "Amount", "Payment ID"]);
  }

  sheet.appendRow([
    new Date(),
    name,
    email,
    phone,
    product,
    amount,
    paymentId
  ]);
  Logger.log("✅ Step 2: Data saved in sheet tab: " + category);

  // 🏷️ Load company config
  const config = getCompanyConfig(ss);

  // 🧾 Create PDF Invoice
  const invoiceBlob = createInvoicePDF(name, email, phone, product, amount, paymentId, config);
  Logger.log("📎 Step 3: PDF Generated, size: " + invoiceBlob.getBytes().length + " bytes");

  // ✉️ Send Email
  const subject = `Your Invoice - ${product}`;
  const body = `Hi ${name},

Thank you for your purchase of *${product}*.

🧾 Transaction ID: ${paymentId}  
💰 Amount: ₹${amount}

👉 Setup Link: ${setupURL}

Regards,  
${config.company}  
📧 ${config.email}  
🌐 ${config.website}`;

  try {
    MailApp.sendEmail({
      to: email,
      subject: subject,
      body: body,
      attachments: [invoiceBlob]
    });
    Logger.log("✅ Step 4: Email sent to: " + email);
  } catch (err) {
    Logger.log("❌ Email failed: " + err);
  }

  // 📲 WhatsApp Message (fallback safe)
  try {
    const waPayload = {
      number: phone.startsWith("91") ? phone : "91" + phone,
      type: "text",
      message: `Hi ${name},\nThanks for buying *${product}*.\nTxn ID: ${paymentId}\nSetup Link: ${setupURL}`,
      instance_id: "68761C38A48AC",
      access_token: "685b00ae77342"
    };

    UrlFetchApp.fetch("https://bdwamaster.site/api/send", {
      method: "post",
      contentType: "application/json",
      payload: JSON.stringify(waPayload),
      muteHttpExceptions: true
    });
    Logger.log("✅ Step 5: WhatsApp message attempted");
  } catch (err) {
    Logger.log("⚠️ WhatsApp failed: " + err);
  }

  return ContentService.createTextOutput("✅ Success").setMimeType(ContentService.MimeType.TEXT);
}

// 🔄 Setup URL and category lookup
function getProductInfoFromLookup(productName, sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][0] === productName) {
      return {
        category: data[i][6],    // Column G
        setupURL: data[i][8]     // Column I
      };
    }
  }
  return null;
}

// ⚙️ Get company config from Config tab
function getCompanyConfig(ss) {
  const sheet = ss.getSheetByName("Config");
  const data = sheet.getRange("A1:B20").getValues();
  const config = {};

  data.forEach(row => {
    if (row[0]) {
      const key = row[0].toString().trim().toLowerCase();
      config[key] = row[1];
    }
  });

  Logger.log("📋 CONFIG KEYS FOUND: " + JSON.stringify(config));

  function findKey(possibleKeys) {
    for (let k of possibleKeys) {
      const match = Object.keys(config).find(key => key.includes(k));
      if (match) return config[match];
    }
    return "";
  }

  const finalConfig = {
  company: findKey(["company"]),
  mobile: findKey(["mobile"]),
  email: findKey(["email"]),
  website: findKey(["website"]),
  gst: findKey(["gst"]),
  address: findKey(["address"])
};

  Logger.log("✅ FINAL CONFIG USED: " + JSON.stringify(finalConfig));

  return finalConfig;
}

// 🧾 PDF Invoice Generator
function createInvoicePDF(name, email, phone, product, amount, txn, config) {
  const invoiceNo = "INV" + Math.floor(Math.random() * 1000000);
  const date = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy");

  // Prepare data for template
  const data = {
    name: name,
    email: email,
    phone: phone,
    product: product,
    amount: amount,
    txn: txn,
    invoiceNo: invoiceNo,
    date: date,

    // From config
    company: config.company || "RanSan Groups",
    mobile: config.mobile || "8148610567",
    gst: config.gst || "NA",
    website: config.website || "www.ransangroups.com",
    address: config.address || "Mumbai, India",
    supportEmail: config.email || "support@ransangroups.com"
  };

  const templateId = "1ivFsIJwNS7Jfd0Zs5IQO1uBbmK1SrNPHuvZew3rkXv0"; // Replace with your template’s File ID
  const copy = DriveApp.getFileById(templateId).makeCopy(`Invoice_${invoiceNo}`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  // Replace placeholders in the doc
  for (let key in data) {
    body.replaceText(`{{${key}}}`, data[key]);
  }

  doc.saveAndClose();

  // Convert to PDF
  const pdf = copy.getAs(MimeType.PDF).setName(`Invoice_${invoiceNo}.pdf`);
  return pdf;
}

function convertNumberToWords(amount) {
  var words = ["Zero","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten",
               "Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen",
               "Eighteen","Nineteen","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (amount === 0) return "Zero";

  function numToWords(n) {
    if (n < 21) return words[n];
    if (n < 100) return words[18 + Math.floor(n / 10)] + (n % 10 !== 0 ? " " + words[n % 10] : "");
    if (n < 1000) return words[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 !== 0 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 !== 0 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 !== 0 ? " " + numToWords(n % 10000000) : "");
  }

  return numToWords(parseInt(amount));
}
