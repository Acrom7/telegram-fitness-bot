import { JWT } from 'google-auth-library';
import ConsoleAuth from '@@/google-console.json';
import { GoogleSpreadsheet } from 'google-spreadsheet';
import { GOOGLE_SPREADSHEET_ID } from '@/const/env';

const serviceAccountAuth = new JWT({
    email: ConsoleAuth.client_email,
    key: ConsoleAuth.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

export const spreadsheet = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

try {
    await spreadsheet.loadInfo();
} catch (e) {
    console.error('Error loading Google Spreadsheet:', e);
}
