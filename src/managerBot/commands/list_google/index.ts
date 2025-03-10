import type { Context, CommandMiddleware } from 'grammy';
import { listAllExercises } from '@/googleSheets';

export const listGoogleVideos: CommandMiddleware<Context> = async (ctx) => {
    try {
        const exercisesList = await listAllExercises();

        await ctx.reply(exercisesList);
    } catch (error: any) {
        await ctx.reply(`Failed to list objects in the bucket: ${error.message}`);
    }
};
