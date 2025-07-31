const SHEET_ID = '1jdD5SbymV6oNdJZSWZXsSijLcYEwsd_Kc3_Z40YB1lU'; // ✅ eStore Sheet ID
const SHEET_NAME = 'Sheet1'; // ✅ Change if needed
const HEADERS = [
  "Product Name", "Description", "Original Price", "Discounted Price",
  "Image URL", "Buy Now", "Category ID", "Rating", "Setup URL",
  "Deal", "Flash Deals", "Deals of the Day (Product)",
  "Deals of the Day (Before)", "Deals of the Day (After)",
  "DOTD Timer", "DOTD Stocks", "Just Dropped (Name)",
  "Just Dropped (Image)", "Combo Offers (Desc)", "Combo Offers (Price Info)"
];

// ✅ MAIN GET
function doGet(e) {
  const action = e.parameter.action;
  if (action === 'getHeaders') return handleGetHeaders();
  if (action === 'getAllEntries') return handleGetAllEntries();
  return ContentService.createTextOutput("Invalid GET request.");
}

// ✅ MAIN POST
function doPost(e) {
  const action = e.parameter.action;
  const rowIndex = parseInt(e.parameter.row, 10);
  const payload = JSON.parse(e.postData.contents);

  if (action === 'submit') return handleAddEntry(payload);
  if (action === 'update') return handleUpdateEntry(rowIndex, payload);
  if (action === 'delete') return handleDeleteEntry(rowIndex);
  return ContentService.createTextOutput("Invalid POST request.");
}

// ✅ HEADERS
function handleGetHeaders() {
  return ContentService.createTextOutput(JSON.stringify(HEADERS)).setMimeType(ContentService.MimeType.JSON);
}

// ✅ GET ALL
function handleGetAllEntries() {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const rows = sheet.getDataRange().getValues();
  const entries = [];

  for (let i = 1; i < rows.length; i++) {
    const entry = { id: i + 1 };
    HEADERS.forEach((h, idx) => {
      entry[h] = rows[i][idx] || "";
    });
    entries.push(entry);
  }

  return ContentService.createTextOutput(JSON.stringify(entries)).setMimeType(ContentService.MimeType.JSON);
}

// ✅ ADD
function handleAddEntry(data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  const row = HEADERS.map(h => data[h] || "");
  sheet.appendRow(row);
  return ContentService.createTextOutput(JSON.stringify({ status: "success" })).setMimeType(ContentService.MimeType.JSON);
}

// ✅ UPDATE
function handleUpdateEntry(rowIndex, data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  HEADERS.forEach((h, idx) => {
    sheet.getRange(rowIndex, idx + 1).setValue(data[h] || "");
  });
  return ContentService.createTextOutput(JSON.stringify({ status: "updated" })).setMimeType(ContentService.MimeType.JSON);
}

// ✅ DELETE
function handleDeleteEntry(rowIndex) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
  if (rowIndex > 1 && rowIndex <= sheet.getLastRow()) {
    sheet.deleteRow(rowIndex);
    return ContentService.createTextOutput(JSON.stringify({ status: "deleted" })).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput(JSON.stringify({ status: "error", message: "Invalid row index" })).setMimeType(ContentService.MimeType.JSON);
}
