// Assign the Template to the Active sheet
function active() {
  SpreadsheetApp.getActiveSpreadsheet().setActiveSheet(SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Template"));
}

// This function generates new pages based off of the Template whenever the script is run. 
// This takes any new IDs from the Roster and makes a blank Template out of them.
function pageGen() {
  var roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Roster");
  var rosterData = roster.getRange(1,2,roster.getLastRow(),1).getDisplayValues();
  
  active();
  rosterData.forEach(function(row) {
    if(!SpreadsheetApp.getActiveSpreadsheet().getSheetByName(row)) {
      active();
      var newSheet = SpreadsheetApp.getActiveSpreadsheet().duplicateActiveSheet();
      newSheet.setName(row);
    }
  });
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Template").hideSheet();
}


