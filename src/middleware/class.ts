import { nextExecutor } from './util'
import { IMiddleware } from './definition'

/** A middleware manager */
export class MiddlewareManager<T> {
    /** The list of middlewares */
    private _middlewares: IMiddleware<T>[] = []
    /** The list of middlewares that runs at last */
    private _lastMiddlewares: IMiddleware<T>[] = []
    /** Returns how many middlewares there are */
    get length() { return this._middlewares.length + this._lastMiddlewares.length }
    static from<T>(last: MiddlewareManager<T>) {
        const next = new MiddlewareManager<T>()
        next._middlewares = Array.from(last._middlewares)
        next._lastMiddlewares = Array.from(last._lastMiddlewares)
        return next
    }
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    use(middleware: IMiddleware<T>) {
        this._middlewares = [...(this._middlewares || []), middleware]
        return this
    }
    /**
     * add a middleware to another middleware list that'll be run at last
     * @param middleware the middleware
     */
    useLast(middleware: IMiddleware<T>) {
        this._lastMiddlewares = [...(this._lastMiddlewares || []), middleware]
        return this
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    async run(ctx: T) {
        if (this._middlewares.length)
            await nextExecutor<T>([...this._middlewares, ...this._lastMiddlewares][Symbol.iterator](), ctx)()
    }
}