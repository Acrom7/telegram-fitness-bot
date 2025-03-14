import { WorksheetColumn, WorksheetData, WorksheetRow } from '@/googleSheets/types';

import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';

export async function saveWorksheetData(username: string, data: Partial<WorksheetData>) {
    const { exerciseNumber, chatId, dayOfWeek } = data;

    const userNameSheet = getSheetByUsername(username);

    await userNameSheet.loadHeaderRow();

    const rows = await userNameSheet.getRows<WorksheetRow>();

    if (typeof chatId !== 'undefined') {
        rows[0]?.set(WorksheetColumn.ChatId, chatId);
    }

    if (typeof exerciseNumber !== 'undefined') {
        rows[0]?.set(WorksheetColumn.ActiveExerciseNumber, exerciseNumber);
    }

    if (typeof dayOfWeek !== 'undefined') {
        rows[0]?.set(WorksheetColumn.ActiveWeekday, dayOfWeek);
    }

    await rows[0]?.save();
}
