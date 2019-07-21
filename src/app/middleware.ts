import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import Signale from 'signale'
const logger = Signale.scope('middleware')

let manager = new MiddlewareManager<IExtensibleMessage>()

/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
export function use(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager = manager.use(mw)
    logger.info(`${manager.length} Middlewares loaded`)
}

/**
 * Use a list of middlewares last (or only one)
 * @param middlewares the middlewares
 */
export function useLast(...middlewares: IMiddleware<IExtensibleMessage>[]) {
    for (const mw of middlewares)
        manager = manager.useLast(mw)
    logger.info(`${manager.length} Middlewares loaded`)
}

/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
export async function run(ctx: IExtensibleMessage) {
    try { await manager.run(ctx) }
    catch (err) { logger.error('An error was thrown by one of the middlewares:\n', err) }
}

/**
 * Let a context go through the middlewares, call middlewares with a specified this object
 * @param ctx the context
 * @param thisRef
 */
export async function runBound(ctx: IExtensibleMessage, thisRef: any) {
    try { await manager.runBound(ctx, thisRef) }
    catch (err) { logger.error('An error was thrown by one of the middlewares:\n', err) }
}
