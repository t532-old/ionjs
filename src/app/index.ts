import * as middleware from './instance/middleware'
import * as session from './instance/session'
import * as receiver from './instance/receiver'
import { Util, ICQCode } from '../platform/cqcode'

declare module './definition' {
    interface IExtensibleMessage {
        message_array: ICQCode[]
        raw_message: string
    }
}

let queue = new Promise(resolve => resolve())

export function start(middlewareTimeout = 10000) {
    middleware.use(async (ctx, next) => {
        if (ctx.message as any instanceof Array) 
            ctx.message = Util.arrayToString(ctx.message as any as ICQCode[])
        ctx.message_array = Util.stringToArray(ctx.message)
        ctx.raw_message = Util.decodePlainText(ctx.message)
        await next()
    })
    middleware.useLast(session.run)
    receiver.receiver.on('post', ctx =>
        queue = queue.then(() => new Promise(async resolve => {
            let finished = false
            setTimeout(() => {
                if (!finished) {
                    console.warn(`[WARN] Middlewares didn't finish processing message within ${middlewareTimeout} ms.`)
                    resolve()
                }
            }, middlewareTimeout)
            await middleware.run(ctx)
            finished = true
            resolve()
        }))
    )
    receiver.start()
}