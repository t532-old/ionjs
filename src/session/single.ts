import { SessionManager } from './base'
import { MessageStream } from './stream'
import Debug from 'debug'
const debug = {
    constructor: Debug('ionjs: Single: constructor'),
    streamDeleter: Debug('verbose-ionjs: Single: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: Single: streamGetter'),
    streamSetter: Debug('verbose-ionjs: Single: streamSetter'),
    push: Debug('verbose-ionjs: Single: push'),
}
/** A session manager that is single-process for each user */
export class SingleSessionManager extends SessionManager {
    /** Stores streams of active sessions */
    private readonly streams: Map<any, MessageStream> = new Map()
    _onAddBehavior() {}
    _onRemoveBehavior() {}
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override behaviors will take over even when there's a session running
     * @param ctx the context
     */
    push(ctx: any) {
        const msgId = this._identifier(ctx)
        const getter = () => {
            debug.streamGetter(`get stream: ${msgId}`)
            return this.streams.get(msgId)
        },    setter = () => {
            debug.streamSetter(`set stream: ${msgId}`)
            return this.streams.set(msgId, new MessageStream(deleter.bind(this)))
        },    deleter = () => {
            debug.streamDeleter(`delete stream: ${msgId}`)
            return this.streams.delete(msgId)
        }
        let finalBehavior
        for (const behavior of this._behaviors)
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
