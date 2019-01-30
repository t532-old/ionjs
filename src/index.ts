import { Utils as CQCodeUtils, ICQCode } from './classes/cqcode'
import { BotWhen } from './classes/when'
import { init as initSender, sender } from './instances/sender'
import { init as initReceiver, start, receiver } from './instances/receiver'
import { use as useMiddleware, useLast as useMiddlewareLast, run as runMiddleware } from './instances/middlewares'
import { init as initSession, use as useSession, run as runSession, create as createSessionManager } from './instances/sessions'

const queue = new Promise(resolve => resolve())
/**
 * Initialize the bot
 * @param config the bot's configuration
 */
export function init({ receivePort = 8080, receiveSecret, sendURL = 'http://127.0.0.1:5700', sendToken, operators = [], prefixes = [], self, middlewareTimeout = 10000, sessionTimeout = Infinity }: {
    receivePort: number,
    receiveSecret?: string,
    sendURL: string,
    sendToken?: string,
    operators?: number[],
    prefixes?: string[],
    self: number,
    middlewareTimeout?: number,
    sessionTimeout?: number,
}) {
    initReceiver(receivePort, receiveSecret)
    initSender(sendURL, sendToken)
    initSession(sessionTimeout)
    BotWhen.init({ operators, prefixes, self })
    useMiddleware(async (ctx, next) => {
        if (ctx.message as ICQCode[]|string instanceof Array) ctx.message = CQCodeUtils.arrayToString(ctx.message as ICQCode[])
        await next()
    })
    useMiddlewareLast(async ctx => runSession(ctx))
    receiver.on('post', ctx =>
        queue.then(() => new Promise(async resolve => {
            setTimeout(() => {
                console.warn(`[WARN] Middlewares didn't finish processing message within ${middlewareTimeout} ms.`)
                resolve()
            }, middlewareTimeout)
            await runMiddleware(ctx)
            resolve()
        }))
    )
}
/** An object for determining when should a session start */
export const when: BotWhen = new BotWhen().raw().type('message')
export { start }
export { sender, receiver }
export { runMiddleware, runSession, createSessionManager }
export { useMiddleware, useSession }
export { ISessionContext, TExtensibleMessage } from './instances/definitions'
export * from './classes/sender'
export * from './classes/receiver'
export * from './classes/cqcode'
export * from './classes/when'
export * from './classes/command'
export * from './classes/middleware'
export * from './classes/session'