import { IExtensibleMessage } from './definition'
import { MessageStream, IStreamGetter } from './core/session'
import { ICQCodeArray } from './platform/cqcode'
import { toText } from './platform/cqcode/util'
import { run } from './app/session'
import { Sender } from './platform/sender'
import { ITransform, PlainTransform } from './transform'
import merge from 'deepmerge'
import { waitMilliseconds } from './util/general'

declare module './definition' {
    interface IExtensibleMessage {
        /* Represents the session of this message. For internal use only */
        $session(): SessionContext
    }
}

/** Represents the context in a session */
export class SessionContext {
    private static readonly _transformPlaceholder = new PlainTransform()
    /** The raw MessageStream of current session */
    public get stream() { return this._stream }
    /** The sender of current session, bound to the trigger object */
    public get sender() { return this._sender }
    private readonly _stream: MessageStream<IExtensibleMessage>
    private readonly _streamOf: IStreamGetter<IExtensibleMessage>
    private readonly _trigger: IExtensibleMessage
    private readonly _sender: Sender
    private _firstRead = true
    private readonly _transform: ITransform
    public constructor({ stream, streamOf, trigger, sender, transform }: {
        /** The MessageStream of the session */
        stream: MessageStream<IExtensibleMessage>
        /** The streamOf function passed to the session */
        streamOf: IStreamGetter<IExtensibleMessage>
        /** The trigger object passed to the session */
        trigger: IExtensibleMessage
        /** The sender object, bound to the trigger object */
        sender: Sender
        /** The initial transform object passed to useSession */
        transform: ITransform
    }) {
        this._stream = stream
        this._streamOf = streamOf
        this._trigger = trigger
        this._sender = sender.to(trigger)
        this._transform = transform
    }
    /** Get a message from the target */
    public async get({
        /** Message will be transformed with this. Also, if the message is transformed to null, it will be regarded as illegal and ignored */
        transform = this._firstRead ? this._transform : SessionContext._transformPlaceholder,
        /** If no legal message is received in this time, it will lead to an error */
        timeout = Infinity,
        /** If the first n [n = attempt] messages are illegal, it will lead to an error */
        attempt = Infinity,
    } = {}) {
        const waitForTimeout: () => Promise<never> = async () => {
            await waitMilliseconds(timeout)
            throw new Error('Time limit exceeded')
        }
        const getResult = async () => {
            let curAttempt = 0
            let result: IExtensibleMessage
            await this.stream.get(async ctx => {
                ctx.$session = () => this
                result = await transform.transform(ctx)
                if (result) return true
                else {
                    curAttempt++
                    if (curAttempt >= attempt) return true
                    else return false
                }
            })
            if (curAttempt >= attempt) throw new Error('Attempt limit exceeded')
            this._firstRead = false
            return result
        }
        if (timeout <= Number.MAX_SAFE_INTEGER) {
            return Promise.race([
                getResult(),
                waitForTimeout(),
            ])
        } else return getResult()
    }
    /** Reply a message with the sender bound to the trigger object */
    public reply(message: ICQCodeArray | string) { return this.sender.send(message) }
    /**
     * Send a message and get the user's reply
     * @param config The same as SessionContext.get(config)
     */
    public async question(message: ICQCodeArray | string, config: {
        transform?: ITransform
        timeout?: number
        attempt?: number
    } = {}) {
        await this.reply(message)
        return this.get(config)
    }
    /** Forward to other sessions */
    public forward(message: ICQCodeArray | string) {
        const ctx = merge({}, this._trigger)
        ctx.message = toText(message)
        return run(ctx)
    }
    /** Get a session of another user */
    public sessionOf(nextCtx: IExtensibleMessage) {
        nextCtx = merge(this._trigger, nextCtx)
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
