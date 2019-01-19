import { SingleSessionManager, ConcurrentSessionManager, MessageStream } from '../classes/session'
import { Sender, ISendResult } from '../classes/sender'
import { ICommandArguments } from '../classes/command'
import { contextTypeOf, unionIdOf } from '../classes/receiver'
import { ICQCode, Utils } from '../classes/cqcode'
import { When } from '../classes/when'
import { sender } from './sender'


function defaultIdentifier(ctx) {
    const contextType = contextTypeOf(ctx)
    return `${ctx.user_id}${contextType[contextType.length - 1]}${unionIdOf(ctx)}`
}
function groupIdentifier(ctx) { return `${ctx.group_id || ctx.discuss_id}` }
function userIdentifier(ctx) { return `${ctx.user_id}` }
const managers: any = { 
    default: { single: new SingleSessionManager(defaultIdentifier), concurrent: new ConcurrentSessionManager(defaultIdentifier) },
    group: { single: new SingleSessionManager(groupIdentifier), concurrent: new ConcurrentSessionManager(groupIdentifier) },
    user: { single: new SingleSessionManager(userIdentifier), concurrent: new ConcurrentSessionManager(userIdentifier) },
}

/** Contexts that'll be passed into essions */
export interface ISessionContext {
    /** The first context */
    init: any
    /** Sender bound to this.init.raw */
    sender: Sender
    /** Stream of messages */
    stream: MessageStream
    /** Get a copy of the next message from this.stream */
    get(condition?: (ctx: any) => boolean): Promise<any>
    /** Reply to user */
    reply(...message: (string|ICQCode)[]): Promise<ISendResult> 
    /** Question user and get an answer */
    question(...prompt: (string|ICQCode)[]): Promise<any>
    /** Forward to other sessions */
    forward(...message: (string|ICQCode)[]): Promise<void[]>
}


function deepCopy(obj: any): any {
    const newObj = {}
    for (const i in obj) {
        if (typeof obj[i] === 'object' && obj[i] && obj[i] !== obj) newObj[i] = deepCopy(obj[i])
        else newObj[i] = obj[i]
    }
    return newObj
}
/**
 * Use a session template
 * @param when when to start the session
 * @param params Another info of the session template
 */
export function use(when: When, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: ISessionContext) => void) {
        const manager = concurrent ? managers[identifier].concurrent : managers[identifier].single
        async function wrapper(stream: MessageStream) {
            async function get(condition: (ctx: any) => boolean = () => true) { return deepCopy(await stream.get(condition)) }
            let raw, init: ICommandArguments
            try { raw = await get() }
            catch { return }
            try { init = await when.parse(raw, stream) }
            catch { return }
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
            await session({ init, sender, stream, get, reply, question, forward })
        }
        if (manager instanceof SingleSessionManager) manager.use(wrapper, ctx => when.validate(ctx), override)
        else if (manager instanceof ConcurrentSessionManager) manager.use(wrapper, ctx => when.validate(ctx))
        else throw new Error(`Session manager '${identifier}' does not exist`)
    }
}

/**
 * Create a new session manager
 * @param name the session manager's name
 * @param identifier the session manager's identifier
 */
export function create(name: string, identifier: (ctx: any) => any) { 
    managers[name] = { 
        single: new SingleSessionManager(identifier), 
        concurrent: new ConcurrentSessionManager(identifier),
    } 
}

/**
 * Pass a context through the sessions
 * @param ctx the context
 */
export function run(ctx: any) {
    const promises: Promise<void>[] = []
    for (const i in managers) {
        promises.push(managers[i].single.run(ctx))
        promises.push(managers[i].concurrent.run(ctx))
    }
    return Promise.all(promises)
}
