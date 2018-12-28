import { SessionManager } from './base'
import { MessageStream } from './stream'
import { IBehavior } from './behavior'
import Debug from 'debug'
const debug = {
    constructor: Debug('ionjs: Multi: constructor'),
    streamDeleter: Debug('verbose-ionjs: Multi: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: Multi: streamGetter'),
    streamSetter: Debug('verbose-ionjs: Multi: streamSetter'),
    push: Debug('verbose-ionjs: Multi: push'),
}
/** A session manager that allows multi processes */
export class ConcurrentSessionManager extends SessionManager {
    /** Stores streams of active sessions */
    private readonly _streams: Map<symbol, Map<any, MessageStream>> = new Map()
    /**
     * set an empty Stream Map and the symbol when new behavior is added
     * @param behavior the behavior
     */
    _onAddBehavior(behavior: IBehavior) {
        behavior.symbol = Symbol()
        this._streams.set(behavior.symbol, new Map())
    }
    /**
     * Delete the Stream Map when a behavior is deleted
     * @param behavior the behavior
     */
    _onRemoveBehavior(behavior: IBehavior) { this._streams.delete(behavior.symbol) }
    /**
     * Pass a context to every active session that matches the session id
     * Or create sessions if the context matches the conditions of them
     * @param ctx the context
     */
    push(ctx: any) {
        for (const behavior of this._behaviors) {
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