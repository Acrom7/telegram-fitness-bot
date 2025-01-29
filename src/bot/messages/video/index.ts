import type { Context, Middleware } from 'grammy';
import { appendExercise } from 'src/googleSheets';
import path from 'path';
import { findObjectByName, uploadObject } from 'src/s3';
import axios from 'axios';
import fs from 'fs';
import type { Filter } from 'grammy/out/filter';

const __dirname = path.resolve();

export const handleVideoMessage: Middleware<Filter<Context, ':video'>> = async (ctx) => {
    const video = ctx.message?.video;
    const fileId = video?.file_id;

    if (!fileId) {
        await ctx.reply('No video file found in the message.');

        return;
    }

    const file = await ctx.api.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${bot.token}/${file.file_path}`;
    const fileName = ctx.message?.caption ?? video?.file_name ?? 'unknown.mp4';
    const filePath = path.join(__dirname, fileName);

    // try {
    //     const existingObject = await findObjectByName(fileName);
    //
    //     if (existingObject) {
    //         const repsponse = await ctx.reply('Видео с таким именем уже существует в Selectel. Хотите заменить его?', {
    //             reply_markup: {
    //                 keyboard: [
    //                     ['Да', 'Нет'],
    //                 ],
    //             },
    //         });
    //
    //         console.log({ repsponse });
    //     }
    // } catch (e) {
    //
    // }

    // Download the video file
    const response = await axios({
        url: fileUrl,
        method: 'GET',
        responseType: 'stream',
    });

    const writer = fs.createWriteStream(filePath);
    response.data.pipe(writer);

    writer.on('finish', async () => {
        try {
            await ctx.reply(`Видео загружается...`);
            await uploadObject({
                Key: fileName,
                Body: fs.createReadStream(filePath),
            });
            await ctx.reply(`Видео успешно загружено: ${fileName}`);

            await ctx.reply('Добавляю видео в Google Таблицу...');
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
