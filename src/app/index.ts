import { Util, ICQCode } from '../platform/cqcode'
import { init as initWhen } from './instance/when'
import { init as initSender } from './instance/sender'
import { init as initReceiver, receiver } from './instance/receiver'
import { use as useMiddleware, useLast as useMiddlewareLast, run as runMiddleware } from './instance/middleware'
import { init as initSession, run as runSession } from './instance/session'

let queue = new Promise(resolve => resolve())
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
    initWhen({ operators, prefixes, self })
    useMiddleware(async (ctx, next) => {
        if (ctx.message instanceof Array) ctx.message = Util.arrayToString(ctx.message as ICQCode[])
        await next()
    })
    useMiddlewareLast(async ctx => runSession(ctx))
    receiver.on('post', ctx =>
        queue = queue.then(() => new Promise(async resolve => {
            let finished = false
            setTimeout(() => {
                if (!finished) {
                    console.warn(`[WARN] Middlewares didn't finish processing message within ${middlewareTimeout} ms.`)
                    resolve()
                }
            }, middlewareTimeout)
            await runMiddleware(ctx)
            finished = true
            resolve()
        }))
    )
}