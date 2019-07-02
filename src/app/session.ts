import { SingleSessionManager, ConcurrentSessionManager, MessageStream, IStreamGetter } from '../core/session'
import { contextTypeOf, unionIdOf, IMessage } from '../platform/receiver'
import { IExtensibleMessage } from '../definition'
import { SessionContext } from '../context'
import { ITransform } from '../transform'
import { sender } from './sender'
import * as ObjectFrom from 'deepmerge'

export let sessionCount = 0

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

/**
 * Use a session template
 * @param when when to start the session
 * @param params Another info of the session template
 */
export function use(transform: ITransform, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: SessionContext) => void) {
        const manager = managers.get(identifier)
        if (manager) {
            async function wrapper(stream: MessageStream<IExtensibleMessage>, streamOf: IStreamGetter<IExtensibleMessage>, trigger: IExtensibleMessage) {
                try {
                    sessionCount++
                    await session(new SessionContext({
                        stream,
                        streamOf,
                        trigger,
                        sender,
                        transform,
                    }))
                }
                catch (err) {
                    console.error('[ERROR] An uncaught error is thrown by your session code:')
                    console.error(err)
                } finally { sessionCount-- }
            }
            if (concurrent) manager.concurrent = manager.concurrent.use(wrapper, async ctx => await transform.transform(ObjectFrom({ $validation: true }, ctx)) ? true : false)
            else manager.single = manager.single.use(wrapper, async ctx => await transform.transform(ObjectFrom({ $validation: true }, ctx)) ? true : false, override)
            console.log(`[INFO] ${manager[concurrent ? 'concurrent' : 'single'].length} Session templates loaded on session manager '${identifier}'`)
        } else throw new Error(`Session manager '${identifier}' does not exist`)
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
