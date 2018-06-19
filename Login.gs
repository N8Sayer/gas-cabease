var id = '1C7VML3eMjNEOsHFOCH8iRYgdN2FXi8RkfBodTtxXRig';
var sheet = SpreadsheetApp.openById(id);
var roster = sheet.getSheetByName('Roster');
var rosterData = roster.getDataRange().getDisplayValues();

function verifyEmail(emailAddress) {
  var emails = [];
  rosterData.forEach(function(row) {
    if (row[2].trim() !== '') {
      emails.push(row[2]);
    }
  });
  return emails.indexOf(emailAddress);
}

function validateLogin(emailAddress,password) {
  var output = {
    status: false, 
    user: {
      email: null,
      id: null
    }
  };
  rosterData.forEach(function(row) {
    if (row[2] == emailAddress && row[3] == password) {
      output.status = true;
      output.user.email = emailAddress;
      output.user.id = row[1];
    } 
  });
  return output;
}

function addNewUser(emailAddress,password) {
  rosterData.forEach(function(row,index) {
    if (row[2] == emailAddress) {
      roster.getRange(index+1,4).setValue(password);
      return {
        status: true,
        message: 'New User Created'
      }
    } 
  });
  return {
    status: false,
    message: 'Failed to update user password'
  }  
}