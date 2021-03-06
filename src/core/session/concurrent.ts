import { ISessionManager } from './base'
import { MessageStream } from './stream'
import { ISessionFn, ISessionMatcher, ISessionTemplate, ISessionIdentifier } from './definition'

export interface IConcurrentSessionTemplate<T> extends ISessionTemplate<T> {
    /**
     * (Only avaliable in class ConcurrentSessionManager)
     * A unique symbol of the session template
     */
    symbol: symbol
}

/** A session manager that allows multi processes */
export class ConcurrentSessionManager<T = any> implements ISessionManager<T> {
    /** Stores streams of active sessions */
    private readonly _streams: Map<symbol, Map<any, MessageStream<T>>> = new Map()
    /** Stores session templates */
    private _templates: IConcurrentSessionTemplate<T>[] = []
    /** The identifier generator */
    private readonly _identifier: ISessionIdentifier<T>
    public constructor(identifier: ISessionIdentifier<T>) { this._identifier = identifier }
    public static from<T>(last: ConcurrentSessionManager<T>) {
        const next = new ConcurrentSessionManager<T>(last.identifier)
        next._templates = Array.from(last._templates)
        for (const { symbol } of next._templates)
            next._streams.set(symbol, new Map())
        return next
    }
    public get length() { return this._templates.length }
    public get identifier() { return this._identifier }
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     */
    public use(session: ISessionFn<T>, match: ISessionMatcher<T>) {
        const next = ConcurrentSessionManager.from<T>(this)
        const symbol = Symbol()
        next._streams.set(symbol, new Map())
        next._templates.push({ session, match, symbol })
        return next
    }
    /**
     * Pass a context to every active session that matches the session id
     * Or create sessions if the context matches the conditions of them
     * @param ctx the context
     */
    public async run(ctx: T) {
        let template: IConcurrentSessionTemplate<T>
        for (template of this._templates) {
            const templateSymbol = template.symbol,
                  msgId = await this._identifier(ctx)
            const stream = this._operate(templateSymbol, msgId),
                  originalStream = stream.getter(),
                  streamOf = this._streamOf.bind(this, template.symbol)
            async function execute() {
                const streamObj = stream.getter(),
                    inUse = [streamObj]
                await template.session(streamObj, function (ctx) {
                    const streamObj = streamOf(ctx)
                    inUse.push(streamObj)
                    return streamObj
                }, ctx)
                for (const i of inUse) i.references--
            }
            if (originalStream && originalStream.writable) {
                if (!originalStream.write(ctx))
                    originalStream.once('drain', () => originalStream.write(ctx))
            } else if (await template.match(ctx)) {
                stream.setter()
                stream.getter().write(ctx)
                execute()
            }
        }
    }
    /**
     * Get a set of operations on a particular MessageStream
     * @param symbol the symbol of the session template
     * @param identifier the identifier of the stream
     */
    private _operate(symbol: symbol, identifier: any) {
        const getter = () => this._streams.get(symbol).get(identifier),
              exists = () => this._streams.get(symbol).has(identifier),
              setter = () => this._streams.get(symbol).set(identifier, new MessageStream<T>(deleter.bind(this))),
              deleter = () => this._streams.get(symbol).delete(identifier)
        return { getter, setter, deleter, exists }
    }
    /**
     * Get a stream from a session template and a context (wraps this._operate())
     * @param symbol the symbol of the session template
     * @param ctx the context
     */
    private _streamOf(symbol: symbol, ctx: T) {
        const stream = this._operate(symbol, this._identifier(ctx))
        if (!stream.exists()) stream.setter()
        return stream.getter()
    }
}
