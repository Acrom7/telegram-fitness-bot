import type { Context, CommandMiddleware } from 'grammy';
import { getBucketObjects } from '@/s3';
import { formatBytes } from '@/utils/formatBytes';

export const listSelectel: CommandMiddleware<Context> = async (ctx) => {
    try {
        const listResult = await getBucketObjects();

        const keys = listResult.Contents?.map((object) => `*${object.Key}*, ${formatBytes(object.Size ?? 0)}`).join('\n') ?? 'No objects found';

        await ctx.reply(keys, {
            parse_mode: 'Markdown',
        });
    } catch (error: any) {
        await ctx.reply(`Failed to list objects in the bucket: ${error.message}`);
    }
};
