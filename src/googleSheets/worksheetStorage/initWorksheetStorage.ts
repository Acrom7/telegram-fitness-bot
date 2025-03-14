import { WorksheetColumn } from '@/googleSheets/types';
import { DayOfWeek } from '@/types/dayOfWeek';

import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';

export async function initWorksheetStorage(username: string) {
    const sheet = getSheetByUsername(username);

    await sheet.loadHeaderRow();

    const isHeaderRowPresent = [WorksheetColumn.ChatId, WorksheetColumn.ActiveExerciseNumber, WorksheetColumn.ActiveWeekday]
        .every((column) => sheet.headerValues.includes(column));

    if (isHeaderRowPresent) {
        return;
    }

    await sheet.loadCells('J1:L2');

    const initialValues = [
        // заголовки
        {
            cellA1: 'J1',
            value: WorksheetColumn.ChatId,
        },
        {
            cellA1: 'K1',
            value: WorksheetColumn.ActiveWeekday,
        },
        {
            cellA1: 'L1',
            value: WorksheetColumn.ActiveExerciseNumber,
        },
        // значения
        {
            cellA1: 'J2',
            value: '',
        },
        {
            cellA1: 'K2',
            value: DayOfWeek.Monday,
        },
        {
            cellA1: 'L2',
            value: 1,
        },
    ];

    for (const { cellA1, value } of initialValues) {
        const cell = sheet.getCellByA1(cellA1);
        cell.value = value;
    }

    await sheet.saveUpdatedCells();
}
