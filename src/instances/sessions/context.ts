import { IExtensibleMessage } from '../definitions'
import { MessageStream, IStreamGetter } from '../../classes/session'
import { IBotWhenParseResult } from '../../classes/when'
import { ICQCode, Utils } from '../../classes/cqcode'
import { sender } from '../sender'
import { run } from './sessions'

export class SessionContext {
    static deepCopy(obj: { [x: string]: any }): { [x: string]: any } {
        const newObj = {}
        for (const i in obj) {
            if (typeof obj[i] === 'object' && obj[i] && obj[i] !== obj) newObj[i] = SessionContext.deepCopy(obj[i])
            else newObj[i] = obj[i]
        }
        return newObj
    }
    /** Stream of messages */
    stream: MessageStream<IExtensibleMessage>
    streamOf: IStreamGetter<IExtensibleMessage>
    /** Sender bound to the first context */
    sender: ReturnType<typeof sender>
    /** The first context (parsed) */
    init: IBotWhenParseResult
    private _initialTimeout: number
    private _timeout: NodeJS.Timeout
    private _rawInit: IExtensibleMessage
    constructor({ stream, streamOf, rawInit, init, timeout }: {
        stream: SessionContext['stream'], 
        streamOf: SessionContext['streamOf'], 
        rawInit: IExtensibleMessage, 
        init: SessionContext['init'],
        timeout: number
    }) {
        this.stream = stream
        this.streamOf = streamOf
        this.sender = sender().to(rawInit)
        this._rawInit = rawInit
        this.init = SessionContext.deepCopy(init || {})
        this._initialTimeout = timeout
        if (timeout <= Number.MAX_SAFE_INTEGER) this._timeout = setTimeout(() => stream.free(), timeout)
        for (const i of ['get', 'reply', 'question', 'forward', 'sessionOf']) this[i] = this[i].bind(this)
    }
    /** Get a copy of the next message from this.stream */
    async get(condition: (ctx: IExtensibleMessage) => boolean = () => true) { return SessionContext.deepCopy(await this.stream.get(condition)) as IExtensibleMessage }
    /** Reply to the user */
    reply(...message: (string|ICQCode)[]) { return this.sender.send(...message) }
    /** Question the user and get an answer */
    async question(...prompt: (string|ICQCode)[]) {
        await this.reply(...prompt)
        return this.get()
    }
    /** Forward to other sessions */
    async forward(...message: (string|ICQCode)[]) {
        const ctx = SessionContext.deepCopy(this._rawInit)
        ctx.message = Utils.arrayToString(message.map(i => typeof i === 'string' ? { type: 'text', data: { text: i } } : i))
        return run(ctx)
    }
    /** Get a session of another user */
    async sessionOf(nextCtx: IExtensibleMessage, timeout = this._initialTimeout) {
        const stream = this.streamOf(nextCtx)
        return new SessionContext({
            stream, 
            streamOf: this.streamOf, 
            rawInit: nextCtx, 
            init: null, 
            timeout: timeout,
        })
    }
    /** Reset the stream deletion timeout */
    set timeout(timeout: number) {
        clearTimeout(this._timeout)
        if (timeout <= Number.MAX_SAFE_INTEGER) this._timeout = setTimeout(() => this.stream.free(), timeout)
    }
}