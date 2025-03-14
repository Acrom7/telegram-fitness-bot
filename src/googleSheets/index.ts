import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import { WorksheetColumn, WorksheetData, WorksheetRow } from '@/googleSheets/types';
import { MAP_DAY_OF_WEEK_TO_COLUMN } from '@/googleSheets/const';
import { DayOfWeek, DAYS_OF_WEEKS } from '@/types/dayOfWeek';
import { Exercise } from '@/types/exercise';
import { BotError, ErrorCode } from '@/const/BotError';
import { GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME, GOOGLE_SPREADSHEET_ID } from '@/const/env';
import ConsoleAuth from '@@/google-console.json' with { type: 'json' };

const exerciseColumnName = 'Список упражнений';

const serviceAccountAuth = new JWT({
    email: ConsoleAuth.client_email,
    key: ConsoleAuth.private_key,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const doc = new GoogleSpreadsheet(GOOGLE_SPREADSHEET_ID, serviceAccountAuth);

try {
    await doc.loadInfo();
} catch (e) {
    console.error('Error loading Google Spreadsheet:', e);
}

export async function listAllExercises(): Promise<string> {
    const rows = await doc.sheetsByTitle[GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME]?.getRows();

    if (!rows) {
        return 'No exercises found in the Google Sheet.';
    }

    return rows
        .map((row) => row.get(exerciseColumnName))
        .join('\n');
}

export async function appendExercise(exercise: string): Promise<void> {
    const sheet = getSheetByUsername(GOOGLE_SPREADSHEET_EXERCISES_SHEET_NAME);

    if (!sheet) {
        throw new Error('Упражнения не найдены');
    }

    await sheet.addRow({ [exerciseColumnName]: exercise }, {
        insert: true,
    });
}

export function getSheetByUsername(username: string) {
    const sheet = doc.sheetsByTitle[username];

    if (!sheet) {
        throw new BotError(ErrorCode.UserNotFound);
    }

    return sheet;
}

type Options = {
    username: string,
    exerciseNumber: number,
    dayOfWeek: DayOfWeek
}

const START_OFFSET_ROW = 3;
const ROWS_BETWEEN_EXERCISES = 4;

/**
 * Возвращает номер строки в таблице, где начинается упражнение
 * @param exerciseNumber - порядковый номер упражнения (1, 2, 3)
 * @returns номер строки
 */
function getStartExerciseRowIndex(exerciseNumber: number) {
    return START_OFFSET_ROW + (exerciseNumber - 1) * ROWS_BETWEEN_EXERCISES;
};

export const getExerciseNameByNumber = (options: Options) => {
    const { username, dayOfWeek, exerciseNumber } = options;

    const sheet = getSheetByUsername(username);
    const columnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[dayOfWeek];
    const rowIndex = getStartExerciseRowIndex(exerciseNumber);

    return sheet.getCellByA1(`${columnLetter}${rowIndex}`);
};

export const getExerciseByNumber = async (options: Options): Promise<Exercise | null> => {
    const { username, dayOfWeek, exerciseNumber } = options;

    const sheet = getSheetByUsername(username);
    const columnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[dayOfWeek];
    const rowIndex = getStartExerciseRowIndex(exerciseNumber);

    await sheet.loadCells(`${columnLetter}${rowIndex}:${columnLetter}${rowIndex + 2}`);

    const videoNameCell = sheet.getCellByA1(`${columnLetter}${rowIndex}`);
    const setCell = sheet.getCellByA1(`${columnLetter}${rowIndex + 1}`);
    const descriptionCell = sheet.getCellByA1(`${columnLetter}${rowIndex + 2}`);

    if (!videoNameCell?.formattedValue) {
        return null;
    }

    return {
        videoName: videoNameCell.formattedValue,
        set: setCell?.formattedValue,
        description: descriptionCell?.formattedValue,
    };
};

export async function getDaysOfWeeksWithTrainings(username: string) {
    const sheet = getSheetByUsername(username);
    const mondayColumnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[DayOfWeek.Monday];
    const sundayColumnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[DayOfWeek.Sunday];
    const rowIndex = getStartExerciseRowIndex(1);

    await sheet.loadCells(`${mondayColumnLetter}${rowIndex}:${sundayColumnLetter}${rowIndex}`);

    const firstExercises = DAYS_OF_WEEKS.map((dayOfWeek) => {
        const exerciseCell = getExerciseNameByNumber({
            username,
            exerciseNumber: 1,
            dayOfWeek,
        });

        return {
            dayOfWeek,
            value: exerciseCell.value,
        };
    });

    const result: DayOfWeek[] = firstExercises
        .filter((exercise) => exercise.value)
        .map((exercise) => exercise.dayOfWeek);

    return result;
}

export async function getExercisesByDayOfWeek(username: string, dayOfWeek: DayOfWeek) {
    const result: Exercise[] = [];

    for (let i = 1; i <= 10; i++) {
        const exercise = await getExerciseByNumber({
            username,
            dayOfWeek,
            exerciseNumber: i,
        });

        if (!exercise?.videoName) {
            break;
        }

        result.push(exercise);
    }

    return result;
}

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


export async function getAllClientsChatIds() {
    await doc.loadInfo();
    const result: { username: string, chatId: number }[] = [];

    const loadHeaders = doc.sheetsByIndex.map(sheet => sheet.loadHeaderRow());

    await Promise.all(loadHeaders);

    for (const sheet of doc.sheetsByIndex) {
        const rows = await sheet.getRows<WorksheetRow>();

        const chatId = rows[0]?.get(WorksheetColumn.ChatId);
        const chatIdNum = Number(chatId);

        if (chatIdNum && !isNaN(chatIdNum)) {
            result.push({
                chatId: chatIdNum,
                username: sheet.title,
            });
        }
    }

    return result;
}
