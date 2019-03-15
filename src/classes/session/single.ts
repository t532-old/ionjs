import { ISessionManager } from './base'
import { MessageStream } from './stream'
import { ISessionFn, ISessionMatcher, ISessionTemplate, ISessionIdentifier } from './definitions'
import Debug from 'debug'
const debug = Debug('ionjs:session'),
      debugVerbose = Debug('verbose-ionjs:session'),
      debugExVerbose = Debug('ex-verbose-ionjs:session')

export interface ISingleSessionTemplate<T> extends ISessionTemplate<T> {
    /**
     * (Only avaliable in class SingleSessionManager)
     * determines when the condition is matched,
     * whether to force end the previous session (true)
     * or ignore this context (false or not determined)
     */
    override?: boolean
}

/** A session manager that is single-process for each user */
export class SingleSessionManager<T = any> implements ISessionManager<T> {
    /** Stores streams of active sessions */
    private readonly _streams: Map<any, MessageStream<T>> = new Map()
    /** Stores session templates */
    private readonly _templates: ISingleSessionTemplate<T>[] = []
    /** The identifier generator */
    private readonly _identifier: ISessionIdentifier<T>
    get length() { return this._templates.length }
    get identifier() { return this._identifier }
    constructor(identifier: ISessionIdentifier<T>) {
        this._identifier = identifier
    }
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     * @param override determines when the condition is matched,
     *                 whether to force end the previous session (true)
     *                 or ignore this context (false or not determined)
     */
    use(session: ISessionFn<T>, match: ISessionMatcher<T>, override: boolean = false) {
        this._templates.push({ session, match, override })
        debug('use (+%d)', this._templates.length)
        return this
    }
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override templates will take over even when there's a session running
     * @param ctx the context
     */
    async run(ctx: T) {
        debugVerbose('start %o', ctx)
        const msgId = await this._identifier(ctx)
        let finalBehavior: ISingleSessionTemplate<T>
        const getter = () => this._streams.get(msgId),
              setter = () => this._streams.set(msgId, new MessageStream<T>(deleter.bind(this))),
              deleter = () => this._streams.delete(msgId),
              execute = async () => {
                const stream = getter()
                await finalBehavior.session(stream)
                stream.free()
              }
        for (const template of this._templates)
            if (await template.match(ctx) && (!getter() || template.override))
                finalBehavior = template
        if (finalBehavior) {
            debugExVerbose('next (new)')
            if (getter()) getter().free()
            setter()
            getter().write(ctx)
            execute()
        } else if (getter()) {
            debugExVerbose('next (exist)')
            if (!getter().write(ctx))
                getter().once('drain', () => getter().write(ctx))
        }
        debugVerbose('finish')
    }
}
