import { UserStorage } from './types';
import { SessionOptions } from 'grammy';
import { FileAdapter } from '@grammyjs/storage-file';

export const fileStorage: SessionOptions<UserStorage> = {
    initial: () => ({
        activeWeekday: 0,
        currentExerciseNumber: 1,
    }),
    storage: new FileAdapter({
        dirName: 'users',
    }),
};
