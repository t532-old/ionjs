import { IExtensibleMessage } from './definition'
import { MessageStream, IStreamGetter } from './core/session'
import { ICQCodeArray } from './platform/cqcode'
import { toText } from './platform/cqcode/util'
import { run } from './app/session'
import { Sender } from './platform/sender'
import { ITransform, PlainTransform } from './transform'
import * as ObjectFrom from 'deepmerge'
import { waitMilliseconds } from './util/general'

declare module './definition' {
    interface IExtensibleMessage {
        $session(): SessionContext
    }
}

export class SessionContext {
    private static readonly _transformPlaceholder = new PlainTransform()
    public get stream() { return this._stream }
    public get sender() { return this._sender }
    private readonly _stream: MessageStream<IExtensibleMessage>
    private readonly _streamOf: IStreamGetter<IExtensibleMessage>
    private readonly _trigger: IExtensibleMessage
    private readonly _sender: Sender
    private _firstRead = true
    private readonly _transform: ITransform
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
        timeout = Infinity,
        attempt = Infinity,
    } = {}) {
        const thisRef = this
        async function waitForTimeout(): Promise<never> {
            await waitMilliseconds(timeout)
            throw new Error('Time limit exceeded')
        }
        async function getResult() {
            let curAttempt = 0
            let result: IExtensibleMessage
            await thisRef.stream.get(async ctx => {
                ctx.$session = () => thisRef
                result = await transform.transform(ctx)
                if (result) return true
                else {
                    curAttempt++
                    if (curAttempt >= attempt) return true
                    else return false
                }
            })
            if (curAttempt >= attempt) throw new Error('Attempt limit exceeded')
            thisRef._firstRead = false
            return result
        }
        if (timeout <= Number.MAX_SAFE_INTEGER) {
            return Promise.race([
                getResult(),
                waitForTimeout(),
            ])
        } else return getResult()
    }
    public reply(message: ICQCodeArray) { return this.sender.send(message) }
    public async question(message: ICQCodeArray, config: {
        transform?: ITransform
        timeout?: number
        attempt?: number
    } = {}) {
        await this.reply(message)
        return this.get(config)
    }
    /** Forward to other sessions */
    public forward(message: ICQCodeArray) {
        const ctx = ObjectFrom({}, this._trigger)
        ctx.message = toText(message)
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
