import { Exercise } from '@/types/exercise';
import { DayOfWeek } from '@/types/dayOfWeek';

export type UserStorage = {
    isInitialized: boolean;
    activeWeekday: DayOfWeek;
    currentExerciseNumber: number;
    currentDayExercises: Exercise[];
    isWaitingForUserReport: boolean;
}
