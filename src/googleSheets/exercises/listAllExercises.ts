import { spreadsheet } from '@/googleSheets/spreadsheet';
import { GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME } from '@/const/env';
import { exerciseColumnName } from '@/googleSheets/const';

export async function listAllExercises(): Promise<string> {
    const rows = await spreadsheet.sheetsByTitle[GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME]?.getRows();

    if (!rows) {
        return 'No exercises found in the Google Sheet.';
    }

    return rows
        .map((row) => row.get(exerciseColumnName))
        .join('\n');
}
