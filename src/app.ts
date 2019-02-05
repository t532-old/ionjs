import { Utils as CQCodeUtils, ICQCode } from './classes/cqcode'
import { init as initWhen } from './instances/when' 
import { init as initSender } from './instances/sender'
import { init as initReceiver, receiver } from './instances/receiver'
import { use as useMiddleware, useLast as useMiddlewareLast, run as runMiddleware } from './instances/middlewares'
import { init as initSession, run as runSession } from './instances/sessions'

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
    initWhen({ operators, prefixes, self })
    useMiddleware(async (ctx, next) => {
        if (ctx.message instanceof Array) ctx.message = CQCodeUtils.arrayToString(ctx.message as ICQCode[])
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