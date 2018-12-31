import { MiddlewareManager, TMiddleware } from './middleware'

const manager = new MiddlewareManager()

export function use(...middlewares: TMiddleware[]) { 
    for (const mw of middlewares)
        manager.use(mw) 
}

export function run(ctx: any) { return manager.run(ctx) }