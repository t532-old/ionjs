import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TMatcher } from './definition'
import Debug from 'debug'
const debug = {
    addBehavior: Debug('ionjs: ConcurrentSessionManager: addBehavior'),
    streamDeleter: Debug('verbose-ionjs: ConcurrentSessionManager: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: ConcurrentSessionManager: streamGetter'),
    streamSetter: Debug('verbose-ionjs: ConcurrentSessionManager: streamSetter'),
    push: Debug('verbose-ionjs: ConcurrentSessionManager: push'),
}
/** A session manager that allows multi processes */
export class ConcurrentSessionManager extends SessionStore {
    /** Stores streams of active sessions */
    private readonly _streams: Map<symbol, Map<any, MessageStream>> = new Map()
    /**
     * set an empty Stream Map and the symbol when new behavior is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     */
    use(session: TSessionFn, match: TMatcher) {
        debug.addBehavior('added new behavior')
        const symbol = Symbol()
        this._streams.set(symbol, new Map())
        this._templates.push({ session, match, symbol })
        return this
    }
    /**
     * Pass a context to every active session that matches the session id
     * Or create sessions if the context matches the conditions of them
     * @param ctx the context
     */
    run(ctx: any) {
        for (const behavior of this._templates) {
            const behaviorSymbol = behavior.symbol,
                  msgId = this._identifier(ctx)
            const getter = () => {
                debug.streamGetter(`get stream: ${msgId}`)
                return this._streams.get(behaviorSymbol).get(msgId)
            },    setter = () => {
                debug.streamSetter(`set stream: ${msgId}`)
                return this._streams.get(behaviorSymbol).set(msgId, new MessageStream(deleter))
            },    deleter = () => {
                debug.streamDeleter(`delete stream: ${msgId}`)
                return this._streams.get(behaviorSymbol).delete(msgId)
            }
            if (getter() && getter().writable) {
                debug.push('push message to an existing stream: %o', ctx)
                if (!getter().write(ctx)) 
                    getter().once('drain', () => getter().write(ctx))
            } else if (behavior.match(ctx)) {
                debug.push('create new stream for message: %o', ctx)
                setter()
                getter().write(ctx)
                behavior.session(getter()).then(deleter)
            }
        }
    }
}