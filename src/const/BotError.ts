import { BOTS_OWNER_USERNAME } from '@/const/env';

export const enum ErrorCode {
    UserNotFound,
    AdminNotFound,
}

const MAP_ERROR_CODE_TO_MESSAGE = {
    [ErrorCode.UserNotFound]: `Пользователь не найден. Если хотите воспользоваться этим ботом обратитесь к @${BOTS_OWNER_USERNAME}`,
    [ErrorCode.AdminNotFound]: `Чат с Администратором не найден. Пожалуйста сообщите об ошибке @${BOTS_OWNER_USERNAME}`,
}

export class BotError extends Error {
    constructor(code: ErrorCode) {
        super(MAP_ERROR_CODE_TO_MESSAGE[code]);
        this.name = 'BotError';
    }
}
