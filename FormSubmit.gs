/**
 * Test function for Spreadsheet Form Submit trigger functions.
 * Loops through content of sheet, creating simulated Form Submit Events.
 *
 * Check for updates: https://stackoverflow.com/a/16089067/1677912
 *
 * See https://developers.google.com/apps-script/guides/triggers/events#google_sheets_events
 */
function test_onFormSubmit() {
  var dataRange = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Cab-Ease Form').getDataRange();
  var data = dataRange.getValues();
  var headers = data[0];
  // Start at row 1, skipping headers in row 0
  for (var row=1; row < data.length; row++) {
    var e = {};
    e.values = data[row].filter(Boolean);  // filter: https://stackoverflow.com/a/19888749
    e.range = dataRange.offset(row,0,1,data[0].length);
    e.namedValues = {};
    // Loop through headers to create namedValues object
    // NOTE: all namedValues are arrays.
    for (var col=0; col<headers.length; col++) {
      e.namedValues[headers[col]] = [data[row][col]];
    }
    Logger.log(e);
    // Pass the simulated event to onFormSubmit
    onFormSubmit(e);
  }  
}



function onFormSubmit(e) {
  Logger.log(e);
  var page = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(e.namedValues["Driver ID"][0]);
  var pageData = page.getDataRange().getDisplayValues();
  
  // Set a date, then move it back 28 days for a lower bound for items.
  var date = new Date();
  date.setDate(date.getDate() - 28);
  date = Utilities.formatDate(date, "EST", "M/d/yyyy HH:mm:ss");
       
  // Wipe the page first, then write new data
  page.clearContents();
  
  // if Confirmation Number matches, or date is too early remove that row and redo that row again.
  for (var row=0; row<pageData.length; row++) {
    if ((pageData[row][4] == e.namedValues["Confirmation Number"][0] && pageData[row][2] == "Add Fare") || pageData[row][0] < date || pageData[row][0] == e.Timestamp) {
      pageData.splice(row, 1);  
      row--;
    }
  }
  
  // Reorganize the data into the correct array
  var temp = new Array(pageData[0].length);
  for (var x=0; x<pageData[0].length; x++) {
    switch (pageData[0][x]) {
      case "Timestamp":
        temp[0] = e.namedValues["Timestamp"][0];
        break;
      case "Driver ID":
        temp[1] = e.namedValues["Driver ID"][0];
        break;
      case "Main Menu":
        temp[2] = e.namedValues["Main Menu"][0];
        break;
      case "Credit Card Tip":
        temp[3] = e.namedValues["Credit Card Tip"][0];
        break;
      case "Confirmation Number":
        temp[4] = e.namedValues["Confirmation Number"][0];
        break;
      case "Fare Amount":
        temp[5] = e.namedValues["Fare Amount"][0];
        break;
      case "Fare Type":
        temp[6] = e.namedValues["Fare Type"][0];
        break;
      case "Check box if there is a fare discrepancy.":
        temp[7] = e.namedValues["Check box if there is a fare discrepancy."][0];
        break;  
      case "Amount of expense/gas":
        temp[8] = e.namedValues["Amount of expense/gas"][0];
        break;
      case "Expense/Gas":
        temp[9] = e.namedValues["Expense/Gas"][0];
        break;
      case "Description (Expense only)":
        temp[10] = e.namedValues["Description (Expense only)"][0];
        break;
      case "Log In/Log Off":
        temp[11] = e.namedValues["Log In/Log Off"][0];
        break;
      case "Current Mileage":
        temp[12] = e.namedValues["Current Mileage"][0];
        break;
    }
  }
  
  pageData.push(temp);
  page.getRange(1,1,pageData.length,pageData[0].length).setValues(pageData);
  page.sort(1);
}