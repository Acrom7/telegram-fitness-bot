import type { Middleware, Filter } from 'grammy';
import { MiddlewareContext } from '@couch/types';
import { initWorksheetStorage, saveWorksheetData } from '@/googleSheets';

export const handleInitMessage: Middleware<Filter<MiddlewareContext, 'message'>> = async (ctx, next) => {
    if (ctx.session.isInitialized) {
        return next();
    }

    const username = ctx.from.username;

    if (!username) {
        await ctx.reply('Username not found');

        return;
    }

    await initWorksheetStorage(username);

    await saveWorksheetData(username, {
        chatId: ctx.chatId,
    });

    ctx.session.isInitialized = true;

    return next();
};
