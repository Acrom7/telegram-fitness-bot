import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';
import { GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME } from '@/const/env';
import { exerciseColumnName } from '@/googleSheets/const';

export async function appendExercise(exercise: string): Promise<void> {
    const sheet = getSheetByUsername(GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME);

    if (!sheet) {
        throw new Error('Упражнения не найдены');
    }

    await sheet.addRow({ [exerciseColumnName]: exercise }, {
        insert: true,
    });
}
