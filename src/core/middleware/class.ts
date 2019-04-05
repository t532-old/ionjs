import { nextExecutor, boundNextExecutor } from './util'
import { IMiddleware } from './definition'

/** A middleware manager */
export class MiddlewareManager<T> {
    /** The list of middlewares */
    private _middlewares: IMiddleware<T>[] = []
    /** The list of middlewares that runs at last */
    private _lastMiddlewares: IMiddleware<T>[] = []
    public static from<T>(last: MiddlewareManager<T>) {
        const next = new MiddlewareManager<T>()
        next._middlewares = Array.from(last._middlewares)
        next._lastMiddlewares = Array.from(last._lastMiddlewares)
        return next
    }
    /** Returns how many middlewares there are */
    public get length() { return this._middlewares.length + this._lastMiddlewares.length }
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    public use(middleware: IMiddleware<T>) {
        const next = MiddlewareManager.from<T>(this)
        next._middlewares = [...(next._middlewares || []), middleware]
        return next
    }
    /**
     * add a middleware to another middleware list that'll be run at last
     * @param middleware the middleware
     */
    public useLast(middleware: IMiddleware<T>) {
        const next = MiddlewareManager.from<T>(this)
        next._lastMiddlewares = [...(next._lastMiddlewares || []), middleware]
        return next
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    public async run(ctx: T) {
        if (this._middlewares.length || this._lastMiddlewares.length)
            await nextExecutor<T>([...this._middlewares, ...this._lastMiddlewares][Symbol.iterator](), ctx)()
    }
    public async runBound(ctx: T, thisRef: any) {
        if (this._middlewares.length || this._lastMiddlewares.length)
            await boundNextExecutor<T>([...this._middlewares, ...this._lastMiddlewares][Symbol.iterator](), ctx, thisRef)()
    }
}
