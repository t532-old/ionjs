import { MiddlewareManager, TMiddleware } from '../classes/middleware'
import { IMessage } from '../classes/receiver'
import { TExtensibleMessage } from './definitions'

const manager = new MiddlewareManager<TExtensibleMessage>()

/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
export function use(...middlewares: TMiddleware<TExtensibleMessage>[]) { 
    for (const mw of middlewares)
        manager.use(mw) 
}

/**
 * Use a list of middlewares last (or only one)
 * @param middlewares the middlewares
 */
export function useLast(...middlewares: TMiddleware<TExtensibleMessage>[]) { 
    for (const mw of middlewares)
        manager.useLast(mw) 
}

/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
export function run(ctx: IMessage) { return manager.run(ctx) }