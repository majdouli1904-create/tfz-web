/**
 * Google Apps Script: doPost saves orders; doGet returns orders when ?admin=1&token=...
 * Ensure Script Properties:
 *  - SPREADSHEET_ID
 *  - ORDER_TOKEN
 */

function _getRequestBody(e) {
  try {
    if (e.postData && e.postData.type && e.postData.type.indexOf('application/json') !== -1) {
      return JSON.parse(e.postData.contents || '{}');
    }
    if (e.parameter && e.parameter.payload) {
      return JSON.parse(e.parameter.payload);
    }
    if (e.postData && e.postData.contents) {
      try { return JSON.parse(e.postData.contents); } catch (err) { /* noop */ }
    }
  } catch (err) {}
  return {};
}

function _jsonResponse(code, obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader('Access-Control-Allow-Origin', '*')
    .setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
    .setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

function doGet(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const SPREADSHEET_ID = props.getProperty('SPREADSHEET_ID');
    const ORDER_TOKEN = props.getProperty('ORDER_TOKEN') || '';
    if (!SPREADSHEET_ID) return _jsonResponse(400, { success: false, error: 'SPREADSHEET_ID not configured' });

    if (e.parameter && e.parameter.admin === '1') {
      const receivedToken = e.parameter.token || '';
      if (ORDER_TOKEN && ORDER_TOKEN !== '' && receivedToken !== ORDER_TOKEN) {
        return _jsonResponse(401, { success: false, error: 'Invalid token' });
      }

      const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
      const sheet = ss.getSheetByName('Orders');
      if (!sheet) return _jsonResponse(200, { success: true, orders: [] });

      const values = sheet.getDataRange().getValues();
      const headers = values[0];
      const rows = values.slice(1);
      const orders = rows.map(r => {
        const obj = {};
        headers.forEach((h, i) => {
          obj[h] = r[i];
        });
        try {
          if (obj.items && typeof obj.items === 'string') obj.items = JSON.parse(obj.items);
        } catch (e) {}
        try {
          if (obj.raw_payload && typeof obj.raw_payload === 'string') obj.raw_payload = JSON.parse(obj.raw_payload);
        } catch (e) {}
        return obj;
      });
      return _jsonResponse(200, { success: true, orders });
    }

    return _jsonResponse(200, { success: true, message: 'Order endpoint active' });
  } catch (err) {
    return _jsonResponse(500, { success: false, error: err.message });
  }
}

function doPost(e) {
  try {
    const props = PropertiesService.getScriptProperties();
    const SPREADSHEET_ID = props.getProperty('SPREADSHEET_ID');
    const ORDER_TOKEN = props.getProperty('ORDER_TOKEN') || '';

    if (!SPREADSHEET_ID) {
      return _jsonResponse(400, { success: false, error: 'SPREADSHEET_ID not configured' });
    }

    const body = _getRequestBody(e);
    const receivedToken = (e.parameter && e.parameter.token) || body.token || '';
    if (ORDER_TOKEN && ORDER_TOKEN !== '' && receivedToken !== ORDER_TOKEN) {
      return _jsonResponse(401, { success: false, error: 'Invalid token' });
    }

    const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
    let sheet = ss.getSheetByName('Orders');
    if (!sheet) {
      sheet = ss.insertSheet('Orders');
    }

    const headers = ['timestamp', 'name', 'email', 'phone', 'note', 'total', 'items', 'source', 'raw_payload'];
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(headers);
    }

    const timestamp = new Date();
    const customer = (body.customer) ? body.customer : {};
    const total = body.total || '';
    const items = body.items || [];
    const source = body.source || '';
    const raw = body;

    const row = [
      timestamp,
      customer.name || '',
      customer.email || '',
      customer.phone || '',
      customer.note || '',
      total,
      JSON.stringify(items),
      source,
      JSON.stringify(raw)
    ];

    sheet.appendRow(row);

    return _jsonResponse(200, { success: true, message: 'Order saved' });
  } catch (err) {
    return _jsonResponse(500, { success: false, error: err.message });
  }
}