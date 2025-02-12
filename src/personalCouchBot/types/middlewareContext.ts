import { Context, SessionFlavor } from 'grammy';
import { UserStorage } from '@couch/sessionStorage';

export type MiddlewareContext = Context & SessionFlavor<UserStorage>
