import * as Koa from 'koa'
import * as koaBody from 'koa-bodyparser'
import { createHmac } from 'crypto'
import { EventEmitter } from 'events'
import { contextTypeOf } from './util'

export class Receiver extends EventEmitter {
    private readonly _server = new Koa()
    constructor(secret?: string) {
        super()
        const thisRef = this
        this._server.use(koaBody())
        if (secret) {
            this._server.use(async function (ctx, next) {
                ctx.assert(ctx.request.headers['x-signature'] !== undefined, 401)
                const sig = createHmac('sha1', secret).update(ctx.request.rawBody).digest('hex')
                ctx.assert(ctx.request.headers['x-signature'] === `sha1=${sig}`, 403)
                await next()
            })
        }
        this._server.use(async function (ctx) {
            const msg = ctx.request.body
            const events = contextTypeOf(msg)
            for (const event of events) thisRef.emit(event, msg)
            ctx.status = 200
        })
    }
    listen(port: number) {
        this._server.listen(port)
    }
}