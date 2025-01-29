import { Bot, GrammyError, HttpError } from 'grammy';
import { listGoogleVideos, listSelectel, start } from 'src/bot/commands';
import { handleVideoMessage } from 'src/bot/messages';

const bot = new Bot(process.env.BOT_TOKEN ?? '');

bot.catch((err) => {
    const ctx = err.ctx;
    const e = err.error;

    let error = `Error while handling update ${ctx.update.update_id}:`;

    if (e instanceof GrammyError) {
        error += `\nError in request: ${e.description}`;
    } else if (e instanceof HttpError) {
        error += `\nCould not contact Telegram: ${e}`;
    } else {
        error += `\nUnknown error: ${e}`;
    }

    ctx.reply(error);
});

bot.command('start', start);
bot.command('list_selectel', listSelectel);
bot.command('list_google', listGoogleVideos);

bot.api.setMyCommands([
    { command: 'list_google', description: 'Вывести список упражнений в Гугл Таблице' },
    { command: 'list_selectel', description: 'Вывести список видео-упражнений в Selectel' },
]);

bot.on(':video', handleVideoMessage);

export const startBot = () => bot.start();
