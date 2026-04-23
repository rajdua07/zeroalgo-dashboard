// ZeroAlgo Dashboard — Apps Script backend
// Paste this into Extensions > Apps Script in your Google Sheet,
// then Deploy > New deployment > Web app (Anyone can access).
//
const SHEET_ID = '1BuQpGYwpfSjA8FrNS49ZvnD0cye2PzT7FnISnSG7XKs';
const DASHBOARD_TOKEN = 'REPLACE_WITH_YOUR_PASSWORD';

function doGet(e) {
  const params = e.parameter || {};

  // Auth check endpoint: ?action=auth&token=xxx
  if (params.action === 'auth') {
    return json({ ok: params.token === DASHBOARD_TOKEN });
  }

  // All data endpoints require a valid token
  if (params.token !== DASHBOARD_TOKEN) {
    return json({ error: 'Unauthorized', auth: false });
  }

  const sheetName = params.sheet || '';

  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // No sheet param → return list of available sheets
    if (!sheetName) {
      const names = ss.getSheets().map(s => s.getName());
      return json({ sheets: names });
    }

    const ws = ss.getSheetByName(sheetName);
    if (!ws) return json({ error: 'Sheet not found: ' + sheetName });

    // getDisplayValues returns formatted strings ("$168.41", "9.58%") — easier to parse
    const values = ws.getDataRange().getDisplayValues();
    return json(values);

  } catch (err) {
    return json({ error: err.message });
  }
}

function json(data) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
