import { DayOfWeek } from '@/types/dayOfWeek';
import { MAP_DAY_OF_WEEK_TO_COLUMN } from '@/googleSheets/const';
import { getSheetByUsername } from './getSheetByUsername';
import { getStartExerciseRowIndex } from './getStartExerciseRowIndex';

type Options = {
    username: string,
    exerciseNumber: number,
    dayOfWeek: DayOfWeek
}

export const getExerciseCellByNumber = (options: Options) => {
    const { username, dayOfWeek, exerciseNumber } = options;

    const sheet = getSheetByUsername(username);
    const columnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[dayOfWeek];
    const rowIndex = getStartExerciseRowIndex(exerciseNumber);

    return sheet.getCellByA1(`${columnLetter}${rowIndex}`);
};
