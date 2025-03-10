import { Exercise } from '@/types/exercise';
import { DayOfWeek } from '@/types/dayOfWeek';

export type UserStorage = {
    activeWeekday: DayOfWeek;
    currentExerciseNumber: number;
    currentDayExercises: Exercise[];
    isWaitingForUserReport: boolean;
}
