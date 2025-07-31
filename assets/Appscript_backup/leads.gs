function doPost(e) {
  var sheet = SpreadsheetApp.openById("1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo").getSheetByName("Leads");
  
  var data = {};
  try {
    // Support JSON and URL encoded both
    if (e.postData.type === "application/json") {
      data = JSON.parse(e.postData.contents);
    } else {
      var params = e.parameter;
      for (var key in params) {
        data[key] = params[key];
      }
    }
  } catch (err) {
    return ContentService.createTextOutput("Error parsing data");
  }

  // Check if timestamp exists
  var timestamp = data.timestamp;
  var values = sheet.getDataRange().getValues();
  var foundRow = -1;
  for (var i = 1; i < values.length; i++) {
    if (values[i][7] == timestamp) { // 8th column (H)
      foundRow = i + 1; // Sheet rows start at 1
      break;
    }
  }

  if (foundRow > -1) {
    // ✅ Update existing lead (Payment Update)
    if (data.intent === "Paid Order") {
      sheet.getRange(foundRow, 4).setValue(data.intent); // Intent - D
      sheet.getRange(foundRow, 7).setValue(data.payment_id); // Payment ID - G
    }
  } else {
    // ✅ New Lead (Lead Save)
    sheet.appendRow([
      data.name || "",
      data.email || "",
      data.phone || "",
      data.intent || "",
      data.product || "",
      data.amount || "",
      data.payment_id || "",
      data.timestamp || new Date().toISOString()
    ]);
  }

  return ContentService.createTextOutput("Success");
}
