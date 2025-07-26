// ✅ Your deployed Apps Script URL
const APP_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzbpH6UNEFeHHqIdw1yCiN3fWlkAQQXB5-wvBZFhZMcmwHfYCsYiDBNBZUk7TIl0L-l/exec";

// ✅ Load data on page load
window.onload = function () {
  loadSheetData();
};

// ✅ Fetch and display sheet data
function loadSheetData() {
  fetch(APP_SCRIPT_URL + "?action=read")
    .then(response => response.json())
    .then(data => renderSheetData(data))
    .catch(error => console.error("Error loading data:", error));
}

// ✅ Render rows in table
function renderSheetData(data) {
  const tableBody = document.getElementById("sheetDataBody");
  tableBody.innerHTML = "";

  data.forEach((row, index) => {
    let tr = document.createElement("tr");
    tr.id = `row-${index}`;
    tr.innerHTML = `
      <td>${index + 1}</td>
      ${row.map((cell, i) => `<td><input type="text" value="${cell}" disabled /></td>`).join("")}
      <td>
        <button onclick="enableEdit(${index})">Edit</button>
        <button onclick="updateRow(${index})" style="display:none;">Update</button>
        <button onclick="deleteRow(${index})">Delete</button>
      </td>
    `;
    tableBody.appendChild(tr);
  });
}

// ✅ Enable Edit Mode
function enableEdit(index) {
  const row = document.querySelector(`#row-${index}`);
  const inputs = row.querySelectorAll("input");
  inputs.forEach(input => input.disabled = false);
  row.querySelector("button[onclick^='updateRow']").style.display = "inline-block";
}

// ✅ Update existing row
function updateRow(index) {
  const row = document.querySelector(`#row-${index}`);
  const inputs = row.querySelectorAll("input");
  const rowData = Array.from(inputs).map(input => input.value);

  fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "update",
      index: index,
      row: rowData
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      alert("Row updated!");
      loadSheetData();
    })
    .catch(error => console.error("Update error:", error));
}

// ✅ Add new row
function addRow() {
  const inputs = document.querySelectorAll("#addRowForm input");
  const newRow = Array.from(inputs).map(input => input.value);

  fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "add",
      row: newRow
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      alert("Row added!");
      inputs.forEach(input => input.value = "");
      loadSheetData();
    })
    .catch(error => console.error("Add error:", error));
}

// ✅ Delete row
function deleteRow(index) {
  if (!confirm("Delete this row?")) return;

  fetch(APP_SCRIPT_URL, {
    method: "POST",
    body: JSON.stringify({
      action: "delete",
      index: index
    }),
    headers: {
      "Content-Type": "application/json"
    }
  })
    .then(res => res.json())
    .then(response => {
      alert("Row deleted!");
      loadSheetData();
    })
    .catch(error => console.error("Delete error:", error));
}
