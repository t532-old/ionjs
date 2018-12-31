import { generateNextExecutor } from './next'
import { TMiddleware } from './definition'
import Debug from 'debug'
const debug = {
    use: Debug('ionjs: MiddlewareManager: use'),
    run: Debug('verbose-ionjs: MiddlewareManager: run'),
}

/** A middleware manager */
export class MiddlewareManager {
    /** The list of middlewares */
    private _middlewares: TMiddleware[] = []
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    use(middleware: TMiddleware) {
        this._middlewares = [...(this._middlewares || []), middleware]
        debug.use(`add new middleware, current size ${this._middlewares.length}`)
        return this
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    async run(ctx: any) {
        debug.run('start (ctx %o)', ctx)
        if (this._middlewares.length) await this._middlewares[0](ctx, generateNextExecutor(this._middlewares, 1, ctx))
        debug.run('end (ctx %o)', ctx)
    }
}