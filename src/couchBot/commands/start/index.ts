import { MiddlewareContext } from '@couch/types';
import { getDaysOfWeeksWithTrainings } from '@/googleSheets';

export async function start(ctx: MiddlewareContext) {
    const username = ctx.from?.username;

    if (!username) {
        await ctx.reply('Username not found.');

        return;
    }

    try {
        const days = await getDaysOfWeeksWithTrainings(username);

        await ctx.reply('Выберете день для начала тренировки', {
            reply_markup: {
                keyboard: days.map((day) => [{ text: day }]),
                resize_keyboard: true,
            },
        });
    } catch (e) {
        await ctx.reply(`
        Произошла ошибка.
        ${JSON.stringify(e, null, 2)}`);
    }
}
