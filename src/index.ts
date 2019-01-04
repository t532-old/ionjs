import { init as initWhen, When } from './when'
import { init as initSender, sender } from './sender'
import { init as initReceiver, start, receiver } from './receiver'
import { use as useSession, run as runSession, create as createSessionManager } from './session-managers'
import { use as useMiddleware, run as runMiddleware } from './middleware-manager'

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
export const when = new When()
export { start }
export { sender, receiver }
export { runMiddleware, runSession, createSessionManager }
export { useMiddleware, useSession }
export * from './adapter'
export * from './command'
export * from './middleware'
export * from './session'
