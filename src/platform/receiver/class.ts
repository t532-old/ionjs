import Koa from 'koa'
import koaBody from 'koa-bodyparser'
import { createHmac } from 'crypto'
import { EventEmitter } from 'events'
import { contextTypeOf } from './util'

export class Receiver extends EventEmitter {
    private readonly _server = new Koa()
    public constructor(secret?: string) {
        super()
        this._server.use(koaBody())
        if (secret) {
            this._server.use(async function (ctx, next) {
                ctx.assert(ctx.request.headers['x-signature'] !== undefined, 401)
                const sig = createHmac('sha1', secret).update(ctx.request.rawBody).digest('hex')
                ctx.assert(ctx.request.headers['x-signature'] === `sha1=${sig}`, 403)
                await next()
            })
        }
        this._server.use(async (ctx) => {
            const msg = ctx.request.body
            const events = contextTypeOf(msg)
            for (const event of events) this.emit(event, msg)
            ctx.status = 200
        })
    }
    public listen(port: number) {
        this._server.listen(port)
    }
}
