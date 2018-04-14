function doPost(e) {
  //fill your id
  var id = SpreadsheetApp.openById('1BuEf5_bBpQuxRjuVnutvOWd8vMNMhFJe-qPPyOMYYDs'); 
  
  var timestamp = Utilities.formatDate(new Date(), "GMT+7", "MM/dd/yyyy HH:mm:ss");
  var nama = e.parameter.nama;
  var email = e.parameter.email; 
  var jenis_kelamin = e.parameter.jenis_kelamin;
  var alamat = e.parameter.alamat;
  
  id.appendRow([timestamp, nama,email, jenis_kelamin, alamat]);
  
  var jsonObject =
  {
    status: 'berhasil'  
  }
  
  var JSONString = JSON.stringify(jsonObject);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  return JSONOutput;
}

function doGet(e) {
  var op = e.parameter.action;
  if(op=="read"){
    return read_all_value(e);
  }else if(op=="delete"){
    var name = e.parameter.name;
    return deleteRows(name);
  }
}

function deleteRows(name){
  var sheet = SpreadsheetApp.openById('1BuEf5_bBpQuxRjuVnutvOWd8vMNMhFJe-qPPyOMYYDs');
//  var sheet = SpreadsheetApp.getActiveSheet();
  var rows = sheet.getDataRange();
  var numRows = rows.getNumRows();
  var values = rows.getValues();

  var rowsDeleted = 0;
  for (var i = 0; i <= numRows - 1; i++) {
    var row = values[i];
    if (row[1] == name || row[1] == '') { // This searches all cells in columns A (change to row[1] for columns B and so on) and deletes row if cell is empty or has value 'delete'.
      sheet.deleteRow((parseInt(i)+1) - rowsDeleted);
      rowsDeleted++;
    }
  }
  
  var jsonObject =
      {
        status: 'berhasil hapus '+name  
      }
  
  var JSONString = JSON.stringify(jsonObject);
  var JSONOutput = ContentService.createTextOutput(JSONString);
  JSONOutput.setMimeType(ContentService.MimeType.JSON);
  return JSONOutput;
  
}

var SCRIPT_PROP = PropertiesService.getScriptProperties();
// see: https://developers.google.com/apps-script/reference/properties/
/**
 * select the sheet
 */
function setup() {
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  SCRIPT_PROP.setProperty("key", doc.getId());
}

function read_all_value(request){
  var ss = SpreadsheetApp.openById('1BuEf5_bBpQuxRjuVnutvOWd8vMNMhFJe-qPPyOMYYDs');
  var output = ContentService.createTextOutput(),
      data = {};
  //Note : here sheet is sheet name , don’t get confuse with other operation 
  var sheet="Sheet1";
  data.records = readData_(ss, sheet);
  var callback = request.parameters.callback;
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  return output;
}

function readData_(ss, sheetname, properties) {
  if (typeof properties == "undefined") {
    properties = getHeaderRow_(ss, sheetname);
    properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
  }
  
  var rows = getDataRows_(ss, sheetname),
      data = [];
  for (var r = 0, l = rows.length; r < l; r++) {
    var row = rows[r],
        record = {};
    for (var p in properties) {
      record[properties[p]] = row[p];
    }
    
    data.push(record);
  }
  return data;
}

function getDataRows_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);
  return sh.getRange(2, 1, sh.getLastRow()-1, sh.getLastColumn()).getValues();
//return sh.getRange(2, 1, sh.getLastRow() — 1, sh.getLastColumn()).getValues();
}

function getDataRows_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);
  return sh.getRange(2, 1, sh.getLastRow()-1, sh.getLastColumn()).getValues();
}

function getHeaderRow_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);
  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0]; 
}
