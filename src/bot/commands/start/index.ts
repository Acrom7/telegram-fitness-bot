import { Context, CommandMiddleware } from 'grammy';

export const start: CommandMiddleware<Context> = async (ctx) => {
    await ctx.reply('Проснулись, потянулись!');
};
