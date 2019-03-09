import { BotWhen } from '../classes/when'

/** An object for determining when should a session start */
let _when: BotWhen

export function when() { return _when }

export function init(obj: {
    operators: number[],
    prefixes: string[],
    self: number,
}) { _when = new BotWhen(obj).raw().type('message') }