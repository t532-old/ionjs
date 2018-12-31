import * as Koa from 'koa'
import * as koaBody from 'koa-bodyparser'
import Debug from 'debug'
import { createHmac } from 'crypto'
import { EventEmitter } from 'events'
declare module 'koa' {
    interface Request {
        body: any;
        rawBody: string;
    }
}

const debug = Debug('ionjs: Receiver')
export class Receiver extends EventEmitter {
    private readonly _server = new Koa()
    constructor(secret?: string) {
        super()
        const thisRef = this
        this._server.use(koaBody())
        if (secret) {
            this._server.use(async (ctx, next) => {
                ctx.assert(ctx.request.headers['x-signature'] !== undefined, 401);
                const sig = createHmac('sha1', secret).update(ctx.request.rawBody).digest('hex')
                ctx.assert(ctx.request.headers['x-signature'] === `sha1=${sig}`, 403)
                await next()
            })
        }
        this._server.use(async ctx => {
            const msg = ctx.request.body
            debug(`received: %o`, msg)
            let events: string[] = ['post', msg.post_type, `${msg.post_type}/${msg.message_type || msg.request_type || msg.notice_type || msg.meta_event_type}`]
            msg._union_id = msg.group_id || msg.discuss_id || msg.user_id
            if (msg.sub_type) events.push(`${msg.post_type}/${msg.message_type || msg.request_type || msg.notice_type || msg.meta_event_type}/${msg.sub_type}`)
            debug(`emit event: ${events.toString()}`)
            for (const event of events) thisRef.emit(event, msg)
        })
        debug.extend(' constructor')('server ready')
    }
    listen(port: number) {
        this._server.listen(port)
        debug.extend(' listener')('server started')
    }
}