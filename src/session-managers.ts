import { SingleSessionManager, ConcurrentSessionManager, MessageStream } from './session'
import { Sender, ICQCode, INoneResult } from './adapter'
import { IArguments } from './command'
import { sender } from './sender'
import { When } from './when'

function defaultIdentifier(ctx) { return `${ctx.user_id}${ctx.message_type[0]}${ctx._union_id}` }

const managers: any = { default: { single: new SingleSessionManager(defaultIdentifier), concurrent: new ConcurrentSessionManager(defaultIdentifier) } }

export interface ISessionContext {
    init: { 
        raw: any
        command: IArguments
    }
    sender: Sender
    stream: MessageStream
    get(condition?: (ctx: any) => boolean): Promise<any>
    reply(...message: (string|ICQCode)[]): Promise<INoneResult> 
    question(...prompt: (string|ICQCode)[]): Promise<any>
}

export function use(when: When, { override = false, identifier = 'default', concurrent = false } = {}) {
    return function useHandler(session: (ctx: ISessionContext) => void) {
        const manager = concurrent ? managers[identifier].concurrent : managers[identifier].single
        if ((!concurrent && manager instanceof SingleSessionManager) ||
            (concurrent && manager instanceof ConcurrentSessionManager)) {
            manager.use(
                async function wrapper(stream) {
                    const raw = await stream.get(),
                          command = await when.parse(raw, stream)
                    function get(condition: (ctx: any) => boolean = () => true) { return stream.get(condition) }
                    function reply(...message: (string|ICQCode)[]) { return this.sender.send(...message) }
                    async function question(...prompt: (string|ICQCode)[]) {
                        await this.reply(...prompt)
                        return this.get()
                    }
                    await session({ init: { raw, command }, sender: sender.to(raw), stream, get, reply, question })
                },
                when.validate.bind(when),
                override
            )
        } else throw new Error(`Session manager '${identifier}' does not exist`)
    }
}

export function run(ctx: any) {
    for (const i in managers) {
        managers[i].single.run(ctx)
        managers[i].concurrent.run(ctx)
    }
}