import { spreadsheet } from '@/googleSheets/spreadsheet';
import { BotError, ErrorCode } from '@/const/BotError';

export function getSheetByUsername(username: string) {
    const sheet = spreadsheet.sheetsByTitle[username];

    if (!sheet) {
        throw new BotError(ErrorCode.UserNotFound);
    }

    return sheet;
}
