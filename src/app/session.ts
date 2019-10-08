import { SingleSessionManager, ConcurrentSessionManager, MessageStream, IStreamGetter } from '../core/session'
import { contextTypeOf, unionIdOf, IMessage } from '../platform/receiver'
import { IExtensibleMessage } from '../definition'
import { SessionContext } from '../context'
import { ITransform } from '../transform'
import { sender } from './sender'
import { allOf } from '../transform/util'
import merge from 'deepmerge'
import Signale from 'signale'
const logger = Signale.scope('session')

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
create('default', defaultIdentifier)
create('group', groupIdentifier)
create('user', userIdentifier)

/**
 * Use a session template
 * @param when when to start the session
 * @param params Another info of the session template
 */
export function use(...transforms: ITransform[]) {
    const transform = allOf(...transforms)
    return function useHandler(session: (ctx: SessionContext) => void, { override = false, identifier = 'default', concurrent = false } = {}) {
        const manager = managers.get(identifier)
        if (manager) {
            async function wrapper(stream: MessageStream<IExtensibleMessage>, streamOf: IStreamGetter<IExtensibleMessage>, trigger: IExtensibleMessage) {
                try {
                    sessionCount++
                    logger.pending(`${sessionCount} sessions running`)
                    await session(new SessionContext({
                        stream,
                        streamOf,
                        trigger,
                        sender,
                        transform,
                    }))
                }
                catch (err) { logger.error('An uncaught error was thrown by your session code:\n', err) }
                finally {
                    sessionCount--
                    logger.complete(`${sessionCount} sessions running`)
                }
            }
            if (concurrent) manager.concurrent = manager.concurrent.use(wrapper, async ctx => await transform.transform(merge({ $validation: true }, ctx)) ? true : false)
            else manager.single = manager.single.use(wrapper, async ctx => await transform.transform(merge({ $validation: true }, ctx)) ? true : false, override)
            logger.info(`${manager[concurrent ? 'concurrent' : 'single'].length} Session templates loaded on session manager '${identifier}'`)
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
    logger.info(`Created session manager '${name}'`)
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
    catch (err) { logger.error('An unknown error occured when running sessions:\n', err) }
}
