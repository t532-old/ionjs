import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TSessionMatcher } from './definition'
import Debug from 'debug'
const debug = {
    use: Debug('ionjs: ConcurrentSessionManager: use'),
    streamDeleter: Debug('verbose-ionjs: SingleSessionManager: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: SingleSessionManager: streamGetter'),
    streamSetter: Debug('verbose-ionjs: SingleSessionManager: streamSetter'),
    run: Debug('verbose-ionjs: SingleSessionManager: run'),
}
/** A session manager that is single-process for each user */
export class SingleSessionManager extends SessionStore {
    /** Stores streams of active sessions */
    private readonly _streams: Map<any, MessageStream> = new Map()
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     * @param override determines when the condition is matched,
     *                 whether to force end the previous session (true) 
     *                 or ignore this context (false or not determined) 
     */
    use(session: TSessionFn, match: TSessionMatcher, override: boolean = false) {
        debug.use('added new template')
        this._templates.push({ session, match, override })
        return this
    }
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override templates will take over even when there's a session running
     * @param ctx the context
     */
    async run(ctx: any) {
        const msgId = await this._identifier(ctx)
        const getter = () => {
            debug.streamGetter(`get stream: ${msgId}`)
            return this._streams.get(msgId)
        },    setter = () => {
            debug.streamSetter(`set stream: ${msgId}`)
            return this._streams.set(msgId, new MessageStream(deleter.bind(this)))
        },    deleter = () => {
            debug.streamDeleter(`delete stream: ${msgId}`)
            return this._streams.delete(msgId)
        }
        let finalBehavior
        for (const template of this._templates)
            if (await template.match(ctx) && (!getter() || template.override))
                finalBehavior = template
        if (finalBehavior) {
            debug.run('create new stream for message: %o', ctx)
            setter()
            getter().write(ctx)
            finalBehavior.session(getter()).then(() => getter().free())
        } else if (getter()) {
            debug.run('push message to an existing stream: %o', ctx)
            if (!getter().write(ctx)) 
                getter().once('drain', () => getter().write(ctx))
        }
    }
}
