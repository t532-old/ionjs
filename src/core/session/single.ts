import { ISessionManager, SessionManagerError } from './base'
import { MessageStream } from './stream'
import { ISessionFn, ISessionMatcher, ISessionTemplate, ISessionIdentifier } from './definition'

export interface ISingleSessionTemplate<T> extends ISessionTemplate<T> {
    /**
     * (Only avaliable in class SingleSessionManager)
     * determines when the condition is matched,
     * whether to force end the previous session (true)
     * or ignore this context (false or not determined)
     */
    override: boolean
}

/** A session manager that is single-process for each user */
export class SingleSessionManager<T = any> implements ISessionManager<T> {
    /** Stores streams of active sessions */
    private readonly _streams: Map<any, MessageStream<T>[]> = new Map()
    /** Stores session templates */
    private _templates: ISingleSessionTemplate<T>[] = []
    /** The identifier generator */
    private readonly _identifier: ISessionIdentifier<T>
    public constructor(identifier: ISessionIdentifier<T>) { this._identifier = identifier }
    public static from<T>(last: SingleSessionManager<T>) {
        const next = new SingleSessionManager<T>(last.identifier)
        next._templates = Array.from(last._templates)
        return next
    }
    public get length() { return this._templates.length }
    public get identifier() { return this._identifier }
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     * @param override determines when the condition is matched,
     *                 whether to force end the previous session (true)
     *                 or ignore this context (false or not determined)
     */
    public use(session: ISessionFn<T>, match: ISessionMatcher<T>, override: boolean = false) {
        const next = SingleSessionManager.from<T>(this)
        next._templates.push({ session, match, override })
        return next
    }
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override templates will take over even when there's a session running
     * @param ctx the context
     */
    public async run(ctx: T) {
        const msgId = await this._identifier(ctx)
        let finalBehavior: ISingleSessionTemplate<T>
        const stream = this._operate(msgId),
              originalStream = stream.getter(),
              generateStreamOf = () => this._streamOf.bind(this, finalBehavior.override)
        async function execute() {
            const streamObj = stream.getter(),
                streamOf = generateStreamOf(),
                inUse = [streamObj]
            await finalBehavior.session(streamObj, function (ctx) {
                const streamObj = streamOf(ctx)
                inUse.push(streamObj)
                return streamObj
            }, ctx)
            for (const i of inUse) i.references--
        }
        for (const template of this._templates)
            if (await template.match(ctx) && (!originalStream || template.override))
                finalBehavior = template
        if (finalBehavior) {
            stream.setter()
            stream.getter().write(ctx)
            execute()
        } else if (originalStream) {
            if (!originalStream.write(ctx))
                originalStream.once('drain', () => originalStream.write(ctx))
        }
    }
    /**
     * Get a set of operations on a particular MessageStream
     * @param symbol the symbol of the session template
     * @param identifier the identifier of the stream
     */
    private _operate(identifier: any) {
        const thisRef = this
        const getter = () => {
                  const stack = thisRef._streams.get(identifier)
                  if (stack) return stack[0]
              },
              exists = () => thisRef._streams.has(identifier),
              setter = () => {
                  const stack = thisRef._streams.get(identifier)
                  if (stack) stack.unshift(new MessageStream<T>(deleter.bind(this)))
                  else thisRef._streams.set(identifier, [new MessageStream<T>(deleter.bind(this))])
              },
              deleter = () => {
                  const arr = thisRef._streams.get(identifier)
                  arr.shift()
                  if (!arr.length) return thisRef._streams.delete(identifier)
                  else return true
              }
        return { getter, setter, deleter, exists }
    }
    /**
     * Get a stream from a context (wraps this._operate())
     * @param override whether to override or not
     * @param ctx the context
     */
    private _streamOf(override: boolean, ctx: T) {
        const stream = this._operate(this._identifier(ctx)),
              streamObj = stream.getter()
        if (!streamObj) stream.setter()
        if (override || !streamObj) return stream.getter()
        else throw new SessionManagerError('stream is currently locked by another session')
    }
}
