import { IMemberInfoResult, CQCode, contextTypeOf, ICQCode } from './adapter'
import { MessageStream } from './session'
import { Command, ICommandArguments } from './command'
import { sender } from './sender'

const config: { operators?: number[], prefixes?: string[], self?: number, atSelf?: string } = {}

/**
 * Form a string to let Commands parse better
 * @param msg the message (cqcode array)
 */
export function parseCommandString(msg: ICQCode[]) {
    let str = CQCode.arrayToString(msg.map(i => i.type === 'text' ? i : { type: i.type, data: Object.keys(i.data).reduce((acc, val) => {
        acc[`${val}\\\\`] = i.data[val]
        return acc
    }, {}) })).trim()
    if (str.startsWith(config.atSelf)) str = str.slice(config.atSelf.length).trim()
    return str
}

/** A class that represents conditions that determines whether a session should start ot not */
export class When {
    /** The expected commands */
    private _commands: Command[]
    /** User-defined validator */
    private _validator: (ctx: any) => boolean|Promise<boolean>
    /** Permission level, 0=user, 1=admin, 2=owner, 3=operator */
    private _permissionLevel: 0|1|2|3
    /** Avaliable content types such as message/private etc */
    private _contextTypes: string[]
    /** Whether the bot must be at */
    private _onlyAt: boolean
    /** @param config the same value as private properties */
    constructor({ commands = [], validator = () => true, permissionLevel = 0, contextTypes = ['message'], onlyAt = false }: {
        commands?: Command[],
        validator?: (ctx: any) => boolean|Promise<boolean>,
        permissionLevel?: 0|1|2|3,
        contextTypes?: string[],
        onlyAt?: boolean,
    } = {}) {
        this._commands = commands
        this._validator = validator
        this._permissionLevel = permissionLevel
        this._contextTypes = contextTypes
        this._onlyAt = onlyAt
    }
    /**
     * Checks whether a context reached the conditions
     * @param ctx the context
     */
    async validate(ctx: any) {
        // onlyAt
        if (this._onlyAt && !CQCode.arrayToString(ctx.message).startsWith(config.atSelf)) return false
        // command
        if (this._commands.length) {
            let commandMatched = false
            for (const i of this._commands) 
                if (i.is(parseCommandString(ctx.message))) {
                    commandMatched = true
                    break
                }
            if (!commandMatched) return false
        }
        // type
        const contextTypes = contextTypeOf(ctx)
        let typeMatched = false
        for (const i of contextTypes)
            if (this._contextTypes.includes(i)) {
                typeMatched = true
                break
            }
        if (!typeMatched) return false
        // permission
        let permissionLevel: number
        if (config.operators.includes(ctx.user_id)) permissionLevel = 3
        else if (ctx.message_type !== 'group') permissionLevel = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo() as IMemberInfoResult).data.role)
        else permissionLevel = 2
        if (permissionLevel < this._permissionLevel) return false
        // validator
        return await this._validator(ctx)
    }
    /**
     * Parse a context to a command parsing result
     * @param ctx the context
     * @param stream the message stream
     */
    async parse(ctx: any, stream: MessageStream) {
        if (this._commands.length) {
            const str = parseCommandString(ctx.message)
            let command: Command
            for (const i of this._commands) 
                if (i.is(str)) {
                    command = i
                    break
                }
            if (!command) throw new Error(`No command matches message ${str}`)
            return await command.parse(str, ctx, stream)
        } else return null
    }
    /** Return a When instance with default conditions */
    ever() { return new When() }
    /**
     * Use a command for the conditions
     * @param names the commands' names
     * @param params the parameters' declaration
     * @param withPrefixes whether this Command should be called with prefixes
     */
    command(names: string|string[], params: string, withPrefixes: boolean = true) {
        names = names instanceof Array ? names : [names]
        if (withPrefixes) {
            const prefixedNames: string[] = []
            for (const i of config.prefixes)
                for (const j of names)
                    prefixedNames.push(`${i}${j}`)
            names = prefixedNames
        }
        const commands = []
        for (const name of names) {
            commands.push(new Command(`"${name}" ${params}`, async function processor({ arguments: args }, { parameters: params }, rawMessage: any, stream: MessageStream) {
                const paramList = [...params.required, ...Object.keys(args)].reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], [])
                for (const i of paramList) {
                    const rawDescription: string[] = (params.description[i] || '').split(',').reduce((acc, val) => {
                        if (acc.length >= 2) return [acc[0], acc[1] + val]
                        else return [...acc, val]
                    }, [])
                    const description = { type: rawDescription[0] || 'string', prompt: rawDescription[1] || `Enter '${i}'${rawDescription[0] ? `(include ${rawDescription[0]})` : ''}:` }
                    let result = CQCode.filterType(args[i] || [], description.type)
                    while (!result) {
                        await sender.to(rawMessage).send(description.prompt)
                        result = CQCode.filterType((await stream.get()).message, description.type)
                    }
                    args[i] = result
                }
            }))
        }
        return new When({
            commands,
            validator: this._validator,
            permissionLevel: this._permissionLevel,
            contextTypes: this._contextTypes,
            onlyAt: this._onlyAt,
        })
    }
    /**
     * Add a custom validator
     * @param validator The validator
     */
    match(validator: (ctx: any) => boolean|Promise<boolean>) {
        return new When({
            commands: this._commands,
            validator,
            permissionLevel: this._permissionLevel,
            contextTypes: this._contextTypes,
            onlyAt: this._onlyAt,
        })
    }
    /**
     * Specify the permission level
     * @param level The level
     */
    permission(level: 'everyone'|'admin'|'owner'|'operator') {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: ['everyone', 'admin', 'owner', 'operator'].indexOf(level) as 0|1|2|3,
            contextTypes: this._contextTypes,
            onlyAt: this._onlyAt,
        })
    }
    /**
     * Specify expected content types
     * @param type The expected content type(s)
     */
    type(type: string|string[]) {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: this._permissionLevel,
            contextTypes: type instanceof Array ? type : [type],
            onlyAt: this._onlyAt,
        })
    }
    /** Let the command can only be called with at */
    onlyAt() {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: this._permissionLevel,
            contextTypes: this._contextTypes,
            onlyAt: true,
        })
    }
    /** Let the command can also be called without at */
    notOnlyAt() {
        return new When({
            commands: this._commands,
            validator: this._validator,
            permissionLevel: this._permissionLevel,
            contextTypes: this._contextTypes,
            onlyAt: false,
        })
    }
}

/**
 * Set the configuration of class When
 * @param config the config
 */
export function init({ operators, prefixes, self }: {
    operators: number[],
    prefixes: string[],
    self: number,
}) {
    config.operators = operators
    config.prefixes = prefixes
    config.self = self
    config.atSelf = `[CQ:at,qq:${self}]`
}