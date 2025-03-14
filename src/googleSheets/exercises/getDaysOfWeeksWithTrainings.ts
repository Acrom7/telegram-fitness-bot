import { getSheetByUsername } from '@/googleSheets/exercises/getSheetByUsername';
import { MAP_DAY_OF_WEEK_TO_COLUMN } from '@/googleSheets/const';
import { DayOfWeek, DAYS_OF_WEEKS } from '@/types/dayOfWeek';
import { getStartExerciseRowIndex } from '@/googleSheets/exercises/getStartExerciseRowIndex';
import { getExerciseCellByNumber } from '@/googleSheets/exercises/getExerciseCellByNumber';

export async function getDaysOfWeeksWithTrainings(username: string) {
    const sheet = getSheetByUsername(username);
    const mondayColumnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[DayOfWeek.Monday];
    const sundayColumnLetter = MAP_DAY_OF_WEEK_TO_COLUMN[DayOfWeek.Sunday];
    const rowIndex = getStartExerciseRowIndex(1);

    await sheet.loadCells(`${mondayColumnLetter}${rowIndex}:${sundayColumnLetter}${rowIndex}`);

    const firstExercises = DAYS_OF_WEEKS.map((dayOfWeek) => {
        const exerciseCell = getExerciseCellByNumber({
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
