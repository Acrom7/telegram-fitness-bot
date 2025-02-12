import { Context, HearsMiddleware } from 'grammy';

export const writeReport:HearsMiddleware<Context> = async (ctx) => {
    await ctx.reply('writeReport');
}
