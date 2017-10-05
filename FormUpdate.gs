// This function automatically updates the Driver ID List Items in the Form from the Roster Spreadsheet page.
function onEdit(e) {
  if (e.source.getSheetName() == "Roster") {
    var roster = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Roster");
    var rosterData = roster.getRange(1,1,roster.getLastRow(),roster.getLastColumn()).getDisplayValues();
    var ids = new Array();
    
    for (var x=0; x<rosterData.length; x++) {
      if (rosterData[x][1] !== "") {
        ids.push(rosterData[x][1]);
      }
    }
    
    ids.sort();
    var form = FormApp.openById("1qMfarWhweoLriIRE_19MWMEBu7x5iwT4UJkW-r_vgg4");
    var items = form.getItems();
    
    items.forEach(function (item) {
      if (item.getTitle() == "Driver ID") {
        item.asListItem().setChoiceValues(ids);
      }
    }); 
  }
}

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


