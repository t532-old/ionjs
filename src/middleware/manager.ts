import { generateNextExecutor } from './next'
import Debug from 'debug'
const debug = {
    use: Debug('ionjs: MiddlewareManager: use'),
    run: Debug('verbose-ionjs: MiddlewareManager: run'),
}
/** A middleware manager */
export class MiddlewareManager {
    /** The list of middlewares */
    middlewares: ((ctx: any, next: () => Promise<void>) => void)[] = []
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    use(middleware: (ctx: any, next: () => Promise<void>) => void) {
        this.middlewares = [...(this.middlewares || []), middleware]
        debug.use(`add new middleware, current size ${this.middlewares.length}`)
        return this
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    async run(ctx: any) {
        debug.run('start (ctx %o)', ctx)
        const executed = this.middlewares.map(() => false)
        for (let mw in this.middlewares)
            if (!executed[mw])
                await this.middlewares[mw](ctx, generateNextExecutor(this.middlewares, parseInt(mw) + 1, ctx, executed))
        debug.run('end (ctx %o)', ctx)
    }
}