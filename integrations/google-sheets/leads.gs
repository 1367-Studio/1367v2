/**
 * 1367 Studio — leads webhook (Google Apps Script, bound to the "Leads" sheet).
 *
 * The site's /api/contact endpoint POSTs { secret, lead } here for every form
 * submission; this appends one row per lead to the "Leads" tab.
 *
 * Setup: Extensions → Apps Script in the sheet, paste this file, set SECRET to
 * the same value as LEADS_WEBHOOK_SECRET on Vercel, then Deploy → New
 * deployment → Web app (Execute as: Me, Who has access: Anyone). Put the /exec
 * URL in LEADS_WEBHOOK_URL on Vercel.
 */
const SECRET = 'REPLACE_WITH_LEADS_WEBHOOK_SECRET';
const SHEET_NAME = 'Leads';

// [column header, key in the lead payload]
const COLUMNS = [
  ['Reçu le', 'received_at'],
  ['Nom', 'name'],
  ['Email', 'email'],
  ['Entreprise', 'company'],
  ['Site web', 'website'],
  ['Nous a connus via', 'source'],
  ['Message', 'message'],
  ['Formulaire', 'form'],
  ['Page', 'page'],
  ['Google Ads (gclid)', 'gclid'],
  ['utm_source', 'utm_source'],
  ['utm_medium', 'utm_medium'],
  ['utm_campaign', 'utm_campaign'],
  ['utm_term', 'utm_term'],
  ['utm_content', 'utm_content'],
  ['Page d\'arrivée', 'landing_page'],
  ['Referrer', 'referrer'],
  ['Première visite', 'first_seen'],
  ['gbraid', 'gbraid'],
  ['wbraid', 'wbraid'],
  ['Cookies', 'consent'],
  ['Statut', '_status'],
];

function doPost(e) {
  const body = JSON.parse(e.postData.contents || '{}');
  if (body.secret !== SECRET) return reply({ ok: false, error: 'unauthorized' });

  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = getSheet();
    const lead = body.lead || {};
    const row = COLUMNS.map(([, key]) => {
      if (key === '_status') return 'Nouveau';
      const v = lead[key] || '';
      return (key === 'received_at' || key === 'first_seen') && v ? new Date(v) : String(v);
    });
    sheet.appendRow(row);
    return reply({ ok: true });
  } finally {
    lock.releaseLock();
  }
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(COLUMNS.map(([header]) => header));
    sheet.setFrozenRows(1);
    sheet.getRange(1, 1, 1, COLUMNS.length).setFontWeight('bold');
    sheet.getRange('A:A').setNumberFormat('dd/MM/yyyy HH:mm');
    sheet.getRange('R:R').setNumberFormat('dd/MM/yyyy HH:mm');
  }
  return sheet;
}

function reply(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

/** Run once from the editor to create the header row and test permissions. */
function setup() {
  getSheet();
}
