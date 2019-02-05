import { BotWhen } from '../classes/when'

/** An object for determining when should a session start */
export const when = new BotWhen().raw().type('message')

export function init(obj: {
    operators: number[],
    prefixes: string[],
    self: number,
}) { when.init(obj) }