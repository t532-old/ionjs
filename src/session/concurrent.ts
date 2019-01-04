import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TSessionMatcher } from './definition'
import Debug from 'debug'
const debug = Debug('ionjs:session'),
      debugVerbose = Debug('verbose-ionjs:session'),
      debugExVerbose = Debug('ex-verbose-ionjs:session')

/** A session manager that allows multi processes */
export class ConcurrentSessionManager extends SessionStore {
    /** Stores streams of active sessions */
    private readonly _streams: Map<symbol, Map<any, MessageStream>> = new Map()
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     */
    use(session: TSessionFn, match: TSessionMatcher) {
        const symbol = Symbol()
        this._streams.set(symbol, new Map())
        this._templates.push({ session, match, symbol })
        debug('use (+%d)', this._templates.length)
        return this
    }
    /**
     * Pass a context to every active session that matches the session id
     * Or create sessions if the context matches the conditions of them
     * @param ctx the context
     */
    async run(ctx: any) {
        debugVerbose('start %o', ctx)
        for (const template of this._templates) {
            const templateSymbol = template.symbol,
                  msgId = await this._identifier(ctx)
                  const getter = () => this._streams.get(templateSymbol).get(msgId),
                        setter = () => this._streams.get(templateSymbol).set(msgId, new MessageStream(deleter.bind(this))),
                        deleter = () => this._streams.get(templateSymbol).delete(msgId)
            if (getter() && getter().writable) {
                debugExVerbose('next (new)')
                if (!getter().write(ctx)) 
                    getter().once('drain', () => getter().write(ctx))
            } else if (await template.match(ctx)) {
                debugExVerbose('next (exist)')
                setter()
                getter().write(ctx)
                template.session(getter()).then(deleter)
            }
        }
        debugVerbose('finish')
    }
}