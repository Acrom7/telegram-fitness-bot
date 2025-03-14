import { DayOfWeek } from '@/types/dayOfWeek';
import { Exercise } from '@/types/exercise';
import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';
import { MAP_DAY_OF_WEEK_TO_COLUMN } from '@/googleSheets/const';
import { getStartExerciseRowIndex } from '@/googleSheets/exercises/getStartExerciseRowIndex';

type Options = {
    username: string,
    exerciseNumber: number,
    dayOfWeek: DayOfWeek
}

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
