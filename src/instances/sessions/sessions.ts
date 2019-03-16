import { SingleSessionManager, ConcurrentSessionManager, MessageStream, IStreamGetter } from '../../classes/session'
import { contextTypeOf, unionIdOf, IMessage } from '../../classes/receiver'
import { IWhen, IBotWhenParseResult } from '../../classes/when'
import { IExtensibleMessage } from '../definitions'
import { SessionContext } from './context'

let _sessionCount = 0
export function sessionCount() { return _sessionCount }

function defaultIdentifier(ctx: IExtensibleMessage) {
    const contextType = contextTypeOf(ctx)
    return `${ctx.user_id}${contextType[contextType.length - 1]}${unionIdOf(ctx)}`
}
function groupIdentifier(ctx: IExtensibleMessage) {
    const contextType = contextTypeOf(ctx)
    return `${contextType[contextType.length - 1]}${unionIdOf(ctx)}`
}
function userIdentifier(ctx: IExtensibleMessage) {
    const contextType = contextTypeOf(ctx)
    return `${contextType[contextType.length - 1]}${ctx.user_id}`
}
const managers: Map<string, { single: SingleSessionManager<IExtensibleMessage>, concurrent: ConcurrentSessionManager<IExtensibleMessage> }> = new Map()
    .set('default', { single: new SingleSessionManager<IExtensibleMessage>(defaultIdentifier), concurrent: new ConcurrentSessionManager<IExtensibleMessage>(defaultIdentifier) })
    .set('group', { single: new SingleSessionManager<IExtensibleMessage>(groupIdentifier), concurrent: new ConcurrentSessionManager<IExtensibleMessage>(groupIdentifier) })
    .set('user', { single: new SingleSessionManager<IExtensibleMessage>(userIdentifier), concurrent: new ConcurrentSessionManager<IExtensibleMessage>(userIdentifier) })

let timeout: number

/**
 * Initialize with default session timout
 * @param sessionTimeout the default session timeout
 */
export function init(sessionTimeout: number) { timeout = sessionTimeout }

/**
 * Use a session template
 * @param when when to start the session
 * @param params Another info of the session template
 */
export function use(when: IWhen, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: SessionContext) => void) {
        const manager = concurrent ? managers.get(identifier).concurrent : managers.get(identifier).single
        async function wrapper(stream: MessageStream<IExtensibleMessage>, streamOf: IStreamGetter<IExtensibleMessage>) {
            let raw: IExtensibleMessage,
                init: IBotWhenParseResult
            try { raw = await stream.get() }
            catch (err) {
                console.warn('[WARN] Failed when trying to get initial message:')
                console.warn(err)
                return
            }
            try { init = await when.parse(raw, stream) }
            catch (err) {
                console.error('[ERROR] Error when parsing initial message:')
                console.error(err)
                return
            }
            try {
                _sessionCount++
                await session(new SessionContext({
                    stream,
                    streamOf,
                    rawInit: raw,
                    init,
                    timeout,
                }))
            }
            catch (err) {
                console.error('[ERROR] An uncaught error is thrown by your session code:')
                console.error(err)
            } finally { _sessionCount-- }
        }
        if (manager instanceof SingleSessionManager) manager.use(wrapper, ctx => when.validate(ctx), override)
        else if (manager instanceof ConcurrentSessionManager) manager.use(wrapper, ctx => when.validate(ctx))
        else throw new Error(`Session manager '${identifier}' does not exist`)
        console.log(`[INFO] ${manager.length} Session templates loaded on session manager '${identifier}'`)
    }
}

/**
 * Create a new session manager
 * @param name the session manager's name
 * @param identifier the session manager's identifier
 */
export function create(name: string, identifier: (ctx: IMessage) => any) {
    managers.set(name, {
        single: new SingleSessionManager<IExtensibleMessage>(identifier),
        concurrent: new ConcurrentSessionManager<IExtensibleMessage>(identifier),
    })
}

/**
 * Pass a context through the sessions
 * @param ctx the context
 */
export async function run(ctx: IExtensibleMessage) {
    const promises: Promise<void>[] = []
    for (const [, val] of managers) {
        promises.push(val.single.run(ctx))
        promises.push(val.concurrent.run(ctx))
    }
    try { await Promise.all(promises) }
    catch (err) {
        console.error('[ERROR] An unknown error occured when running sessions.')
        console.error(err)
    }
}
