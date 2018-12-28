import Koa from 'koa'
import koaBody from 'koa-body'
import Debug from 'debug'
import { createHmac } from 'crypto'
import { EventEmitter } from 'events'
const debug = Debug('ionjs: Receiver')
export class Receiver extends EventEmitter {
    private readonly _server = new Koa()
    constructor(secret?: string) {
        super()
        const thisRef = this
        if (secret) {
            this._server.use(async ctx => {
                ctx.assert(ctx.request.headers['x-signature'] !== undefined, 401);
                const sig = createHmac('sha1', secret).update((ctx.request as Koa.Request&{ rawBody: string }).rawBody).digest('hex')
                ctx.assert(ctx.request.headers['x-signature'] === `sha1=${sig}`, 403)
            })
        }
        this._server.use(koaBody())
        this._server.use(async ctx => {
            const msg = ctx.request.body
            debug(`received: ${JSON.stringify(msg)}`)
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