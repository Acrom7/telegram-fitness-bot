import { BOTS_OWNER_USERNAME } from '@/const/env';

export const enum ErrorCode {
    UserNotFound,
}

const MAP_ERROR_CODE_TO_MESSAGE = {
    [ErrorCode.UserNotFound]: `Пользователь не найден. Если хотите воспользоваться этим ботом обратитесь к ${BOTS_OWNER_USERNAME}`,
}

export class BotError extends Error {
    constructor(code: ErrorCode) {
        super(MAP_ERROR_CODE_TO_MESSAGE[code]);
        this.name = 'BotError';
    }
}
