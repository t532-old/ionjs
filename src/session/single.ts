import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TMatcher } from './definition'
import Debug from 'debug'
const debug = {
    addBehavior: Debug('ionjs: ConcurrentSessionManager: addBehavior'),
    streamDeleter: Debug('verbose-ionjs: SingleSessionManager: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: SingleSessionManager: streamGetter'),
    streamSetter: Debug('verbose-ionjs: SingleSessionManager: streamSetter'),
    push: Debug('verbose-ionjs: SingleSessionManager: push'),
}
/** A session manager that is single-process for each user */
export class SingleSessionManager extends SessionStore {
    /** Stores streams of active sessions */
    private readonly _streams: Map<any, MessageStream> = new Map()
    /**
     * set an empty Stream Map and the symbol when new behavior is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     * @param override determines when the condition is matched,
     *                 whether to force end the previous session (true) 
     *                 or ignore this context (false or not determined) 
     */
    use(session: TSessionFn, match: TMatcher, override: boolean = false) {
        debug.addBehavior('added new behavior')
        this._templates.push({ session, match, override })
        return this
    }
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override behaviors will take over even when there's a session running
     * @param ctx the context
     */
    run(ctx: any) {
        const msgId = this._identifier(ctx)
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
        for (const behavior of this._templates)
            if (behavior.match(ctx) && (!getter() || behavior.override))
                finalBehavior = behavior
        if (finalBehavior) {
            debug.push('create new stream for message: %o', ctx)
            setter()
            getter().write(ctx)
            finalBehavior.session(getter()).then(() => getter().free())
        } else if (getter()) {
            debug.push('push message to an existing stream: %o', ctx)
            if (!getter().write(ctx)) 
                getter().once('drain', () => getter().write(ctx))
        }
    }
}
