function doGet(e) {
  const sheet = SpreadsheetApp.openById("1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo");
  const crmSheet = sheet.getSheetByName("CRM Leads");
  const data = crmSheet.getDataRange().getValues();

  const result = [];

  for (let i = 1; i < data.length; i++) {
    if (data[i][6] === "Paid Order") {  // Column G = status
      result.push({
        time: data[i][0], // Timestamp (col A)
        name: data[i][1], // Assuming name is in column B
        product: data[i][2] // Assuming product is in column C
      });
    }
  }

  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}
