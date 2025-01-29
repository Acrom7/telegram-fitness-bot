import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import ConsoleAuth from 'google-console.json';

const googleSpreadsheetExercisesSheetName = process.env.GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME ?? '';
const exerciseColumnName = 'Список упражнений';

// Initialize auth - see https://theoephraim.github.io/node-google-spreadsheet/#/guides/authentication
const serviceAccountAuth = new JWT({
    email: ConsoleAuth.client_email,
    key: ConsoleAuth.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(process.env.GOOGLE_SPREADSHEET_ID ?? '', serviceAccountAuth);

await doc.loadInfo();

export async function listAllExercises(): Promise<string> {
    const rows = await doc.sheetsByTitle[googleSpreadsheetExercisesSheetName]?.getRows();

    if (!rows) {
        return 'No exercises found in the Google Sheet.';
    }

    return rows
        .map((row) => row.get(exerciseColumnName))
        .join('\n');
}

export async function appendExercise(exercise: string): Promise<void> {
    const sheet = doc.sheetsByTitle[googleSpreadsheetExercisesSheetName];

    if (!sheet) {
        throw new Error('Sheet not found');
    }

    await sheet.addRow({ [exerciseColumnName]: exercise }, {
        insert: true,
    });
}
