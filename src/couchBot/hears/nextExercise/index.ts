import { HearsMiddleware } from 'grammy';
import { getCurrentExerciseInfo, getExerciseByNumber, saveCurrentExerciseInfo } from '@/googleSheets';
import { getVideoUrl } from '@/s3';
import { MiddlewareContext } from '@couch/types';
import { FINISH_TRAINING, NEXT_EXERCISE } from '@couch/const/keyboardSentences';

export const nextExercise: HearsMiddleware<MiddlewareContext> = async (ctx) => {
    await ctx.reply('Загружаю упражнение...', {
        reply_markup: {
            remove_keyboard: true,
        },
    });

    const username = ctx.from?.username ?? '';

    const { dayOfWeek, exerciseNumber } = await getCurrentExerciseInfo(username);
    const exercise = await getExerciseByNumber({ username, dayOfWeek, exerciseNumber });
    const isLastExercise = exerciseNumber === ctx.session.currentDayExercises.length;

    if (!exercise) {
        await ctx.reply('Тренировка закончена', {
            reply_markup: {
                keyboard: [[{ text: FINISH_TRAINING }]],
                resize_keyboard: true,
            },
        })

        return;
    }

    const videoUrl = await getVideoUrl(exercise.videoName);

    await ctx.replyWithVideo(videoUrl, {
        caption: `${exercise.videoName}
${exercise.set}
${exercise.description}`,
        reply_markup: {
            keyboard: [[{ text: isLastExercise ? FINISH_TRAINING : NEXT_EXERCISE }]],
            resize_keyboard: true,
        },
    });

    await saveCurrentExerciseInfo(username, dayOfWeek, exerciseNumber + 1);
};
