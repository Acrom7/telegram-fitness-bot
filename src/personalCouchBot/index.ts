import { Bot, GrammyError, HttpError, session } from 'grammy';
import { start } from './commands';
import { sendExercise, writeReport, startDayTraining } from './hears';
import { START_TRAINING, NEXT_EXERCISE, WRITE_REPORT, BACK_TO_WEEK } from './const/keyboardSentences';
import { sessionStorage } from './sessionStorage';
import { MiddlewareContext } from '@couch/types/middlewareContext';
import { DAYS_OF_WEEKS } from 'src/types/dayOfWeek';

const bot = new Bot<MiddlewareContext>(process.env.COUCH_BOT_TOKEN ?? '');

bot.use(session(sessionStorage));

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
bot.hears(BACK_TO_WEEK, start);
bot.hears(START_TRAINING, sendExercise);
bot.hears(NEXT_EXERCISE, sendExercise);
// TODO: add write report
bot.hears(WRITE_REPORT, writeReport);

DAYS_OF_WEEKS.forEach((day) => {
    bot.hears(day, startDayTraining);
})

export const startCouchBot = () => bot.start();
