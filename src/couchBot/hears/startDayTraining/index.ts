import { Context, HearsMiddleware } from 'grammy';
import { getExercisesByDayOfWeek, saveCurrentExerciseInfo } from '@/googleSheets';
import { BACK_TO_WEEK, START_TRAINING } from '@couch/const/keyboardSentences';
import { DayOfWeek } from '@/types/dayOfWeek';

export const startDayTraining: HearsMiddleware<Context> = async (ctx) => {
    const dayOfWeek = ctx.message?.text as DayOfWeek;

    await ctx.reply('Загружаю список упражнений...', {
        reply_markup: {
            remove_keyboard: true,
        },
    });

    const res = await getExercisesByDayOfWeek(ctx.from?.username ?? '', dayOfWeek);
    const exerciseList = res.map((exercise, index) => {
        return `${index + 1}. **${exercise.videoName}**
    ${exercise.set}
    ${exercise.description}`;
    });

    await Promise.all([
        saveCurrentExerciseInfo(ctx.from?.username ?? '', dayOfWeek, 1),
        ctx.reply(exerciseList.join('\n\n'), {
            parse_mode: 'Markdown',
            reply_markup: {
                keyboard: [[{ text: START_TRAINING }], [{ text: BACK_TO_WEEK }]],
                resize_keyboard: true,
            },
        }),
    ]);
};
