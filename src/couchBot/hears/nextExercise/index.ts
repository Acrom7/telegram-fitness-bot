import { HearsMiddleware } from 'grammy';
import { getVideoUrl } from '@/s3';
import { MiddlewareContext } from '@couch/types';
import { FINISH_TRAINING, NEXT_EXERCISE } from '@couch/const/keyboardSentences';
import { saveWorksheetData } from '@/googleSheets';

export const nextExercise: HearsMiddleware<MiddlewareContext> = async (ctx) => {
    await ctx.reply('Загружаю упражнение...', {
        reply_markup: {
            remove_keyboard: true,
        },
    });

    const username = ctx.from?.username ?? '';

    const { currentExerciseNumber, currentDayExercises } = ctx.session;
    const exercise = currentDayExercises[currentExerciseNumber - 1];
    const isLastExercise = currentExerciseNumber === currentDayExercises.length;

    if (!exercise) {
        await ctx.reply('Тренировка закончена', {
            reply_markup: {
                keyboard: [[{ text: FINISH_TRAINING }]],
                resize_keyboard: true,
            },
        });

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

    ctx.session.currentExerciseNumber++;

    await saveWorksheetData(username, {
        exerciseNumber: currentExerciseNumber + 1,
    });
};
