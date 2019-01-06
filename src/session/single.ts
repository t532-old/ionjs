import { SessionStore } from './base'
import { MessageStream } from './stream'
import { TSessionFn, TSessionMatcher } from './definition'
import Debug from 'debug'
const debug = Debug('ionjs:session'),
      debugVerbose = Debug('verbose-ionjs:session'),
      debugExVerbose = Debug('ex-verbose-ionjs:session')

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
    async run(ctx: any) {
        debugVerbose('start %o', ctx)
        const msgId = await this._identifier(ctx)
        const getter = () => this._streams.get(msgId),
              setter = () => this._streams.set(msgId, new MessageStream(deleter.bind(this))),
              deleter = () => this._streams.delete(msgId)
        let finalBehavior
        for (const template of this._templates)
            if (await template.match(ctx) && (!getter() || template.override))
                finalBehavior = template
        if (finalBehavior) {
            debugExVerbose('next (new)')
            if (getter()) getter().free()
            setter()
            getter().write(ctx)
            finalBehavior.session(getter()).then(deleter.bind(this))
        } else if (getter()) {
            debugExVerbose('next (exist)')
            if (!getter().write(ctx)) 
                getter().once('drain', () => getter().write(ctx))
        }
        debugVerbose('finish')
    }
}
