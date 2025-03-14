import { HearsMiddleware } from 'grammy';
import { getExercisesByDayOfWeek, saveWorksheetData } from '@/googleSheets';
import { BACK_TO_WEEK, START_TRAINING } from '@couch/const/keyboardSentences';
import { DayOfWeek } from '@/types/dayOfWeek';
import { MiddlewareContext } from '@couch/types';

export const startDayTraining: HearsMiddleware<MiddlewareContext> = async (ctx) => {
    const dayOfWeek = ctx.message?.text as DayOfWeek;

    await ctx.reply('Загружаю список упражнений...', {
        reply_markup: {
            remove_keyboard: true,
        },
    });

    const dayExercises = await getExercisesByDayOfWeek(ctx.from?.username ?? '', dayOfWeek);

    ctx.session.currentDayExercises = dayExercises;
    ctx.session.activeWeekday = dayOfWeek;
    ctx.session.currentExerciseNumber = 1;

    const exerciseList = dayExercises.map((exercise, index) => {
        return `${index + 1}. **${exercise.videoName}**
    ${exercise.set}
    ${exercise.description}`;
    });

    await Promise.all([
        saveWorksheetData(ctx.from?.username ?? '', {
            exerciseNumber: 1,
            dayOfWeek,
        }),
        ctx.reply(exerciseList.join('\n\n'), {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [[{ text: START_TRAINING }], [{ text: BACK_TO_WEEK }]],
                resize_keyboard: true,
            },
        }),
    ]);
};
