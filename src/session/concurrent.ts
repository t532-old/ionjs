import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TMatcher } from './definition'
import Debug from 'debug'
const debug = {
    use: Debug('ionjs: ConcurrentSessionManager: use'),
    streamDeleter: Debug('verbose-ionjs: ConcurrentSessionManager: streamDeleter'),
    streamGetter: Debug('verbose-ionjs: ConcurrentSessionManager: streamGetter'),
    streamSetter: Debug('verbose-ionjs: ConcurrentSessionManager: streamSetter'),
    run: Debug('verbose-ionjs: ConcurrentSessionManager: run'),
}
/** A session manager that allows multi processes */
export class ConcurrentSessionManager extends SessionStore {
    /** Stores streams of active sessions */
    private readonly _streams: Map<symbol, Map<any, MessageStream>> = new Map()
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     */
    use(session: TSessionFn, match: TMatcher) {
        debug.use('added new template')
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
        for (const template of this._templates) {
            const templateSymbol = template.symbol,
                  msgId = this._identifier(ctx)
            const getter = () => {
                debug.streamGetter(`get stream: ${msgId}`)
                return this._streams.get(templateSymbol).get(msgId)
            },    setter = () => {
                debug.streamSetter(`set stream: ${msgId}`)
                return this._streams.get(templateSymbol).set(msgId, new MessageStream(deleter))
            },    deleter = () => {
                debug.streamDeleter(`delete stream: ${msgId}`)
                return this._streams.get(templateSymbol).delete(msgId)
            }
            if (getter() && getter().writable) {
                debug.run('run message to an existing stream: %o', ctx)
                if (!getter().write(ctx)) 
                    getter().once('drain', () => getter().write(ctx))
            } else if (template.match(ctx)) {
                debug.run('create new stream for message: %o', ctx)
                setter()
                getter().write(ctx)
                template.session(getter()).then(deleter)
            }
        }
    }
}