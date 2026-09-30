import { google } from "googleapis";

/* ─── Google Sheets Helper ──────────────────────────────────────
   Centralised helper so both server actions and API routes can
   append rows without duplicating auth logic.
   ──────────────────────────────────────────────────────────────── */

function getAuth() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;

  if (!clientEmail || !rawKey) {
    throw new Error(
      "Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY in environment variables."
    );
  }

  // .env files encode newlines as literal \n — we need actual newlines
  const privateKey = rawKey.replace(/\\n/g, "\n");

  return new google.auth.GoogleAuth({
    credentials: {
      client_email: clientEmail,
      private_key: privateKey,
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
}

/**
 * Append a row of values to the configured Google Sheet.
 * The sheet must have been shared with the service account email.
 *
 * @param values  – An array of cell values for a single row.
 * @param sheetName – Tab name inside the spreadsheet (default "Sheet1").
 */
export async function appendRow(
  values: (string | number | boolean | null | undefined)[],
  sheetName = "Sheet1"
) {
  const sheetId = process.env.GOOGLE_SHEET_ID;

  if (!sheetId) {
    throw new Error(
      "Missing GOOGLE_SHEET_ID in environment variables."
    );
  }

  const auth = getAuth();
  const sheets = google.sheets({ auth, version: "v4" });

  // Use a wide range so Google auto-detects the next empty row
  const range = `${sheetName}!A:Z`;

  const response = await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range,
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [values],
    },
  });

  return response.data;
}
