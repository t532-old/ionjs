import { generateNextExecutor } from './next'
export class MiddlewareManager {
    middlewares: ((ctx: any, next: () => Promise<void>) => void)[] = []
    use(middleware: (ctx: any, next: () => Promise<void>) => void) {
        this.middlewares = [...(this.middlewares || []), middleware]
        return this
    }
    async run(ctx: any) {
        const executed = this.middlewares.map(() => false)
        for (let mw in this.middlewares)
            if (!executed[mw])
                await this.middlewares[mw](ctx, generateNextExecutor(parseInt(mw) + 1, ctx, executed))
    }
}