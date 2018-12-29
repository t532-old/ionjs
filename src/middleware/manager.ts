import { generateNextExecutor } from './next'
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
        return this
    }
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    async run(ctx: any) {
        const executed = this.middlewares.map(() => false)
        for (let mw in this.middlewares)
            if (!executed[mw])
                await this.middlewares[mw](ctx, generateNextExecutor(this.middlewares, parseInt(mw) + 1, ctx, executed))
    }
}