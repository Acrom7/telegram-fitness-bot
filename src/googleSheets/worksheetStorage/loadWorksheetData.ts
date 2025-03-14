import { WorksheetColumn, WorksheetData, WorksheetRow } from '@/googleSheets/types';
import { DayOfWeek } from '@/types/dayOfWeek';

import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';

export async function loadWorksheetData(username: string): Promise<WorksheetData> {
    const result: WorksheetData = {
        chatId: NaN,
        dayOfWeek: DayOfWeek.Monday,
        exerciseNumber: 1,
    };

    const userNameSheet = getSheetByUsername(username);

    await userNameSheet.loadHeaderRow();

    const rows = await userNameSheet.getRows<WorksheetRow>();

    const chatId = Number(rows[0]?.get(WorksheetColumn.ChatId));

    if (chatId && !isNaN(chatId)) {
        result.chatId = chatId;
    }

    const exerciseNumber = Number(rows[0]?.get(WorksheetColumn.ActiveExerciseNumber));

    if (exerciseNumber && !isNaN(exerciseNumber)) {
        result.exerciseNumber = exerciseNumber;
    }

    const dayOfWeek = rows[0]?.get(WorksheetColumn.ActiveWeekday);

    if (typeof dayOfWeek === 'string') {
        result.dayOfWeek = dayOfWeek as DayOfWeek;
    }

    return result;
}
