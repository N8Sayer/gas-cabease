function onOpen() {
  var ui = SpreadsheetApp.getUi();
  ui.createMenu('Add New Driver')
    .addItem('Generate New Driver Pages', 'menuItem1')
    .addSeparator()
    .addItem('Show Sidebar', 'showSidebar')
    .addToUi();
}

function menuItem1() {
  pageGen();
}


