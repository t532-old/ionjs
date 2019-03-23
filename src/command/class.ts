import { split } from './util'
import { ICommandParameters, ICommandArguments, ICommand, ICommandData } from './definition'
import { default as ObjectFrom } from 'deepmerge'
import Debug from 'debug'
const debug = Debug('ionjs:command'),
      debugVerbose = Debug('verbose-ionjs:command')

export class CommandParseError extends Error {
    args: ICommandArguments
    notGiven: string[]
    constructor(message: string, result?: ICommandArguments, notGiven?: string[]) {
        super(message)
        this.args = result
        this.notGiven = notGiven
    }
}
/** A class that represents a shell-like-command and is able to parse commands */
export class Command implements ICommand, ICommandData {
    /** The raw declaration of the command instance */
    private readonly _raw: string
    parameters: ICommandParameters = {
        /** The keys are the aliases and the values are param names  */
        aliases: new Map(),
        /** The keys are param names and the values are default values */
        defaults: new Map(),
        /** An array of ordered params */
        ordered: [],
        /** An array of required params */
        required: [],
    }
    options: string[] = []
    name: string
    readonly is = (command: string) => split(command)[0] === this.name
    /** Regexps for parsing declarations and commands */
    private static readonly _REGEXES = {
        /** A regexp that matches a parameter in the declaration */
        PARAMETER: /^([<\[])(\?)?(.+?)(?:\((.+?)\))?([>\]])(?:=(.+?))?$/,
        /** A regexp that matches a key-value pair in a command */
        KEY_VALUE: /^(.*[^\\])=(.+)$/,
    }
    /** Construct from existing instance */
    static from(data: ICommandData) {
        const next = new Command('placeholder')
        next.name = data.name
        next.options = ObjectFrom(data.options, {})
        next.parameters = ObjectFrom(data.parameters, {})
    }
    /** @param declaration The command declaration */
    constructor(declaration: string) {
        debug('init %s', declaration)
        this._raw = declaration
        const command = split(declaration)
        this.name = command.shift()
        for (const i of command) {
            const matched = i.match(Command._REGEXES.PARAMETER)
            if (matched) {
                const [, required, unordered, name, alias, , defaultVal] = matched
                if (required === '<') this.parameters.required.push(name)
                if (!unordered) this.parameters.ordered.push(name)
                if (alias) this.parameters.aliases.set(name, alias)
                if (defaultVal) this.parameters.defaults.set(name, defaultVal)
            } else {
                this.options.push(i)
            }
        }
    }
    toString() { return this._raw }
    parse(command: string): ICommandArguments {
        let rawArgs = split(command)
        if (rawArgs[0] !== this.name) throw new CommandParseError('Wrong command name', null, null)
        rawArgs = rawArgs.slice(1)
        const args = {
            options: [],
            arguments: {},
            rest: [],
            name: this.name,
        }
        const unusedParams = Array.from(this.parameters.ordered)
        for (const arg of rawArgs) {
            let specialArg = false
            if (this.options.includes(arg)) {
                args.options.push(arg)
                specialArg = true
            }
            for (const [param, alias] of this.parameters.aliases)
                if (arg.startsWith(alias)) {
                    args.arguments[param] = arg.slice(alias.length)
                    const indexOfParam = unusedParams.indexOf(param)
                    if (indexOfParam >= 0) unusedParams.splice(indexOfParam, 1)
                    specialArg = true
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
        for (const [param, val] of this.parameters.defaults)
            if (!(param in args.arguments)) {
                args.arguments[param] = val
            }
        for (const arg in args.arguments)
            args.arguments[arg] = args.arguments[arg].replace(/\\=/g, '=')
        const notGiven: string[] = []
        for (const param of this.parameters.required)
            if (!(param in args.arguments)) notGiven.push(param)
        if (notGiven.length) throw new CommandParseError('No enough required arguments', args, notGiven)
        debugVerbose('finish %s %o', command, args)
        return args
    }
}