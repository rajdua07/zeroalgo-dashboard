// ZeroTrading Dashboard — Apps Script backend
// Paste this into Extensions > Apps Script in your Google Sheet,
// then Deploy > New deployment > Web app (Anyone can access).

const SHEET_ID = '1BuQpGYwpfSjA8FrNS49ZvnD0cye2PzT7FnISnSG7XKs';

function doGet(e) {
  const sheetName = (e.parameter && e.parameter.sheet) || '';

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
