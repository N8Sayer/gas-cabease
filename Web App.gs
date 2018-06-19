function doGet(evt) {
  return HtmlService.createHtmlOutputFromFile('Operations')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .setTitle('Cab-Ease Dev');
}

function sheetUpdate(sheetName, data, editFare) {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('submissionTimestamp', new Date());
  
  var date = new Date();
  var output = [];
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName(sheetName);
  var sheetRow = sheet.getLastRow();

  if (editFare !== "" && editFare !== undefined) {
    var findRow = 0;
    var sheetData = sheet.getDataRange().getDisplayValues();

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
    sheet.getRange(sheetRow+1,1,1,data.length).setValues([data]);
  }
  sheet.sort(1, false);  
}

function getPastFares(agentId) {
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
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

  var data = ss.getSheetByName(agentId).getDataRange().getDisplayValues();

  for (var x=1; x<data.length; x++) {
    var unformattedDate = data[x][0].split(" ");
    var dateObj = unformattedDate[0].split("/");
    var timeObj = unformattedDate[1].split(":");

    var formattedDate = new Date(dateObj[2],dateObj[0]-1,dateObj[1],timeObj[0],timeObj[1],timeObj[2]);

    if (formattedDate.valueOf() >= dateMin.valueOf() && formattedDate.valueOf() <= dateMax.valueOf()) {
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
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var database = ss.getSheetByName('Agent Policies').getDataRange().getDisplayValues();
  var agentPolicies = [];
  database.forEach(function (row) {
    if (agentName == row[1]) {
       agentPolicies.push(row);
    }
  });
  return agentPolicies;
}


function getDriverId(email) {
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName('Roster').getRange('B:C').getDisplayValues();
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('loggedIn', "true");

  for(var x=0; x<sheet.length; x++) {
    if(sheet[x][1] == email) {
      userProperties.setProperty('id', sheet[x][0]);
      return { id: sheet[x][0], clocked: "false" };
    }
  }
}

function getEmailStatus(email) {
  email = email.toLowerCase();
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName('Roster').getRange('C:D').getDisplayValues();
  var userStatus = '';
  
  for(var x=0; x<sheet.length; x++) {
    if(sheet[x][0] == email && sheet[x][1] !== "") {
      x=sheet.length;
      userStatus = 'verified';
    }
    else if (sheet[x][0] == email && email !== "" && (sheet[x][1] == "" || sheet[x][1] == undefined)) {
      x=sheet.length;
      userStatus = 'newuser';
    }
    else {
      userStatus = 'unverified';
    }
  }
  return userStatus;
}

function setNewUserPassword(email,password) {
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName('Roster').getRange('B:D').getDisplayValues();
  
  for (var x=0; x<sheet.length; x++) {
    if (email == sheet[x][1]) {
      ss.getSheetByName('Roster').getRange(x+1,4).setValue(password);
      var id = sheet[x][0];
      x = sheet.length;
      return { id: id, status: 'success'};
    }
  }
  return "";
}

function getLogIn(email,password) {
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName('Roster').getRange('C:D').getDisplayValues();
  var userProperties = PropertiesService.getUserProperties();
    
  var valid = 'unverified';
  sheet.forEach(function (driver) {
    if (email == driver[0] && password == driver[1]) {
      userProperties.setProperty('email',email);
      valid = 'verified';
    }
  });  
  return valid;
}

function setClockIn() {  
  var timestamp = new Date();
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('clockIn', "true");
}

function logOff() {
  var userProperties = PropertiesService.getUserProperties();
  userProperties.setProperty('loggedIn',"false");
  userProperties.setProperty('clockIn',"false");
  userProperties.setProperty('id',"");
  userProperties.setProperty('email',"");
}

function checkLogIn() {
  var currentTime = new Date();
  var userProperties = PropertiesService.getUserProperties();
  var logged = userProperties.getProperty('loggedIn');
  var clocked = userProperties.getProperty('clockIn');
  var lastActivity = new Date(userProperties.getProperty('submissionTimestamp'));
  var id = userProperties.getProperty('id');
  var output = {};
  
  if (clocked === null || (lastActivity !== null && (clocked && (currentTime.getTime() - lastActivity.getTime() > 21600000)))) {
    clocked = "false";
  } 
  
  if (logged) {
    output.id = id;
    output.clocked = clocked;    
  }
  else {
    output.id = "";
    output.clocked = "false";
  }
  return output;
}

function checkMileage(vehicleNum,mileage) {
  var output = "";
  var ss = SpreadsheetApp.openById('1SO9Dratuc2B2FK3ZsJZ72VrTLCJzxXvItCMs2gbemhI');
  var sheet = ss.getSheetByName('Fleet Vehicles').getRange('A:E').getDisplayValues();
  var warning = parseInt(sheet[1][3]);
  var overdue = parseInt(sheet[1][4]);
  
  sheet.forEach(function (vehicle) {
    var fleetNum = vehicle[0];    
    var lastOilChange = parseInt(vehicle[1]);  
    var associatedEmail = vehicle[2];
    if (fleetNum == vehicleNum) {
      if ((parseInt(mileage) - lastOilChange) >= overdue) {
        output = 'overdue';
        var milesOverdue = (parseInt(mileage) - lastOilChange) - overdue;
        emailManager(vehicleNum,mileage,output,milesOverdue,associatedEmail);
      }
      else if ((parseInt(mileage) - lastOilChange) >= warning) {
        output = 'warning';
        var remainingMiles = overdue - (parseInt(mileage) - lastOilChange);
        emailManager(vehicleNum,mileage,output,remainingMiles,associatedEmail);
      }
    }
  });
  return output;
}

function emailManager(vehicleNum,mileage,update,milesDiff,emailList) {
  var userProperties = PropertiesService.getUserProperties();
  var userId = userProperties.getProperty('id');
  var email = userProperties.getProperty('email');
  var body = 'Fleet Vehicle #'+vehicleNum+' was just reported at '+mileage+' miles by Driver #'+userId+'\n';
  
  if (emailList) {
    if (update == 'overdue') {
      body += 'This vehicle is overdue for it\'s oil change by '+milesDiff+' miles.';
      MailApp.sendEmail({
        to: emailList, 
        replyTo: email, 
        subject: 'Fleet Vehicle '+vehicleNum+' - Maintenance Overdue', 
        htmlBody: body
      });
    }
    else if (update == 'warning') {
      body += 'This vehicle is due for an oil change in '+milesDiff+' miles.';
      MailApp.sendEmail({
        to: emailList, 
        replyTo: email, 
        subject: 'Fleet Vehicle '+vehicleNum+' - Maintenance Warning', 
        htmlBody: body
      });
    }    
  }
}
