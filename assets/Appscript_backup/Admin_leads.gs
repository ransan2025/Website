const SHEET_ID = '1qErGOyV9AjxYEqJAqokhOhNtipp2ehcPKo3zwvhpAZo'; // Your shared Google Sheet

const CONFIG = {
  crm: {
    sheetName: 'CRM Leads',
    headers: ["Timestamp", "Name", "Email", "Phone", "Product", "Amount", "Status", "Payment ID"]
  }
};

function doGet(e) {
  const type = e.parameter.type;
  const action = e.parameter.action;

  if (!type || !CONFIG[type]) {
    return ContentService.createTextOutput("Invalid Request");
  }

  if (action === 'getHeaders') return handleGetHeaders(type);
  if (action === 'getAllEntries') return handleGetAllEntries(type);
  return ContentService.createTextOutput("Invalid GET request.");
}

function doPost(e) {
  const type = e.parameter.type;
  const action = e.parameter.action;
  const rowIndex = parseInt(e.parameter.row, 10);
  const payload = JSON.parse(e.postData.contents);

  if (!type || !CONFIG[type]) {
    return ContentService.createTextOutput("Invalid Request");
  }

  if (action === 'submit') return handleAddEntry(type, payload);
  if (action === 'update') return handleUpdateEntry(type, rowIndex, payload);
  if (action === 'delete') return handleDeleteEntry(type, rowIndex);
  return ContentService.createTextOutput("Invalid POST request.");
}

// === Handler Functions ===

function handleGetHeaders(type) {
  const headers = CONFIG[type].headers;
  return ContentService.createTextOutput(JSON.stringify(headers))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleGetAllEntries(type) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(CONFIG[type].sheetName);
  const rows = sheet.getDataRange().getValues();
  const headers = CONFIG[type].headers;
  const entries = [];

  for (let i = 1; i < rows.length; i++) {
    let entry = { id: i + 1 };
    headers.forEach((h, idx) => {
      entry[h] = rows[i][idx] || "";
    });
    entries.push(entry);
  }

  return ContentService.createTextOutput(JSON.stringify(entries))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleAddEntry(type, data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(CONFIG[type].sheetName);
  const headers = CONFIG[type].headers;
  const row = headers.map(h => data[h] || "");
  sheet.appendRow(row);

  return ContentService.createTextOutput(JSON.stringify({ status: "success" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleUpdateEntry(type, rowIndex, data) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(CONFIG[type].sheetName);
  const headers = CONFIG[type].headers;

  headers.forEach((h, i) => {
    const value = data[h] || "";
    sheet.getRange(rowIndex, i + 1).setValue(value);
  });

  return ContentService.createTextOutput(JSON.stringify({ status: "updated" }))
    .setMimeType(ContentService.MimeType.JSON);
}

function handleDeleteEntry(type, rowIndex) {
  const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(CONFIG[type].sheetName);
  if (rowIndex > 1 && rowIndex <= sheet.getLastRow()) {
    sheet.deleteRow(rowIndex);
    return ContentService.createTextOutput(JSON.stringify({ status: "deleted" }))
      .setMimeType(ContentService.MimeType.JSON);
  }

  return ContentService.createTextOutput(JSON.stringify({
    status: "error",
    message: "Invalid row index"
  })).setMimeType(ContentService.MimeType.JSON);
}