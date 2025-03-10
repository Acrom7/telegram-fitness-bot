import { UserStorage } from './types';
import { enhanceStorage, SessionOptions } from 'grammy';
import { FileAdapter } from '@grammyjs/storage-file';
import { DayOfWeek } from '@/types/dayOfWeek';

export const fileStorage: SessionOptions<UserStorage> = {
    initial: () => ({
        activeWeekday: DayOfWeek.Monday,
        currentExerciseNumber: 1,
        isWaitingForUserReport: false,
        currentDayExercises: [],
    }),
    storage: enhanceStorage({
        storage: new FileAdapter({
            dirName: 'users-sessions-storage',
        }),
        millisecondsToLive: 60 * 60 * 1000 // 1 hour
    }),
};
