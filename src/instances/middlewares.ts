import { MiddlewareManager, IMiddleware } from '../classes/middleware'
import { IMessage } from '../classes/receiver'
import { IExtensibleMessage } from './definitions'

const manager = new MiddlewareManager<IExtensibleMessage>()

/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
export function use(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager.use(mw)
    console.log(`[INFO] ${manager.length} Middlewares loaded`)
}

/**
 * Use a list of middlewares last (or only one)
 * @param middlewares the middlewares
 */
export function useLast(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager.useLast(mw)
    console.log(`[INFO] ${manager.length} Middlewares loaded`)
}

/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
export async function run(ctx: IMessage) {
    try { await manager.run(ctx) }
    catch (err) {
        console.error('[ERROR] An error was thrown by one of the middlewares:')
        console.error(err)
    }
}