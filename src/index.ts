import 'module-alias/register'
import { Utils as CQCodeUtils } from '@/classes/cqcode'
import { init as initWhen, When } from '@/classes/when'
import { init as initSender, sender } from '@/instances/sender'
import { init as initReceiver, start, receiver } from '@/instances/receiver'
import { use as useSession, run as runSession, create as createSessionManager } from '@/instances/sessions'
import { use as useMiddleware, useLast as useMiddlewareLast, run as runMiddleware } from '@/instances/middlewares'

const queue = new Promise(resolve => resolve())
/**
 * Initialize the bot
 * @param config the bot's configuration
 */
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
    useMiddleware(async (ctx, next) => {
        if (ctx.message instanceof Array) ctx.message = CQCodeUtils.arrayToString(ctx.message)
        await next()
    })
    useMiddlewareLast(async ctx => await runSession(ctx))
    receiver.on('message', ctx => 
        queue.then(async () => await runMiddleware(ctx))
    )
}
/** An object for determining when should a session start */
export const when = new When()
export { start }
export { sender, receiver }
export { runMiddleware, runSession, createSessionManager }
export { useMiddleware, useSession }
export * from '@/classes/sender'
export * from '@/classes/receiver'
export * from '@/classes/cqcode'
export * from '@/classes/when'
export * from '@/classes/command'
export * from '@/classes/middleware'
export * from '@/classes/session'