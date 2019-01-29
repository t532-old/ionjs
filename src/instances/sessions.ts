import { SingleSessionManager, ConcurrentSessionManager, MessageStream } from '../classes/session'
import { contextTypeOf, unionIdOf, IMessage } from '../classes/receiver'
import { ICQCode, Utils } from '../classes/cqcode'
import { When } from '../classes/when'
import { sender } from './sender'
import { TExtensibleMessage, ISessionContext } from './definitions'

export type TExtensibleMessage = IMessage&{ [x: string]: any }

function defaultIdentifier(ctx) {
    const contextType = contextTypeOf(ctx)
    return `${ctx.user_id}${contextType[contextType.length - 1]}${unionIdOf(ctx)}`
}
function groupIdentifier(ctx) { return `${ctx.group_id || ctx.discuss_id}` }
function userIdentifier(ctx) { return `${ctx.user_id}` }
const managers: { [x: string]: { single: SingleSessionManager<TExtensibleMessage>, concurrent: ConcurrentSessionManager<TExtensibleMessage> } } = {
    default: { single: new SingleSessionManager<TExtensibleMessage>(defaultIdentifier), concurrent: new ConcurrentSessionManager<TExtensibleMessage>(defaultIdentifier) },
    group: { single: new SingleSessionManager<TExtensibleMessage>(groupIdentifier), concurrent: new ConcurrentSessionManager<TExtensibleMessage>(groupIdentifier) },
    user: { single: new SingleSessionManager<TExtensibleMessage>(userIdentifier), concurrent: new ConcurrentSessionManager<TExtensibleMessage>(userIdentifier) },
}

let timeout: number

function deepCopy(obj: { [x: string]: any }): { [x: string]: any } {
    const newObj = {}
    for (const i in obj) {
        if (typeof obj[i] === 'object' && obj[i] && obj[i] !== obj) newObj[i] = deepCopy(obj[i])
        else newObj[i] = obj[i]
    }
    return newObj
}

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
export function use(when: When, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: ISessionContext) => void) {
        const manager = concurrent ? managers[identifier].concurrent : managers[identifier].single
        async function wrapper(stream: MessageStream<TExtensibleMessage>) {
            async function get(condition: (ctx: TExtensibleMessage) => boolean = () => true) { return deepCopy(await stream.get(condition)) as TExtensibleMessage }
            let raw: TExtensibleMessage, init: ISessionContext['init']
            try { raw = await get() }
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
            const boundSender = sender.to(raw)
            function reply(...message: (string|ICQCode)[]) { return boundSender.send(...message) }
            async function question(...prompt: (string|ICQCode)[]) {
                await reply(...prompt)
                return get()
            }
            function forward(...message: (string|ICQCode)[]) {
                const ctx = deepCopy(raw)
                ctx.message = Utils.arrayToString(message.map(i => typeof i === 'string' ? { type: 'text', data: { text: i } } : i))
                return run(ctx)
            }
            let sessionTimeout = setTimeout(() => stream.free(), timeout)
            try {
                await session({
                    init,
                    sender: boundSender,
                    stream,
                    get,
                    reply,
                    question,
                    forward,
                    set timeout(timeout: number) {
                        clearTimeout(sessionTimeout)
                        sessionTimeout = setTimeout(() => stream.free(), timeout)
                    }
                })
            }
            catch (err) {
                console.error('[ERROR] An uncaught error is thrown by your session code:')
                console.error(err)
            }
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
    managers[name] = {
        single: new SingleSessionManager<TExtensibleMessage>(identifier),
        concurrent: new ConcurrentSessionManager<TExtensibleMessage>(identifier),
    }
}

/**
 * Pass a context through the sessions
 * @param ctx the context
 */
export async function run(ctx: TExtensibleMessage) {
    const promises: Promise<void>[] = []
    for (const i in managers) {
        promises.push(managers[i].single.run(ctx))
        promises.push(managers[i].concurrent.run(ctx))
    }
    try { await Promise.all(promises) }
    catch (err) {
        console.error('[ERROR] An unknown error occured when running sessions.')
        console.error(err)
    }
}
