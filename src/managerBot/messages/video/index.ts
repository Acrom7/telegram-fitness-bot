import type { Context, Middleware, Filter } from 'grammy';
import path from 'path';
import axios from 'axios';
import fs from 'fs';
import { uploadObject } from '@/s3';
import { MANAGER_BOT_TOKEN } from '@/const/env';
import { appendExercise } from '@/googleSheets';

export const handleVideoMessage: Middleware<Filter<Context, ':video'>> = async (ctx) => {
    const video = ctx.message?.video;
    const fileId = video?.file_id;

    if (!fileId) {
        await ctx.reply('No video file found in the message.');

        return;
    }

    const file = await ctx.api.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${MANAGER_BOT_TOKEN}/${file.file_path}`;
    const fileName = ctx.message?.caption ?? path.parse(video?.file_name ?? 'unknown.mp4').name;
    const filePath = path.join(import.meta.dirname, fileName);

    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
        try {
            await ctx.reply(`Видео **${fileName}** загружается...`, { parse_mode: 'MarkdownV2' });
            await uploadObject({
                Key: fileName,
                Body: fs.createReadStream(filePath),
            });

            await appendExercise(fileName);
            await ctx.reply('Видео успешно добавлено в Google Таблицу');
        } catch (error: any) {
            await ctx.reply(`Failed to upload video to S3: ${error.message}`);
        } finally {
            fs.unlinkSync(filePath);
        }
    });

    writer.on('error', (err) => {
        ctx.reply(`Failed to download video: ${err.message}`);
    });
};
