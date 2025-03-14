import { Bot, GrammyError, HttpError, session } from 'grammy';
import { start } from './commands';
import { nextExercise, startDayTraining, finishTraining } from './hears';
import { handleReportMessage, handleInitMessage } from './messages';
import {
    START_TRAINING,
    NEXT_EXERCISE,
    BACK_TO_WEEK,
    FINISH_TRAINING,
} from './const/keyboardSentences';
import { sessionStorage } from './sessionStorage';
import { MiddlewareContext } from './types';
import { DAYS_OF_WEEKS } from '@/types/dayOfWeek';
import { COUCH_BOT_TOKEN } from '@/const/env';
import { BotError } from '@/const/BotError';
import { createWeeklyReportCronJob } from '@couch/cron/weeklyReport';

const bot = new Bot<MiddlewareContext>(COUCH_BOT_TOKEN);

bot.use(session(sessionStorage));

bot.catch((err) => {
    const ctx = err.ctx;
    const e = err.error;

    let error = `Произошла ошибка:`;

    if (e instanceof BotError) {
        error += `\n${e.message}`;
    } else if (e instanceof GrammyError) {
        error += `\nError in request: ${e.description}`;
    } else if (e instanceof HttpError) {
        error += `\nCould not contact Telegram: ${e}`;
    } else {
        error += `\nUnknown error: ${e}`;
    }

    ctx.reply(error);
});

bot.on('message', handleInitMessage);

bot.command('start', start);
bot.hears(BACK_TO_WEEK, start);
bot.hears(START_TRAINING, nextExercise);
bot.hears(NEXT_EXERCISE, nextExercise);
bot.hears(FINISH_TRAINING, finishTraining);
bot
    .on('message')
    .filter((ctx) => ctx.session.isWaitingForUserReport,
        handleReportMessage,
    );

DAYS_OF_WEEKS.forEach((day) => {
    bot.hears(day, startDayTraining);
});

const cronJob = createWeeklyReportCronJob(bot)

cronJob.start();

export const startCouchBot = () => bot.start();
