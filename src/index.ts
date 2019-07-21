import * as middleware from './app/middleware'
import * as session from './app/session'
import * as receiver from './app/receiver'
import { ICQCode } from './platform/cqcode'
import * as Util from './platform/cqcode/util'
import Signale from 'signale'
import { unionIdOf, contextTypeOf } from './platform/receiver'
const logger = Signale.scope('main')

declare module './definition' {
    interface IExtensibleMessage {
        /** Array form of message content */
        message_array?: ICQCode[]
        /** Message content decoded into plain text (without escaping) */
        raw_message?: string
    }
}

let queue = new Promise(resolve => resolve())

/**
 * Start the bot application
 * @param middlewareTimeout The longest bearable time a middleware run can take. Excess will lead to warning
 */
export function start(middlewareTimeout = 10000) {
    middleware.use(async function (ctx, next) {
        if ('message' in ctx) {
            if ((ctx.message as any) instanceof Array)
                ctx.message = Util.toText(ctx.message as any as ICQCode[])
            ctx.message_array = Util.toArray(ctx.message)
            ctx.raw_message = Util.decodePlainText(ctx.message)
        }
        logger.await(`Received message: ${unionIdOf(ctx)} -> ${contextTypeOf(ctx)} ${ctx.message || ''}`)
        await next()
    })
    middleware.useLast(session.run)
    receiver.receiver.on('post', function (ctx) {
        queue = queue.then(() => new Promise(async resolve => {
            let finished = false
            setTimeout(() => {
                if (!finished) {
                    logger.warn(`Middlewares didn't finish processing message within ${middlewareTimeout} ms.`)
                    resolve()
                }
            }, middlewareTimeout)
            await middleware.run(ctx)
            finished = true
            resolve()
        }))
    })
    receiver.start()
}
