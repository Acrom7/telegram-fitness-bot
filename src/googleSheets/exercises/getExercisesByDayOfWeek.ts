import { DayOfWeek } from '@/types/dayOfWeek';
import { Exercise } from '@/types/exercise';

import { getExerciseByNumber } from '@/googleSheets/exercises/getExerciseByNumber';

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
