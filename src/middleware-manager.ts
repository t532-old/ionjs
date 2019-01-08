import { MiddlewareManager, TMiddleware } from './middleware'

const manager = new MiddlewareManager()

/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
export function use(...middlewares: TMiddleware[]) { 
    for (const mw of middlewares)
        manager.use(mw) 
}

/**
 * Use a list of middlewares last (or only one)
 * @param middlewares the middlewares
 */
export function useLast(...middlewares: TMiddleware[]) { 
    for (const mw of middlewares)
        manager.useLast(mw) 
}

/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
export function run(ctx: any) { return manager.run(ctx) }