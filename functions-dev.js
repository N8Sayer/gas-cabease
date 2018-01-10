google.script.run.withSuccessHandler(showPage).checkLogIn();

function submit(formName) {
  var tip = "";
  var description = "";
  var confirmationNum = "";
  var fareAmt = "";
  var fareType = "";
  var expAmt = "";
  var expType = "";
  var log = "";
  var mileage = "";
  var output = [];
  var date = new Date();
  var form = document.getElementsByClassName(formName)[0];
  var inputs = form.getElementsByTagName('input');
  var selectedButtons = form.getElementsByClassName('selected');
  var creditSelected = form.getElementsByClassName('creditSelected');

  if(selectedButtons) {
    Array.from(selectedButtons).forEach(function(button) {
    if (button.innerHTML == "Yes" || button.innerHTML == "Expense") {
      description = form.getElementsByTagName('textarea')[0].value;
    }
    else if (button.innerHTML == "Credit Card") {
      tip = inputs[2].value;
      description = creditSelected[0].innerHTML + ", " + creditSelected[1].innerHTML;
    }
  });
}

switch(formName) {
  case 'addFareForm':
    var menuType = "Add Fare";
    confirmationNum = inputs[0].value;
    fareAmt = inputs[1].value;
    fareType = selectedButtons[0].innerHTML;
    inputs[0].value = "";
    inputs[1].value = "";
    inputs[2].value = "";
    form.getElementsByTagName('textarea')[0].value = "";
    break;
  case 'addExpenseForm':
    var menuType = "Add Expense/ Add Gas";
    expAmt = inputs[0].value;
    expType = selectedButtons[0].innerHTML;
    inputs[0].value = "";
    form.getElementsByTagName('textarea')[0].value = "";
    break;
  case 'logOnForm':
    var menuType = 'Log On/ Log Off';
    var vehicleNum = inputs[0].value;
    log = document.getElementById('logForm').childNodes[1].innerHTML;
    description = "Fleet Vehicle " + vehicleNum;
    mileage = inputs[1].value;
    google.script.run.withSuccessHandler(updateNotification).checkMileage(vehicleNum,mileage);
    inputs[0].value = "";
    inputs[1].value = "";
    break;
  }

  output.push(userId,menuType,tip,confirmationNum,fareAmt,fareType,expAmt,expType,description,log,mileage);
  google.script.run.withSuccessHandler(submitted(formName)).sheetUpdate(userId,output);
}

function submitted(formName) {
  var tab = document.getElementsByClassName(formName)[0];

  if (formName == 'addFareForm') {
    document.getElementById('submittedFare').style.opacity = 1;
    document.getElementById('resubmitFare').style.opacity = 1;
    tab.style.display = 'none';
  }
  else if (formName == 'addExpenseForm') {
    document.getElementById("receiptNotice").style.display = 'none';
    document.getElementById('submittedExpense').style.opacity = 1;
    document.getElementById('resubmitExpense').style.opacity = 1;
    tab.style.display = 'none';
  }
  else if (formName == 'logOnForm') {
    openTab('login','addFare');
    if (document.getElementById('logon').innerHTML == 'Log On') {
      document.getElementById('logon').innerHTML = 'Log Off';
      document.getElementById('logForm').childNodes[1].innerHTML = 'Log Off';
      google.script.run.setClockIn();
    } else if (document.getElementById('logon').innerHTML == 'Log Off') {
      document.getElementById('logon').innerHTML = 'Log On';
      document.getElementById('logForm').childNodes[1].innerHTML = 'Log On';
      google.script.run.logOff();
      showPage({ id: "", clocked: false });
    }
  }
}

function resubmit(formName) {
  var tab = document.getElementsByClassName(formName)[0];

  if (formName == 'addFareForm') {
    document.getElementById('submittedFare').style.opacity = 0;
    document.getElementById('resubmitFare').style.opacity = 0;
    document.getElementById('creditOptions').style.display = 'none';
  }
  else if (formName == 'addExpenseForm') {
    document.getElementById("receiptNotice").style.display = 'block';
    document.getElementById('submittedExpense').style.opacity = 0;
    document.getElementById('resubmitExpense').style.opacity = 0;
  }

  var buttons = document.getElementsByClassName(formName)[0].getElementsByClassName('button');
  Array.from(buttons).forEach(function(eachButton) {
    eachButton.className = "button";
  });

  tab.style.display = 'block';
}

function selected(buttonSet,button) {
  if (buttonSet == 'expense' || buttonSet == 'discrepancy') {
    Array.from(document.getElementById(buttonSet).children).forEach(function(eachButton) {
      eachButton.className = "button half";
    });
    button.className += " selected";
  }
  else {
    Array.from(document.getElementById(buttonSet).children).forEach(function(eachButton) {
      eachButton.className = "button";
    });
    button.className += " selected";
  }
  return document.getElementById(buttonSet);
}

function creditSelect(buttonSet,button) {
  Array.from(document.getElementById(buttonSet).children).forEach(function(eachButton) {
    eachButton.className = "button half";
  });
  button.className += " creditSelected";

  return document.getElementById(buttonSet);
}

function creditCheck(button) {
  selected('buttons',button);

  if(button.innerHTML == "Credit Card") {
    document.getElementById('creditOptions').style.display = 'block';
    document.getElementById('credit').style.display = 'block';
  }
  else {
    document.getElementById('creditOptions').style.display = 'none';
    document.getElementById('credit').style.display = 'none';
  }
}

function discrepancy(button) {
  selected('discrepancy',button);

  if(button.innerHTML == "Yes") {
    document.getElementById('discLabel').style.display = 'block';
    document.getElementById('discrepancyReason').style.display = 'block';
  }
  else if (button.innerHTML == "No") {
    document.getElementById('discLabel').style.display = 'none';
    document.getElementById('discrepancyReason').style.display = 'none';
  }
}

function expense(button) {
  selected('expense',button);

  if(button.innerHTML == "Expense") {
    document.getElementById('descLabel').style.display = 'block';
    document.getElementById('expenseDescription').style.display = 'block';
  }
  else if (button.innerHTML == "Gas") {
    document.getElementById('descLabel').style.display = 'none';
    document.getElementById('expenseDescription').style.display = 'none';
  }
}

function noFare() {
  var loading = document.getElementById('loading');
  loading.style.display = 'none';

  var tab = document.getElementById('editFare');
  var h = document.createElement('h1');
  h.innerHTML = "Contact your Supervisor to make changes to your past Fares and Expenses.";
  tab.appendChild(h);
}

function editFare(stats) {
  var tab = document.getElementById('editFare');
  var overflow = document.createElement('div');
  overflow.setAttribute('style', 'overflow-x: auto;');
  tab.appendChild(overflow);

  var table = document.createElement('table');
  var headers = ['Edit/Save','Timestamp','DriverID','EventType','Credit Card Tip','Confirmation#','FareAmt','FareType','Amt of Expense/ Gas','Expense Type','Description (Expense Only)','LogOn/ LogOff','Current Mileage'];

  if (stats.length === 0) {
    noFare();
  }
  else {
    if (document.querySelector("div#editFare table")) {
      document.getElementById('editFare').removeChild(document.getElementById('editFare').childNodes[2]);
    }
    table.setAttribute('id',"table");
    overflow.appendChild(table);

    var tableHeaderRow = document.createElement('tr');
    headers.forEach(function(col) {
      var tableHeaders = document.createElement('th');
      tableHeaders.innerHTML = col;
      tableHeaderRow.appendChild(tableHeaders);
    });
    table.appendChild(tableHeaderRow);

    stats.forEach(function (row,index) {
      if (row[0] !== "") {
        var tableRow = document.createElement('tr');

        var input = document.createElement('input');
        input.setAttribute('type','button');
        input.setAttribute('value','Edit');
        input.setAttribute('onclick','editSave(this,'+ (index+1) +')');

        var tableInput = document.createElement('td');
        tableInput.appendChild(input);
        tableRow.appendChild(tableInput);

        row.forEach(function (col) {
          var tableItem = document.createElement('td');
          tableItem.innerHTML = col;
          tableRow.appendChild(tableItem);
        });

        table.appendChild(tableRow);
      }
    });
  }
  var loading = document.getElementById('loading');
  loading.style.display = 'none';
}

function editSave(button, tableRow) {
  var row = document.getElementsByTagName('tr')[tableRow];

  var startNum = 0;
  var endNum = 0;

  if (row.childNodes[3].innerHTML == "Add Fare") {
    startNum = 4;
    endNum = 7;
  } else if (row.childNodes[3].innerHTML == "Log On/ Log Off") {
    startNum = 11;
    endNum = 12;
  } else if (row.childNodes[3].innerHTML == "Add Expense/ Add Gas") {
    startNum = 8;
    endNum = 10;
  }

  if (button.value == 'Edit') {
    button.value = 'Save';

    for (var x=startNum; x<=endNum; x++) {
      var id = row.childNodes[x];
      var content = row.childNodes[x].innerHTML;
      if (x === 7) {
        var oldData = row.childNodes[x].innerHTML;
        row.childNodes[x].innerHTML = '<select>' +
                                        '<option value="Cash">Cash</option>' +
                                        '<option value="Account">Account</option>' +
                                        '<option value="Credit Card">Credit Card</option>' +
                                        '<option value="TARPS (Cash Only)">TARPS (Cash Only)</option>' +
                                        '<option value="Personal">Personal</option>' +
                                        '<option value="Out of State Cash">Out of State Cash</option>' +
                                        '<option value="Out of State Credit Card">Out of State Credit Card</option>' +
                                        '<option value="Owner Fleet">Owner Fleet</option>' +
                                      '</select>';
        row.childNodes[x].childNodes[0].childNodes.forEach(function (option) {
          if (option.value == oldData) {
            option.selected = true;
          }
        });
      }
      else if (x === 9) {
        var oldData = row.childNodes[x].innerHTML;
        row.childNodes[x].innerHTML = '<select>' +
                                        '<option value="Expense">Expense</option>' +
                                        '<option value="Gas">Gas</option>' +
                                      '</select>';
        row.childNodes[x].childNodes[0].childNodes.forEach(function (option) {
          if (option.value == oldData) {
            option.selected = true;
          }
        });
      }
      else if (x === 11) {
        var oldData = row.childNodes[x].innerHTML;
        row.childNodes[x].innerHTML = '<select>' +
                                        '<option value="Log On">Log On</option>' +
                                        '<option value="Log Off">Log Off</option>' +
                                      '</select>';
        row.childNodes[x].childNodes[0].childNodes.forEach(function (option) {
          if (option.value == oldData) {
            option.selected = true;
          }
        });
      } else {
        row.childNodes[x].innerHTML = '<input type="text" value="'+ content +'">';
      }
    }
  }
  else if (button.value == 'Save') {
    button.value = 'Edit';

    for (var y=startNum; y<=endNum; y++) {
      var id = row.childNodes[y];
      var content = row.childNodes[y].innerHTML;
      var updated = id.childNodes[0].value;
      row.childNodes[y].innerHTML = updated;
    }
    var output = [];
    row.childNodes.forEach(function (item) {
      output.push(item.innerHTML);
    });
    output.shift();
    google.script.run.sheetUpdate(userId,output,row.childNodes[1].innerHTML);
  }
}

function openTab(evt, name) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
      if (window.screen.width < 769) {
        tablinks[i].style.display = 'none';
        document.getElementsByClassName('menu')[0].value = 'false';
      }
  }
  document.getElementById(name).style.display = "block";
  if (evt == 'login') {
    tablinks[0].className += " active";
  } else {
    evt.currentTarget.className += " active";
  }
  if(name == 'editFare') {
    google.script.run.withSuccessHandler(editFare).withFailureHandler(noFare).getPastFares(userId);
  }
  else {
    var header = document.getElementById('editFare');
    header.innerHTML = '<h2 id="loading">Loading...</h2>';
  }
}

function toggleMenu(state) {
  var menu = document.getElementsByClassName('tablinks');
  var button = document.getElementsByClassName('menu')[0];
  if (state == "true") {
    Array.from(menu).forEach(function (menuItem) {
      menuItem.style.display = 'none';
    });
    button.value = "false";
  }
  else if (state == "false") {
    Array.from(menu).forEach(function (menuItem) {
      menuItem.style.display = 'flex';
    });
    button.value = "true";
  }
}

function verifyDriver(form) {
  email = form.email.value.toLowerCase();
  var password = form.password.value;
  var newPass = form.password1.value;
  var newPassConfirm = form.password2.value;
  // Conditions
  if (email != '' && (password !== "" || (newPass !== "" && newPassConfirm !== ""))) {
    if (newPass == newPassConfirm && newPass !== "" && newPassConfirm !== "") {
      function runApp(obj) {
        if (obj.status == 'success') {
          document.getElementById('warning').innerHTML = 'Password Set. You will now be redirected to the app.';
          obj.clocked = false;
          setInterval(showPage(obj), 5000);
          emailChecker('verified');
        }
        else {
          document.getElementById('warning').innerHTML = 'Something went wrong. Contact your supervisor for assistance.';
        }
      }
      google.script.run.withSuccessHandler(runApp).setNewUserPassword(email,newPass);
    } else if (newPass !== newPassConfirm) {
      document.getElementById('warning').innerHTML = "Please make sure that your password matches.";
    } else if (password !== "") {
      google.script.run.withSuccessHandler(validEmail).getLogIn(email,password);
      function validEmail(statement) {
        if (statement == 'verified') {
          google.script.run.withSuccessHandler(showPage).getDriverId(email);
        }
        else {
          document.getElementById('warning').innerHTML = "That is not a valid email address and/or password";
        }
      }
    }
    else {
      document.getElementById('warning').innerHTML = "Please enter a password.";
    }
  }
  else {
    document.getElementById('warning').innerHTML = "Please fill out all fields";
  }
}

function showPage(obj) {
  console.log(obj);
  if (obj.id !== "") {
    if (obj.clocked == true) {
      userId = obj.id;
      document.getElementsByClassName('walled')[0].style.display = 'block';
      document.getElementsByClassName('verify')[0].style.display = 'none';
      submitted('logOnForm');
    } else if (obj.clocked == false) {
      userId = obj.id;
      document.getElementsByClassName('walled')[0].style.display = 'block';
      document.getElementsByClassName('verify')[0].style.display = 'none';
    }
  } else {
    document.getElementsByClassName('walled')[0].style.display = 'none';
    document.getElementsByClassName('verify')[0].style.display = 'block';
  }
}

function updateNotification(update) {
  var noteText = document.getElementsByClassName('notificationText');

  Array.from(noteText).forEach(function (notification) {
    switch (update) {
      case 'overdue':
        var parent = notification.parentElement;
        parent.style.display = 'flex';

        if (window.innerWidth <= 768) {
          var menuWidth = document.getElementsByClassName('menu')[0].offsetWidth;
          var menuHeight = document.getElementsByClassName('menu')[0].offsetHeight;

          parent.style.width = "calc(100% - "+ menuWidth +"px)";
          parent.style.height = menuHeight;
        }
        else {
          parent.style.width = "100%";
          parent.style.height = "10%";
        }
        notification.innerHTML = "Your vehicle is overdue for an oil change. Report to your manager after your shift.";
        break;
      case 'warning':
         var parent = notification.parentElement;
         parent.style.display = 'flex';

         if (window.innerWidth <= 768) {
         var menuWidth = document.getElementsByClassName('menu')[0].offsetWidth;
         var menuHeight = document.getElementsByClassName('menu')[0].offsetHeight;

         parent.style.width = "calc(100% - "+ menuWidth +"px)";
         parent.style.height = menuHeight;
         }
         else {
         parent.style.width = "100%";
         parent.style.height = "10%";
         }
        notification.innerHTML = "Your vehicle is due for an oil change. Please schedule one before your next service date.";
        break;
      default:
        break;
    }
  });
}

function closeNotification() {
  var noteElements = document.getElementsByClassName('notification');
  Array.from(noteElements).forEach(function (notification) {
    notification.style.display = 'none';
  });
}

function emailChecker(emailStatus) {
  if (emailStatus == 'newuser') {
    document.getElementById('warning').innerHTML = "This account doesn't have a password. Please enter a new one, then press Submit.";
    document.getElementById('password').style.display = 'none';
    document.getElementById('passwordLabel').style.display = 'none';
    document.getElementById('password1').style.display = 'block';
    document.getElementById('password1Label').style.display = 'block';
    document.getElementById('password2').style.display = 'block';
    document.getElementById('password2Label').style.display = 'block';
    document.getElementById('logPageSubmit').value = 'Submit Password';
  }
  else if (emailStatus == 'verified') {
    document.getElementById('password').disabled = false;
    document.getElementById('warning').innerHTML = "";
    document.getElementById('password').style.display = 'block';
    document.getElementById('passwordLabel').style.display = 'block';
    document.getElementById('password1').style.display = 'none';
    document.getElementById('password1Label').style.display = 'none';
    document.getElementById('password2').style.display = 'none';
    document.getElementById('password2Label').style.display = 'none';
    document.getElementById('logPageSubmit').value = 'Sign In';
  }
  else if (emailStatus == 'unverified') {
    document.getElementById('password').disabled = true;
    document.getElementById('password').style.display = 'block';
    document.getElementById('passwordLabel').style.display = 'block';
    document.getElementById('password1').style.display = 'none';
    document.getElementById('password1Label').style.display = 'none';
    document.getElementById('password2').style.display = 'none';
    document.getElementById('password2Label').style.display = 'none';
    document.getElementById('warning').innerHTML = "Please enter a valid email to continue.";
    document.getElementById('logPageSubmit').value = 'Sign In';
  }
}
