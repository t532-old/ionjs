import { IExtensibleMessage } from './definition'
import { MessageStream, IStreamGetter } from '../session'
import { Util } from '../platform/cqcode'
import { run } from './instance/session'
import { Sender, MessageContent } from '../platform/sender'
import { ITransform, PlainTransform } from './transform'
import * as ObjectFrom from 'deepmerge'

export class SessionContext {
    private static readonly _transformPlaceholder = new PlainTransform()
    private readonly _stream: MessageStream<IExtensibleMessage>
    private readonly _streamOf: IStreamGetter<IExtensibleMessage>
    private readonly _trigger: IExtensibleMessage
    private readonly _sender: Sender
    private _firstRead = false
    private readonly _transform: ITransform
    public get stream() { return this._stream }
    public get sender() { return this._sender }
    public constructor({ stream, streamOf, trigger, sender, transform }: {
        stream: MessageStream<IExtensibleMessage>
        streamOf: IStreamGetter<IExtensibleMessage>
        trigger: IExtensibleMessage
        sender: Sender
        transform: ITransform
    }) {
        this._stream = stream
        this._streamOf = streamOf
        this._trigger = trigger
        this._sender = sender.to(trigger)
        this._transform = transform
    }
    public async get({
        transform = this._firstRead ? this._transform : SessionContext._transformPlaceholder,
        timeout = Infinity
    } = {}) {
        let resolved = false
        if (timeout <= Number.MAX_SAFE_INTEGER)
            setTimeout(() => {
                if (!resolved)
                    throw new Error('Time limit exceeded')
            }, timeout)
        let result: IExtensibleMessage
        await this.stream.get(async ctx => {
            result = await transform.transform(ctx)
            if (result) return true
            else return false
        })
        this._firstRead = resolved = true
        return result
    }
    public reply(...message: MessageContent) { return this.sender.send(...message) }
    public async question(quote: string, {
        transform = this._firstRead ? this._transform : SessionContext._transformPlaceholder,
        timeout = Infinity
    } = {}) {
        await this.reply(quote)
        return this.get({ transform, timeout })
    }
    /** Forward to other sessions */
    public forward(...message: MessageContent) {
        const ctx = ObjectFrom({}, this._trigger)
        ctx.message = Util.arrayToString(message)
        return run(ctx)
    }
    /** Get a session of another user */
    public sessionOf(nextCtx: IExtensibleMessage) {
        nextCtx = ObjectFrom(this._trigger, nextCtx)
        const stream = this._streamOf(nextCtx)
        return new SessionContext({
            stream,
            streamOf: this._streamOf,
            trigger: nextCtx,
            sender: this._sender,
            transform: SessionContext._transformPlaceholder,
        })
    }
}