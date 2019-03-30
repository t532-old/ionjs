import { MiddlewareManager, IMiddleware } from '../../middleware'
import { IExtensibleMessage } from '../definition'

let manager = new MiddlewareManager<IExtensibleMessage>()

/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
export function use(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager = manager.use(mw)
    console.log(`[INFO] ${manager.length} Middlewares loaded`)
}

/**
 * Use a list of middlewares last (or only one)
 * @param middlewares the middlewares
 */
export function useLast(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager = manager.useLast(mw)
    console.log(`[INFO] ${manager.length} Middlewares loaded`)
}

/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
export async function run(ctx: IExtensibleMessage) {
    try { await manager.run(ctx) }
    catch (err) {
        console.error('[ERROR] An error was thrown by one of the middlewares:')
        console.error(err)
    }
}