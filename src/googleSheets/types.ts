import { DayOfWeek } from '@/types/dayOfWeek';

export const enum WorksheetColumn {
    ChatId = 'chatId',
    ActiveWeekday = 'activeWeekday',
    ActiveExerciseNumber = 'activeExerciseNumber'
}

export type WorksheetRow = {
    [WorksheetColumn.ChatId]: number;
    [WorksheetColumn.ActiveWeekday]: string;
    [WorksheetColumn.ActiveExerciseNumber]: number;
}

export type WorksheetData = {
    chatId: number;
    dayOfWeek: DayOfWeek;
    exerciseNumber: number;
}
