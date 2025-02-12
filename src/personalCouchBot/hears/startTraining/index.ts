import { Context, HearsMiddleware } from 'grammy';
import { getCurrentExerciseInfo, getExerciseByNumber, saveCurrentExerciseInfo } from 'src/googleSheets';
import { getVideoUrl } from 'src/s3';

export const sendExercise: HearsMiddleware<Context> = async (ctx) => {
    await ctx.reply('Загружаю упражнение...', {
        reply_markup: {
            remove_keyboard: true,
        },
    });

    const username = ctx.from?.username ?? '';


    const { dayOfWeek, exerciseNumber } = await getCurrentExerciseInfo(username);
    const exercise = await getExerciseByNumber({ username, dayOfWeek, exerciseNumber });

    if (!exercise) {
        await ctx.reply('Тренировка закончена');

        return;
    }

    const videoUrl = await getVideoUrl(exercise.videoName);

    await ctx.replyWithVideo(videoUrl, {
        caption: `${exercise.videoName}
${exercise.set}
${exercise.description}`,
        reply_markup: {
            keyboard: [[{ text: 'Следующее упражнение' }]],
            resize_keyboard: true,
        },
    });

    await saveCurrentExerciseInfo(username, dayOfWeek, exerciseNumber + 1)
};
