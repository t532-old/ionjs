import { MiddlewareManager, TMiddleware } from './middleware'

const manager = new MiddlewareManager()

export function use(middleware: TMiddleware) { manager.use(middleware) }

export function run(ctx: any) { return manager.run(ctx) }