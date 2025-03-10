import { HearsMiddleware } from 'grammy';
import { MiddlewareContext } from '@couch/types';

export const finishTraining: HearsMiddleware<MiddlewareContext> = async (ctx) => {
    ctx.session.isWaitingForUserReport = true;

    await ctx.reply(`Расскажите, как прошла ваша тренировка: `, {
        reply_markup: {
            remove_keyboard: true,
        },
    });
};
