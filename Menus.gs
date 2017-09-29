//function onOpen() {
//  var ui = SpreadsheetApp.getUi();
//  ui.createMenu('Add New Driver')
//      .addItem('Generate New Driver Pages', 'menuItem1').addToUi();
//}
//
//function menuItem1() {
//  pageGen();
//}

function doGet() {
  return HtmlService.createHtmlOutputFromFile('Tester');
}

