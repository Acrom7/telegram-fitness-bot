import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';
import ConsoleAuth from 'google-console.json' with { type: 'json' };
import { WorksheetColumn, WorksheetRow } from 'src/googleSheets/types';
import { MAP_DAY_OF_WEEK_TO_COLUMN } from 'src/googleSheets/const';
import { DayOfWeek, DAYS_OF_WEEKS } from 'src/types/dayOfWeek';
import { Exercise } from 'src/types/exercise';

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
    const sheet = getSheetByUsername(googleSpreadsheetExercisesSheetName);

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
        throw new Error('Пользователь не найден');
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

export async function saveCurrentExerciseInfo(username: string, dayOfWeek: DayOfWeek, exerciseNumber: number) {
    const sheet = getSheetByUsername(username);
    const rows = await sheet.getRows({
        limit: 1,
        offset: 0,
    });

    const row = rows[0];

    row?.set(WorksheetColumn.ActiveWeekday, dayOfWeek);
    row?.set(WorksheetColumn.ActiveExerciseNumber, exerciseNumber);

    await row?.save();
}

export async function getCurrentExerciseInfo(username: string) {
    const sheet = getSheetByUsername(username);
    const rows = await sheet.getRows<WorksheetRow>({
        limit: 1,
        offset: 0,
    });
    const row = rows[0];

    return {
        dayOfWeek: row?.get(WorksheetColumn.ActiveWeekday) as DayOfWeek,
        exerciseNumber: Number(row?.get(WorksheetColumn.ActiveExerciseNumber) ?? 1),
    };
}

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
    const sheet = getSheetByUsername(username);
    const columnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[dayOfWeek];
    const firstExerciseRowIndex = getStartExerciseRowIndex(1);
    const lastExerciseRowIndex = getStartExerciseRowIndex(10);

    await sheet.loadCells(`${columnLetter}${firstExerciseRowIndex}:${columnLetter}${lastExerciseRowIndex + 2}`);

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

export async function saveChatIdToWorksheet(username: string, chatId: number) {
    const userNameSheet = getSheetByUsername(username);


    await userNameSheet.loadHeaderRow();

    const rows = await userNameSheet.getRows<WorksheetRow>();

    rows[0]?.set(WorksheetColumn.ChatId, chatId);
    await rows[0]?.save();
}
