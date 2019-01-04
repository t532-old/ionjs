import { SingleSessionManager, ConcurrentSessionManager, MessageStream } from './session'
import { Sender, ICQCode, ISendResult } from './adapter'
import { ICommandArguments } from './command'
import { sender } from './sender'
import { When } from './when'
import { copyFile } from 'fs';

function defaultIdentifier(ctx) { return `${ctx.user_id}${ctx.message_type[0]}${ctx._union_id}` }

const managers: any = { default: { single: new SingleSessionManager(defaultIdentifier), concurrent: new ConcurrentSessionManager(defaultIdentifier) } }

export interface ISessionContext {
    init: { 
        raw: any
        command: ICommandArguments
    }
    sender: Sender
    stream: MessageStream
    get(condition?: (ctx: any) => boolean): Promise<any>
    reply(...message: (string|ICQCode)[]): Promise<ISendResult> 
    question(...prompt: (string|ICQCode)[]): Promise<any>
}

export function use(when: When, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: ISessionContext) => void) {
        const manager = concurrent ? managers[identifier].concurrent : managers[identifier].single
        if (manager instanceof SingleSessionManager)
            manager.use(
                async function wrapper(stream) {
                    const raw = await stream.get(),
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
                },
                ctx => when.validate(ctx),
                override
            )
        else if (manager instanceof ConcurrentSessionManager)
            manager.use(
                async function wrapper(stream) {
                    const raw = await stream.get(),
                          command = await when.parse(raw, stream)
                    const boundSender = sender.to(raw)
                    function get(condition: (ctx: any) => boolean = () => true) { return stream.get(condition) }
                    function reply(...message: (string|ICQCode)[]) { return boundSender.send(...message) }
                    async function question(...prompt: (string|ICQCode)[]) {
                        await reply(...prompt)
                        return get()
                    }
                    await session({ init: { raw, command }, sender, stream, get, reply, question })
                },
                ctx => when.validate(ctx)
            )
        else throw new Error(`Session manager '${identifier}' does not exist`)
    }
}

export function run(ctx: any) {
    for (const i in managers) {
        managers[i].single.run(ctx)
        managers[i].concurrent.run(ctx)
    }
}