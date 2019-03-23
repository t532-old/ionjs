import * as Koa from 'koa'
import * as koaBody from 'koa-bodyparser'
import Debug from 'debug'
import { createHmac } from 'crypto'
import { EventEmitter } from 'events'
import { contextTypeOf } from './util'
const debug = Debug('ionjs:receiver'),
      debugVerbose = Debug('verbose-ionjs:receiver')

export class Receiver extends EventEmitter {
    private readonly _server = new Koa()
    constructor(secret?: string) {
        super()
        const thisRef = this
        this._server.use(koaBody())
        if (secret) {
            this._server.use(async (ctx, next) => {
                ctx.assert(ctx.request.headers['x-signature'] !== undefined, 401)
                const sig = createHmac('sha1', secret).update(ctx.request.rawBody).digest('hex')
                ctx.assert(ctx.request.headers['x-signature'] === `sha1=${sig}`, 403)
                debugVerbose('validate')
                await next()
            })
        }
        this._server.use(async ctx => {
            const msg = ctx.request.body
            const events = contextTypeOf(msg)
            debug('receive %o', msg)
            debug('emit %o', events)
            for (const event of events) thisRef.emit(event, msg)
            ctx.status = 200
        })
        debug('init')
    }
    listen(port: number) {
        this._server.listen(port)
        debug('listen')
    }
}