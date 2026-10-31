export const GOOGLE_APPS_SCRIPT_WEB_APP_CODE = `/**
 * @license
 * EduCore LMS - Google Apps Script Web App (/exec Endpoint)
 * Nhận POST JSON { action, payload } và trả về { ok, data, error }.
 * Hỗ trợ đồng bộ toàn bộ bảng và trường dữ liệu giữa Web và Google Sheets.
 */

function doPost(e) {
  try {
    var lock = LockService.getScriptLock();
    // Đợi tối đa 10 giây để tránh xung đột ghi đồng thời
    if (!lock.tryLock(10000)) {
      return createJsonResponse({ ok: false, error: "Server busy. Please try again later." });
    }

    var body = JSON.parse(e.postData.contents);
    var action = body.action;
    var payload = body.payload || {};
    var result = null;

    switch (action) {
      case 'getAllData':
        result = handleGetAllData();
        break;
      case 'syncAll':
        result = handleSyncAll(payload);
        break;
      case 'saveTable':
        result = handleSaveTable(payload.tableName, payload.rows);
        break;
      default:
        return createJsonResponse({ ok: false, error: "Unknown action: " + action });
    }

    lock.releaseLock();
    return createJsonResponse({ ok: true, data: result });

  } catch (err) {
    return createJsonResponse({ ok: false, error: err.toString() });
  }
}

function doGet(e) {
  return createJsonResponse({
    ok: true,
    message: "EduCore LMS Google Sheets Web App API is running successfully!",
    timestamp: new Date().toISOString()
  });
}

function createJsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// ==================== XỬ LÝ LẤY DỮ LIỆU (GET ALL) ====================
function handleGetAllData() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var db = {};

  sheets.forEach(function(sheet) {
    var sheetName = sheet.getName();
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    
    if (lastRow < 1 || lastCol < 1) {
      db[sheetName] = [];
      return;
    }

    var data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var rowObj = {};
      var isEmpty = true;
      for (var j = 0; j < headers.length; j++) {
        var val = data[i][j];
        if (val !== "" && val !== null && val !== undefined) {
          isEmpty = false;
        }
        // Tự động parse JSON string nếu cột kết thúc bằng 'Json' hoặc 's'
        rowObj[headers[j]] = val;
      }
      if (!isEmpty) {
        rows.push(rowObj);
      }
    }
    db[sheetName] = rows;
  });

  return db;
}

// ==================== XỬ LÝ ĐỒNG BỘ TOÀN BỘ (SYNC ALL) ====================
function handleSyncAll(payload) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  // payload chứa object với key là tên sheet và value là mảng các đối tượng hàng
  for (var sheetName in payload) {
    if (payload.hasOwnProperty(sheetName)) {
      var rows = payload[sheetName];
      updateSheetWithRows(ss, sheetName, rows);
    }
  }
  return { status: "Synced successfully", updatedAt: new Date().toISOString() };
}

function handleSaveTable(tableName, rows) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  updateSheetWithRows(ss, tableName, rows);
  return { status: "Table " + tableName + " saved successfully" };
}

function updateSheetWithRows(ss, sheetName, rows) {
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) {
    sheet = ss.insertSheet(sheetName);
  }
  
  if (!rows || rows.length === 0) return;

  // Lấy headers từ keys của object đầu tiên
  var sample = rows[0];
  var headers = Object.keys(sample);

  // Xóa nội dung cũ (giữ lại headers dòng 1)
  sheet.clearContents();
  
  // Ghi headers
  sheet.appendRow(headers);
  sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold").setBackground("#e2e8f0");

  // Ghi dữ liệu các hàng
  var dataRows = [];
  rows.forEach(function(row) {
    var arr = [];
    headers.forEach(function(h) {
      var val = row[h];
      // Nếu là object/array, chuyển sang JSON string
      if (typeof val === 'object' && val !== null) {
        val = JSON.stringify(val);
      }
      arr.push(val !== undefined ? val : "");
    });
    dataRows.push(arr);
  });

  if (dataRows.length > 0) {
    sheet.getRange(2, 1, dataRows.length, headers.length).setValues(dataRows);
  }
}
`;
