import { CronJob } from 'cron';
import { Bot } from 'grammy';
import { getAllClientsChatIds } from '@/googleSheets';

export const createWeeklyReportCronJob = (bot: Bot) => CronJob.from({
    cronTime: '0 20 * * Fri',  // Every Friday at 8 PM
    onTick: async () => {
        const clients = await getAllClientsChatIds();

        const weeklyReportReminders = clients.map(({ chatId, username }) => {
            console.log(`Sending weekly report reminder to ${username} in chat ${chatId}`);

            return bot.api.sendMessage(chatId, 'Добрый вечер!\nНапоминаю, что завтра вы должны прислать недельный отчет');
        });

        const result= await Promise.allSettled(weeklyReportReminders);

        console.log('Weekly report reminders sent');
        console.log(JSON.stringify(result, null, 2));
    },
    timeZone: 'Europe/Moscow',
});
