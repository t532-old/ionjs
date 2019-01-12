import { nextExecutor } from './utils'
import { TMiddleware } from './definition'
import Debug from 'debug'
const debug = Debug('ionjs:middleware'),
      debugVerbose = Debug('verbose-ionjs:middleware')

/** A middleware manager */
export class MiddlewareManager {
    /** The list of middlewares */
    private _middlewares: TMiddleware[] = []
    /** The list of middlewares that runs at last */
    private _lastMiddlewares: TMiddleware[] = []
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    use(middleware: TMiddleware) {
        this._middlewares = [...(this._middlewares || []), middleware]
        debug('use (+%d)', this._middlewares.length)
        return this
    }
    /**
     * add a middleware to another middleware list that'll be run at last
     * @param middleware the middleware
     */
    useLast(middleware: TMiddleware) {
        this._lastMiddlewares = [...(this._lastMiddlewares || []), middleware]
        debug('use last (+%d)', this._lastMiddlewares.length)
        return this
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    async run(ctx: any) {
        debugVerbose('start %o', ctx)
        if (this._middlewares.length) 
            await nextExecutor([...this._middlewares, ...this._lastMiddlewares][Symbol.iterator](), ctx)()
        debugVerbose('finish')
    }
}