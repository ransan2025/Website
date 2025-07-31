function doPost(e) {
  var action = e.parameter.action;
  
  if (action === "sendFollowup") {
    return sendWhatsAppFollowup(e);
  }

  return ContentService.createTextOutput("Invalid action");
}

function sendWhatsAppFollowup(e) {
  var data = JSON.parse(e.postData.contents);

  var url = "https://bdwamaster.site/api/send";

  var payload = {
    number: data.phone.startsWith("91") ? data.phone : "91" + data.phone,
    type: "text",
    message: data.message,
    instance_id: "68761C38A48AC",
    access_token: "685b00ae77342"
  };

  var options = {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  };

  var response = UrlFetchApp.fetch(url, options);

  Logger.log(response.getContentText());

  return ContentService.createTextOutput(response.getContentText());
}
