import type { Middleware, Filter } from 'grammy';
import { MiddlewareContext } from '@couch/types';
import { loadChatIdFromWorksheet } from '@/googleSheets';
import { BOTS_OWNER_USERNAME } from '@/const/env';

export const handleReportMessage: Middleware<Filter<MiddlewareContext, 'message'>> = async (ctx) => {
    const adminChatId = await loadChatIdFromWorksheet(BOTS_OWNER_USERNAME)
    ctx.session.isWaitingForUserReport = false;

    await ctx.api.sendMessage(adminChatId, `Отчет о тренировке на ${ctx.session.activeWeekday} от пользователя @${ctx.from.username}`);
    await ctx.forwardMessage(adminChatId)
};
