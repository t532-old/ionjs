import { split } from './util'
import { ICommandParameters, ICommandArguments } from './definition'
import * as ObjectFrom from 'deepmerge'

export class CommandParseError extends Error {
    public args: ICommandArguments
    public notGiven: string[]
    public constructor(message: string, result?: ICommandArguments, notGiven?: string[]) {
        super(message)
        this.args = result
        this.notGiven = notGiven
    }
}
/** A class that represents a shell-like-command and is able to parse commands */
export class Command {
    /** Regexps for parsing declarations and commands */
    private static readonly _REGEXES = {
        /** A regexp that matches a parameter in the declaration */
        PARAMETER: /^([<\[])(\?)?(.+?)(?:\((.+?)\))?([>\]])(?:=(.+?))?$/,
        /** A regexp that matches a key-value pair in a command */
        KEY_VALUE: /^(.*[^\\])=(.+)$/,
    }
    private _parameters: ICommandParameters = {
        /** The keys are the param names and the values are aliases  */
        aliases: {},
        /** The keys are param names and the values are default values */
        defaults: {},
        /** An array of ordered params */
        ordered: [],
        /** An array of required params */
        required: [],
    }
    private _options: string[] = []
    private _names: string[]
    /** @param names The command names */
    public constructor(...names: string[]) { this._names = names }
    /** Construct from existing instance */
    public static from(data: Command) {
        const next = new Command(...data._names)
        next._options = Array.from(data._options)
        next._parameters = ObjectFrom(data._parameters, {})
        return next
    }
    /**
     * Check if a command matches the name
     * @param command the command for checking
     */
    public readonly is = (command: string) => this._names.includes(split(command)[0])
    /** Add an option to the command declaration */
    public option(opt: string) {
        const next = Command.from(this)
        next._options.push(opt)
        return next
    }
    /**
     * Add a parameter to the command declaration
     * @param name the param name
     * @param options options of the parameter
     */
    public param(name: string, { optional = false, unordered = false, defaultVal, alias }: {
        optional?: boolean
        unordered?: boolean
        defaultVal?: string
        alias?: string
    } = {}) {
        const next = Command.from(this)
        if (!optional) next._parameters.required.push(name)
        if (!unordered) next._parameters.ordered.push(name)
        if (typeof defaultVal === 'string') next._parameters.defaults[name] = defaultVal
        if (typeof alias === 'string') next._parameters.aliases[name] = alias
        return next
    }
    /**
     * Parse a command
     * @param command The command for parsing
     */
    public parse(command: string): ICommandArguments {
        let rawArgs = split(command)
        if (!this._names.includes(rawArgs[0])) throw new CommandParseError('Wrong command name', null, null)
        const args = {
            options: [],
            arguments: {},
            rest: [],
            name: rawArgs[0],
        }
        rawArgs = rawArgs.slice(1)
        const unusedParams = Array.from(this._parameters.ordered)
        for (const arg of rawArgs) {
            let specialArg = false
            if (this._options.includes(arg)) {
                args.options.push(arg)
                specialArg = true
            }
            for (const param in this._parameters.aliases) {
                const alias = this._parameters.aliases[param]
                if (arg.startsWith(alias)) {
                    args.arguments[param] = arg.slice(alias.length)
                    const indexOfParam = unusedParams.indexOf(param)
                    if (indexOfParam >= 0) unusedParams.splice(indexOfParam, 1)
                    specialArg = true
                }
            }
            const keyValue = arg.match(Command._REGEXES.KEY_VALUE)
            if (keyValue) {
                args.arguments[keyValue[1]] = keyValue[2]
                const indexOfParam = unusedParams.indexOf(keyValue[1])
                if (indexOfParam >= 0) unusedParams.splice(indexOfParam, 1)
                specialArg = true
            }
            if (!specialArg) {
                if (unusedParams.length) {
                    args.arguments[unusedParams.shift()] = arg
                } else {
                    args.rest.push(arg)
                }
            }
        }
        for (const param in this._parameters.defaults) {
            const val = this._parameters.defaults[param]
            if (!(param in args.arguments)) args.arguments[param] = val
        }
        for (const arg in args.arguments)
            args.arguments[arg] = args.arguments[arg].replace(/\\=/g, '=')
        const notGiven: string[] = []
        for (const param of this._parameters.required)
            if (!(param in args.arguments)) notGiven.push(param)
        if (notGiven.length) throw new CommandParseError('No enough required arguments', args, notGiven)
        return args
    }
}
