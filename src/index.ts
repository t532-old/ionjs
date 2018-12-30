import * as Adapter from './adapter'
import * as Command from './command'
import * as Middleware from './middleware'
import * as Session from './session'

import { init as initWhen } from './when'
import { init as initSender, sender } from './sender'
import { init as initReceiver, start, receiver } from './receiver'
import { use as useSession, run as runSession } from './session-managers'
import { use as useMiddleware, run as runMiddleware } from './middleware-manager'

const _config: { operators?: number[], prefixes?: string[], self?: number } = {}

export function init({ receivePort = 8080, receiveSecret, sendURL = 'http://127.0.0.1:5700', sendToken, operators = [], prefixes = [], self }: {
    receivePort: number, 
    receiveSecret?: string, 
    sendURL: string, 
    sendToken?: string, 
    operators?: number[],
    prefixes?: string[],
    self: number,
}) {
    initReceiver(receivePort, receiveSecret)
    initSender(sendURL, sendToken)
    initWhen({ operators, prefixes, self })
    receiver.on('message', async ctx => {
        await runMiddleware(ctx)
        runSession(ctx)
    })
}
export { start }
export { sender, receiver }
export { useMiddleware, useSession }
export const Classes = { Adapter, Command, Middleware, Session }
