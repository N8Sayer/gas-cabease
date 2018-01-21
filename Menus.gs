function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('CabEase Scripts')
    .addItem('Generate New Driver Pages', 'menuItem1')
    .addSeparator()
    .addItem('Show Sidebar', 'showSidebar')
    .addSeparator()
    .addItem('Delete Old Drivers', 'cleanRoster')
    .addToUi();
}

function menuItem1() {
  pageGen();
}

function cleanRoster() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var roster = ss.getSheetByName('Roster').getRange('B:B').getDisplayValues();
  var sheets = ss.getSheets();
  var goodSheets = ['Roster','Fleet Vehicles', 'Template'];
  
  roster.forEach(function (driver) {
    goodSheets.push(driver);
  });
  
  sheets.forEach(function (sheet) {
    var keep = false;
    var sheetName = sheet.getName();
    goodSheets.forEach(function (goodSheet) {
      if (sheetName == goodSheet) {
        keep = true;
      }
    });
    if (!keep) {
      ss.deleteSheet(ss.getSheetByName(sheetName));
    }
  });  
}