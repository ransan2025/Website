// ✅ Updated Code.gs: Combo + Single Product Support with Clean Drive + Table Rows in Invoice

function doPost(e) {
  try {
    const params = e.parameter;
    Logger.log("🔍 Params: " + JSON.stringify(params));

    const name = params.name || "User";
    const email = params.email;
    const phone = params.phone;
    const comboName = params.product;
    const amount = parseFloat(params.amount);
    const paymentId = params.payment_id;
    const paymentType = fetchPaymentDetails(paymentId);

    const lookupSheetId = "1WnErc845R9CFdhk_WGa5HiOZGE7wjCELmk2fQ4MlKdI";
    const mainSheetId = "1BqsjYyyFnmLpVVXQ8xE7kA5iVuHUTpWXUHF3hySqmMA";

    const ss = SpreadsheetApp.openById(mainSheetId);
    let allProducts = getComboProducts(comboName, lookupSheetId);

    if (!allProducts || allProducts.length === 0) {
      const single = getProductInfoFromLookup(comboName, lookupSheetId);
      if (!single) return ContentService.createTextOutput("❌ No product data found").setMimeType(ContentService.MimeType.TEXT);
      allProducts = [{
        name: comboName,
        category: single.category,
        setupURL: single.setupURL,
        price: parseFloat(amount) || 0
      }];
    }

    const productNames = allProducts.map(p => p.name);

    // Only track combo analytics if more than 1 product found
    if (allProducts.length > 1) {
      trackComboAnalytics(comboName, name, phone, email, productNames);
    }

    const config = getCompanyConfig(ss);
    const invoiceNo = "INV" + Math.floor(Math.random() * 1000000);
    const date = Utilities.formatDate(new Date(), "Asia/Kolkata", "dd/MM/yyyy");

    const allLinks = [];

    allProducts.forEach(item => {
      // 🔒 Share original file
      let setupLink = "No setup file.";
      if (item.setupURL && item.setupURL.includes("/file/d/")) {
        try {
          const fileId = item.setupURL.match(/\/file\/d\/(.*?)\//)[1];
          const file = DriveApp.getFileById(fileId);
          file.addEditor(email);
          setupLink = file.getUrl();
        } catch (err) {
          Logger.log("⚠️ File share failed: " + err);
        }
      }

      // 🔁 Update CRM Leads sheet Column E (Product) based on Payment ID
      try {
        const crmSheet = SpreadsheetApp.openById("19hdWhlLDz7dsGlCwY87j4CLj4DaH4LGpD64u2StivDs").getSheetByName("CRM Leads");
        const crmData = crmSheet.getDataRange().getValues();

        const productCol = 4;    // Column E
        const paymentIdCol = 7;  // Column H
        const fullProductList = allProducts.map(p => p.name).join(", ");

        for (let i = 1; i < crmData.length; i++) {
          const rowPaymentId = (crmData[i][paymentIdCol] || "").toString().trim();
          if (rowPaymentId === paymentId.trim()) {
            crmSheet.getRange(i + 1, productCol + 1).setValue(fullProductList);
            Logger.log(`✅ CRM Leads updated at row ${i + 1}: ${fullProductList}`);
            break;
          }
        }
      } catch (err) {
        Logger.log("⚠️ Failed to update CRM Leads product column: " + err);
      }

      allLinks.push(`🔗 ${item.name}: ${setupLink}`);

      // 📋 Store buyer in sheet
      let sheet = ss.getSheetByName(item.category);
      if (!sheet) {
        sheet = ss.insertSheet(item.category);
        sheet.appendRow(["Timestamp", "Name", "Email", "Phone", "Product", "Amount", "Payment ID", "Payment Mode"]);
      }
      sheet.appendRow([new Date(), name, email, phone, item.name, item.price, paymentId, paymentType]);
    });

    const totalAmount = allProducts.reduce((sum, p) => sum + p.price, 0);
    const amountInWords = convertNumberToWords(totalAmount) + " rupees only";

    const invoiceData = {
      name,
      email,
      phone,
      product: comboName,
      amount: totalAmount,
      txn: paymentId,
      paymentType,
      invoiceNo,
      date,
      amountInWords,
      items: allProducts.map(p => ({ name: p.name, price: p.price })),

      company: config.company,
      mobile: config.mobile,
      emailSupport: config.email,
      website: config.website,
      gst: config.gst,
      address: config.address
    };

    const pdf = generateInvoicePDFBlob(invoiceData);



    // ✉️ Email
    const subject = `Your Invoice - ${comboName}`;

    //const feedbackFormURL = `https://docs.google.com/forms/d/e/1FAIpQLSdylnvBSAWwfOawacNJj2LJXLKj_iRO838ZN1dxbDfd0cCShA/viewform` +
      `?entry.1822120559=${encodeURIComponent(comboName)}` +     // Product
      `&entry.1917773906=${encodeURIComponent(name)}` +          // Name
      `&entry.1221062967=${encodeURIComponent(email)}`;

    const feedbackFormURL = `https://docs.google.com/forms/d/e/1FAIpQLSdylnvBSAWwfOawacNJj2LJXLKj_iRO838ZN1dxbDfd0cCShA/viewform`

    const body = `Hi ${name},\n\nThanks for your purchase of *${comboName}*.\n\n🧾 Invoice No: ${invoiceNo}  \n💳 Payment Mode: ${paymentType}  \n\n${allLinks.join("\n")}\n\n🙏 We'd love your feedback: ${feedbackFormURL}\n\nRegards,\n${config.company}`;

    MailApp.sendEmail({
      to: email,
      subject,
      body,
      attachments: [pdf]
    });

    // 📲 WhatsApp
    try {
      const waPayload = {
        number: phone.startsWith("91") ? phone : "91" + phone,
        type: "text",
        message: `Hi ${name},\nThanks for buying *${comboName}*.\nTxn ID: ${paymentId}\n\n${allLinks.join("\n")}\n\n🙏 Rate us: ${feedbackFormURL}`,
        instance_id: "68761C38A48AC",
        access_token: "685b00ae77342"
      };
      UrlFetchApp.fetch("https://bdwamaster.site/api/send", {
        method: "post",
        contentType: "application/json",
        payload: JSON.stringify(waPayload),
        muteHttpExceptions: true
      });
    } catch (err) {
      Logger.log("⚠️ WhatsApp failed: " + err);
    }

    return ContentService.createTextOutput("✅ Success").setMimeType(ContentService.MimeType.TEXT);
  } catch (error) {
    Logger.log("❌ Error: " + error);


    return ContentService.createTextOutput("❌ Failed: " + error).setMimeType(ContentService.MimeType.TEXT);

  }

}

function getComboProducts(comboName, sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  return data.filter(row => (row[18] || "").toString().trim() === comboName).map(row => ({
    name: row[0],
    category: row[6],
    setupURL: row[8],
    price: parseFloat(row[19]) || 0
  }));
}

function getProductInfoFromLookup(productName, sheetId) {
  const sheet = SpreadsheetApp.openById(sheetId).getSheets()[0];
  const data = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if ((data[i][0] || "").toString().trim() === productName) {
      return {
        category: data[i][6],
        setupURL: data[i][8]
      };
    }
  }
  return null;
}

function getCompanyConfig(ss) {
  const sheet = ss.getSheetByName("Config");
  const data = sheet.getRange("A1:B20").getValues();
  const config = {};
  data.forEach(row => {
    if (row[0]) config[row[0].toString().toLowerCase()] = row[1];
  });

  function findKey(possibleKeys) {
    for (let k of possibleKeys) {
      const match = Object.keys(config).find(key => key.includes(k));
      if (match) return config[match];
    }
    return "";
  }

  return {
    company: findKey(["company"]),
    mobile: findKey(["mobile"]),
    email: findKey(["email"]),
    website: findKey(["website"]),
    gst: findKey(["gst"]),
    address: findKey(["address"])
  };
}

function generateInvoicePDFBlob(data) {
  const templateId = "1_ov1aWCSkT1RE7VTFDNrwjkeQQ95r9WnLxBsXO6hJk0";
  const copy = DriveApp.getFileById(templateId).makeCopy(`Invoice_${data.invoiceNo}`);
  const doc = DocumentApp.openById(copy.getId());
  const body = doc.getBody();

  // Replace static placeholders
  const staticFields = {
    company: data.company,
    mobile: data.mobile,
    email: data.emailSupport,
    website: data.website,
    gst: data.gst,
    address: data.address,
    name: data.name,
    phone: data.phone,
    email: data.email,
    invoiceNo: data.invoiceNo,
    date: data.date,
    txn: data.txn,
    amount: `₹${data.amount}`,
    amountInWords: data.amountInWords,
    paymentType: data.paymentType
  };

  Object.entries(staticFields).forEach(([key, value]) => {
    body.replaceText(`{{${key}}}`, value);
  });

  if (!data.items || data.items.length === 0) {
    data.items = [{ name: data.product, price: parseFloat(data.amount) || 0 }];
  }

  const tables = body.getTables();
  let productTable = null;
  let placeholderRowIndex = -1;

  // Find table and placeholder row
  for (let t = 0; t < tables.length; t++) {
    const table = tables[t];
    for (let r = 0; r < table.getNumRows(); r++) {
      const row = table.getRow(r);
      for (let c = 0; c < row.getNumCells(); c++) {
        if (row.getCell(c).getText().includes("{{sr}}")) {
          productTable = table;
          placeholderRowIndex = r;
          break;
        }
      }
      if (productTable) break;
    }
    if (productTable) break;
  }

  if (productTable && placeholderRowIndex !== -1) {
    const templateRow = productTable.getRow(placeholderRowIndex);

    data.items.forEach((item, i) => {
      const newRow = productTable.insertTableRow(placeholderRowIndex + i);

      for (let j = 0; j < templateRow.getNumCells(); j++) {
        const templateCell = templateRow.getCell(j);
        const newCell = newRow.appendTableCell("");

        newCell.setAttributes(templateCell.getAttributes());
        newCell.clear(); // remove existing paragraphs

        // Replace template placeholders
        let content = templateCell.getText();
        content = content.replace("{{sr}}", String(i + 1));
        content = content.replace("{{productName}}", item.name);
        content = content.replace("{{qty}}", "1");
        content = content.replace("{{productPrice}}", `₹${item.price}`);

        const para = newCell.appendParagraph(content);
        para.setSpacingBefore(0);
        para.setSpacingAfter(0);
        para.setLineSpacing(1);

        // Apply alignment from template cell
        try {
          const alignment = templateCell.getChild(0).asParagraph().getAlignment();
          if (alignment) para.setAlignment(alignment);
        } catch (e) {
          Logger.log(`⚠️ Alignment failed for row ${i + 1}, col ${j + 1}: ${e}`);
        }
      }
    });

    // Remove the original template row
    productTable.removeRow(placeholderRowIndex + data.items.length);
  }

  doc.saveAndClose();
  const pdf = copy.getAs(MimeType.PDF).setName(`Invoice_${data.invoiceNo}.pdf`);
  DriveApp.getFileById(copy.getId()).setTrashed(true);
  return pdf;
}


function formatInvoiceTable(table, startRow) {
  const numRows = table.getNumRows();
  const numCols = table.getRow(startRow).getNumCells();

  for (let r = startRow; r < numRows; r++) {
    const row = table.getRow(r);

    // Align Quantity (Column 2)
    if (numCols > 2) {
      try {
        const cell = row.getCell(2);
        const child = cell.getChild(0);
        if (child && child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          child.asParagraph().setAlignment(DocumentApp.TextAlignment.CENTER);
        }
      } catch (e) {
        Logger.log(`⚠️ Cannot align Quantity at row ${r}: ${e}`);
      }
    }

    // Align Amount (Column 3)
    if (numCols > 3) {
      try {
        const cell = row.getCell(3);
        const child = cell.getChild(0);
        if (child && child.getType() === DocumentApp.ElementType.PARAGRAPH) {
          child.asParagraph().setAlignment(DocumentApp.TextAlignment.RIGHT);
        }
      } catch (e) {
        Logger.log(`⚠️ Cannot align Amount at row ${r}: ${e}`);
      }
    }
  }
}

function convertNumberToWords(amount) {
  const words = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (amount === 0) return "Zero";

  function numToWords(n) {
    if (n < 21) return words[n];
    if (n < 100) return words[18 + Math.floor(n / 10)] + (n % 10 ? " " + words[n % 10] : "");
    if (n < 1000) return words[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  }

  return numToWords(parseInt(amount));
}

function getRazorpayCredentials() {
  const props = PropertiesService.getScriptProperties();
  return {
    key: props.getProperty("RAZORPAY_KEY"),
    secret: props.getProperty("RAZORPAY_SECRET")
  };
}

function fetchPaymentDetails(paymentId) {
  const creds = getRazorpayCredentials();
  const url = `https://api.razorpay.com/v1/payments/${paymentId}`;
  const options = {
    method: 'get',
    headers: {
      Authorization: 'Basic ' + Utilities.base64Encode(creds.key + ':' + creds.secret)
    },
    muteHttpExceptions: true
  };

  try {
    const response = UrlFetchApp.fetch(url, options);
    const result = JSON.parse(response.getContentText());
    if (result && result.method) {
      Logger.log("✅ Razorpay Method: " + result.method);
      return result.method;
    }
  } catch (err) {
    Logger.log("❌ Razorpay fetch error: " + err);
  }

  return "Razorpay";
}



function trackComboAnalytics(comboName, name, phone, email, productNames) {
  const ANALYTICS_SHEET_ID = "19hdWhlLDz7dsGlCwY87j4CLj4DaH4LGpD64u2StivDs"; // Your CRM Leads sheet
  const sheetName = "Combo Analytics";
  const ss = SpreadsheetApp.openById(ANALYTICS_SHEET_ID);
  let sheet = ss.getSheetByName(sheetName);

  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
    sheet.appendRow(["Timestamp", "Combo Name", "Product Names", "Name", "Phone", "Email"]);
  }

  sheet.appendRow([
    new Date(),
    comboName,
    productNames.join(", "),  // combo items
    name,
    phone,
    email
  ]);
}

