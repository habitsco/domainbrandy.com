import { google } from "googleapis";
import { JWT } from "google-auth-library";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

let auth: JWT | null = null;

export const getAuth = async (): Promise<JWT> => {
  if (!auth) {
    auth = new google.auth.JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY,
      scopes: SCOPES,
    });
  }
  return auth;
};

export const appendToGoogleSheet = async (spreadsheetId: string, values: any[]) => {
  const auth = await getAuth();
  const sheets = google.sheets({ version: "v4", auth });

  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: "Sheet1!A1",
    valueInputOption: "RAW",
    requestBody: {
      values: [values],
    },
  });
};

export const getDomainName = (domain: string) => domain.replace('www.', '') as string;
