import type { CommandContext, HearsContext } from 'grammy';
import { MiddlewareContext } from '@couch/types';
import { getDaysOfWeeksWithTrainings, saveChatIdToWorksheet } from '@/googleSheets';

export async function start(ctx: CommandContext<MiddlewareContext>): Promise<void>;
export async function start(ctx: HearsContext<MiddlewareContext>): Promise<void>;
export async function start(ctx: CommandContext<MiddlewareContext> | HearsContext<MiddlewareContext>) {
    const username = ctx.from?.username;
    const chatId = ctx.chat.id;
    const isFirstMessage = ctx.message?.text === '/start';

    if (!username) {
        await ctx.reply('Username not found.');
        return;
    }

    try {
        const [days] = await Promise.all([
            getDaysOfWeeksWithTrainings(username),
            isFirstMessage ? saveChatIdToWorksheet(username, chatId) : undefined,
        ]);

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
};
