function doGet(evt) {
    return HtmlService.createHtmlOutputFromFile('Operations')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
      .setTitle('Cab-Ease'); 
}

function sheetUpdate(sheetName, data, editFare) {
  Logger.log(sheetName);
  var date = new Date();
  var output = [];
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  var sheetData = sheet.getDataRange().getDisplayValues();
  var sheetRow = sheet.getLastRow();
  
  if (editFare !== "" && editFare !== undefined) {
    var findRow = 0;
        
    sheetData.forEach(function (row,index) {
      if (row[0] == editFare) {
        findRow = index;
        return false;
      }
    });
    sheet.getRange(findRow+1,1,1,data.length).setValues([data]);
  } 
  else {
    data.unshift(date);
    var duplicateEntry = false;
    
    sheetData.forEach(function (row) {
      if (data[4] == row[4]) {
        duplicateEntry = true;
      }
    });
      
    if (!duplicateEntry) {
      sheet.getRange(sheetRow+1,1,1,data.length).setValues([data]);
    }
  }
  sheet.sort(1, false);
}

function getPastFares(agentId) {
  var output = [];
  var today = new Date();
  var dateMin = 0;
  var dateMax = 0;
  
  switch (today.getDay()) {
    case 0:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-7);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate(),23,59,59);
      break;
    case 1:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-1);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+6,23,59,59);
      break;
    case 2:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-2);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+5,23,59,59);
      break;
    case 3:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-3);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+4,23,59,59);
      break;
    case 4:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-4);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+3,23,59,59);
      break;
    case 5:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-5);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+2,23,59,59);
      break;
    case 6:
      dateMin = new Date(today.getFullYear(),today.getMonth(),today.getDate()-6);
      dateMax = new Date(today.getFullYear(),today.getMonth(),today.getDate()+1,23,59,59);
      break;    
  }
  
  var data = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(agentId).getDataRange().getDisplayValues();
  
  for (var x=1; x<data.length; x++) {
    var unformattedDate = data[x][0].split(" ");
    var dateObj = unformattedDate[0].split("/");
    var timeObj = unformattedDate[1].split(":");
    
    var formattedDate = new Date(dateObj[2],dateObj[0]-1,dateObj[1],timeObj[0],timeObj[1],timeObj[2]);
        
    if (formattedDate >= dateMin && formattedDate <= dateMax) {
      output.push(data[x]); 
    }
  }
  
  if (output.length > 0) {
    return output;
  }
  else {
    return [];
  }
}

function getAgentPolicies(agentName) {
  var database = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Agent Policies').getDataRange().getDisplayValues();
  var agentPolicies = [];
  database.forEach(function (row) {
    if (agentName == row[1]) {
       agentPolicies.push(row);
    }
  });
  return agentPolicies;
}

function getDriverId(email) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Roster').getRange('B:C').getDisplayValues();
  
  for(var x=0; x<sheet.length; x++) {
    if(sheet[x][1] == email) {
      return sheet[x][0]; 
    }
  }
}