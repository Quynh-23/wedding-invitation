// Google Apps Script for the wedding RSVP form.
// Spreadsheet ID is already configured for this invitation.
const SPREADSHEET_ID = '16CoRjtLjZhVX6q96H24lLf5oBUO9C-h7Nyv6UNfJL2g';
const SHEET_NAME = 'RSVP';
const HEADERS = ['Thời gian gửi', 'Họ và tên', 'Xác nhận tham dự', 'Số lượng người', 'Lời chúc', 'Mã phản hồi'];

function doGet() {
  try {
    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    return HtmlService.createHtmlOutput(
      'RSVP endpoint is ready. Spreadsheet connection: OK. Spreadsheet: ' +
      ss.getName()
    );
  } catch (err) {
    return HtmlService.createHtmlOutput(
      'RSVP endpoint is running, but spreadsheet connection failed: ' +
      String(err && err.message ? err.message : err)
    );
  }
}

function doPost(e) {
  let requestId = '';
  try {
    const p = (e && e.parameter) ? e.parameter : {};
    requestId = String(p.requestId || '');
    const name = cleanText_(p.name, 100);
    const attendance = cleanText_(p.attendance, 60);
    const count = cleanText_(p.count, 10);
    const message = cleanText_(p.message, 500);

    if (!name || !attendance || !count) throw new Error('Thiếu thông tin bắt buộc.');

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      let sheet = ss.getSheetByName(SHEET_NAME);
      if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(HEADERS);
        sheet.setFrozenRows(1);
        sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
      }
      sheet.appendRow([new Date(), safeCell_(name), safeCell_(attendance), safeCell_(count), safeCell_(message), safeCell_(requestId)]);
    } finally {
      lock.releaseLock();
    }
    return responsePage_(requestId, true, '');
  } catch (err) {
    console.error(err);
    return responsePage_(requestId, false, String(err && err.message ? err.message : err));
  }
}

function cleanText_(value, maxLength) {
  return String(value || '').replace(/[\u0000-\u001F\u007F]/g, ' ').trim().slice(0, maxLength);
}

// Prevent user-entered text from being interpreted as a spreadsheet formula.
function safeCell_(value) {
  const s = String(value || '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function responsePage_(requestId, success, error) {
  const payload = JSON.stringify({ type: 'rsvp_saved', requestId: requestId, success: success, error: error });
  const html = '<!doctype html><html><head><meta charset="utf-8"></head><body><script>' +
    'window.top.postMessage(' + payload + ', "*");' +
    '</script></body></html>';
  return HtmlService.createHtmlOutput(html)
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
