import { spreadsheet } from '@/googleSheets/spreadsheet';
import { WorksheetColumn, WorksheetRow } from '@/googleSheets/types';

export async function getAllClientsChatIds() {
    await spreadsheet.loadInfo();
    const result: { username: string, chatId: number }[] = [];

    const loadHeaders = spreadsheet.sheetsByIndex.map(sheet => sheet.loadHeaderRow());

    await Promise.all(loadHeaders);

    for (const sheet of spreadsheet.sheetsByIndex) {
        const rows = await sheet.getRows<WorksheetRow>();

        const chatId = rows[0]?.get(WorksheetColumn.ChatId);
        const chatIdNum = Number(chatId);

        if (chatIdNum && !isNaN(chatIdNum)) {
            result.push({
                chatId: chatIdNum,
                username: sheet.title,
            });
        }
    }

    return result;
}
