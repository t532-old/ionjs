import { SingleSessionManager, ConcurrentSessionManager, MessageStream } from './session'
import { Sender, ICQCode, ISendResult } from './adapter'
import { ICommandArguments } from './command'
import { sender } from './sender'
import { When } from './when'
import { copyFile } from 'fs';

function defaultIdentifier(ctx) { return `${ctx.user_id}${ctx.message_type[0]}${ctx._union_id}` }
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
    init: { 
        /** THe raw context */
        raw: any
        /** The parsed arguments */
        command: ICommandArguments
    }
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
}

/**
 * Use a session templace
 * @param when when to start the session
 * @param params Another info of the session template
 */
export function use(when: When, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: ISessionContext) => void) {
        const manager = concurrent ? managers[identifier].concurrent : managers[identifier].single
        async function wrapper(stream) {
            const originalRaw = await stream.get()
            const raw = Object.keys(originalRaw).reduce((acc, val) => acc[val] = originalRaw[val], {}),
                  command = await when.parse(raw, stream)
            const boundSender = sender.to(raw)
            async function get(condition: (ctx: any) => boolean = () => true) {
                const original = await stream.get(condition) 
                return Object.keys(original).reduce((acc, val) => acc[val] = original[val], {})
            }
            function reply(...message: (string|ICQCode)[]) { return boundSender.send(...message) }
            async function question(...prompt: (string|ICQCode)[]) {
                await reply(...prompt)
                return get()
            }
            await session({ init: { raw, command }, sender, stream, get, reply, question })
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
    this.managers[name] = { 
        single: new SingleSessionManager(identifier), 
        concurrent: new ConcurrentSessionManager(identifier),
    } 
}

/**
 * Pass a context through the sessions
 * @param ctx the context
 */
export function run(ctx: any) {
    for (const i in managers) {
        managers[i].single.run(ctx)
        managers[i].concurrent.run(ctx)
    }
}