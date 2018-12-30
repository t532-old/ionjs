import { IMemberInfoResult, CQCode, ICQCode } from './adapter'
import { MessageStream } from './session'
import { Command } from './command'
import { sender } from './sender'

const config: { operators?: number[], prefixes?: string[], self?: number } = {}

export class When {
    private _commands: Command[]
    private _validator: (ctx: any) => boolean|Promise<boolean>
    private _permissionLevel: 0|1|2|3
    private _onlyAt: boolean
    constructor({ commands = [], validator = () => true, permissionLevel = 'everyone', onlyAt = false }: {
        commands?: Command[],
        validator?: (ctx: any) => boolean|Promise<boolean>,
        permissionLevel?: 'everyone'|'admin'|'owner'|'operator',
        onlyAt?: boolean,
    } = {}) {
        this._commands = commands
        this._validator = validator
        this._permissionLevel = ['everyone', 'admin', 'owner', 'operator'].indexOf(permissionLevel) as 0|1|2|3
        this._onlyAt = onlyAt
    }
    async validate(ctx: any) {
        // onlyAt
        if (ctx.message[0].type !== 'at' || ctx.message[0].data.qq !== config.self.toString()) {
            if (this._onlyAt) return false
        } else {
            ctx.message.shift()
            if (ctx.message[0].type === 'text' && ctx.message[0].data.text.startsWith(' ')) ctx.message[0].data.text = ctx.message[0].data.text.slice(1)
        }
        

        // command
        if (this._commands.length) {
            let commandMatched = false
            for (const i of this._commands) 
                if (i.is(CQCode.arrayToString(ctx.message))) {
                    commandMatched = true
                    break
                }
            if (!commandMatched) return false
        }

        // permission
        let permissionLevel: number
        if (config.operators.includes(ctx.user_id)) permissionLevel = 3
        else if (ctx.message_type !== 'group') permissionLevel = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo() as IMemberInfoResult).data.role)
        else permissionLevel = 2
        if (permissionLevel < this._permissionLevel) return false

        // validator
        return await this._validator(ctx)
    }
    async parse(ctx: any, stream: MessageStream) {
        const str = CQCode.arrayToString(ctx.message)
        let command: Command
        for (const i of this._commands) 
            if (i.is(CQCode.arrayToString(ctx.message))) {
                command = i
                break
            }
        if (!command) throw new Error(`No command matches message ${str}`)
        return await command.parse(str, ctx, stream)
    }
    ever() {
        return new When({})
    }
    command(names: string|string[], params: string, withPrefixes: boolean = true) {
        names = names instanceof Array ? names : [names]
        if (withPrefixes) {
            const prefixedNames: string[] = []
            for (const i of config.prefixes)
                for (const j of names)
                    prefixedNames.push(`${i}${j}`)
            names = [...names, ...prefixedNames]
        }
        const commands = []
        for (const name of names) {
            commands.push(new Command(`"${name}" ${params}`, {
                async processor(args, { parameters: params }, rawMessage: any, stream: MessageStream) {
                    const descriptions = {}
                    for (const i in params.description) {
                        const description = params.description[i].split(',')
                        descriptions[i] = { type: description[0], prompt: description[1] || `Enter '${i}'${description[0] ? `(include ${description[0]})` : ''}:` }
                    }
                    const keys = Object.keys(args.arguments)
                    for (const i of params.required)
                        if (!keys.includes(i)) {
                            await sender.to(rawMessage).send(descriptions[i].prompt)
                            args.arguments[i] = (await stream.get()).message
                        }
                    for (const i in args.arguments)
                        if (!(args.arguments[i] instanceof Array)) 
                            args.arguments[i] = CQCode.stringToArray(args.arguments[i])
                    for (const i in args.arguments) {
                        if (descriptions[i] && descriptions[i].type) {
                            let result = args.arguments[i].find((code: ICQCode) => code.type === descriptions[i].type)
                            while (!result) {
                                await sender.to(rawMessage).send(descriptions[i].prompt)
                                result = (await stream.get()).message.find((code: ICQCode) => code.type === descriptions[i].type)
                            }
                            args.arguments[i] = result.data
                        } else args.arguments[i] = CQCode.arrayToString(args.arguments[i])
                    }
                },
                delimiters: [['[', ']']],
            }))
        }
        return new When({
            commands,
            validator: this._validator,
            permissionLevel: ['everyone', 'admin', 'owner', 'operator'][this._permissionLevel] as 'everyone'|'admin'|'owner'|'operator',
            onlyAt: this._onlyAt,
        })
    }
    match(validator: (ctx: any) => boolean|Promise<boolean>) {
        return new When({
            commands: this._commands,
            validator,
            permissionLevel: ['everyone', 'admin', 'owner', 'operator'][this._permissionLevel] as 'everyone'|'admin'|'owner'|'operator',
            onlyAt: this._onlyAt,
        })
    }
    permission(level: 'everyone'|'admin'|'owner'|'operator') {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: level,
            onlyAt: this._onlyAt,
        })
    }
    onlyAt() {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: ['everyone', 'admin', 'owner', 'operator'][this._permissionLevel] as 'everyone'|'admin'|'owner'|'operator',
            onlyAt: true,
        })
    }
    notOnlyAt() {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: ['everyone', 'admin', 'owner', 'operator'][this._permissionLevel] as 'everyone'|'admin'|'owner'|'operator',
            onlyAt: false,
        })
    }
}

export function init({ operators, prefixes, self }: {
    operators: number[],
    prefixes: string[],
    self: number,
}) {
    config.operators = operators
    config.prefixes = prefixes
    config.self = self
}