import { split } from './utils'
import { ICommandParameters, ICommandArguments } from './definitions'
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
export class Command {
    /** The raw declaration of the command instance */
    private readonly _raw: string
    /** The delcared parameters */
    private readonly _parameters: ICommandParameters = {
        /** The keys are the aliases and the values are param names  */
        aliases: {},
        /** The keys are param names and the values are default values */
        defaults: {},
        /** An array of ordered params */
        ordered: [],
        /** An array of required params */
        required: [],
    }
    /** An array of declared options */
    private readonly _options: string[] = []
    /** The command's name */
    private readonly _name: string
    /**
     * Check if a command matches the name
     * @param command the command for checking
     */
    readonly is = (command: string) => split(command)[0] === this._name
    /** Regexps for parsing declarations and commands */
    private static readonly _REGEXES = {
        /** A regexp that matches a parameter in the declaration */
        PARAMETER: /^([<\[])(\?)?(.+?)(?:\((.+?)\))?([>\]])(?:=(.+?))?$/,
        /** A regexp that matches a key-value pair in a command */
        KEY_VALUE: /^(.*[^\\])=(.+)$/,
    }
    get parameters() { return this._parameters }
    /** @param declaration The command declaration */
    constructor(declaration: string) {
        debug('init %s', declaration)
        this._raw = declaration
        const command = split(declaration)
        this._name = command.shift()
        for (const i of command) {
            const matched = i.match(Command._REGEXES.PARAMETER)
            if (matched) {
                const [, required, unordered, name, alias, , defaultVal] = matched
                if (required === '<') this._parameters.required.push(name)
                if (!unordered) this._parameters.ordered.push(name)
                if (alias) this._parameters.aliases[name] = alias
                if (defaultVal) this._parameters.defaults[name] = defaultVal
            } else {
                this._options.push(i)
            }
        }
    }
    /** Reloaded version of toString() that returns the raw declaration */
    toString() { return this._raw }
    /**
     * Parse a command
     * @param command The command for parsing
     */
    parse(command: string): ICommandArguments {
        let rawArgs = split(command)
        if (rawArgs[0] !== this._name) throw new CommandParseError('Wrong command name', null, null)
        rawArgs = rawArgs.slice(1)
        const args = {
            options: [],
            arguments: {},
            rest: [],
        }
        const unusedParams = Array.from(this._parameters.ordered)
        for (const arg of rawArgs) {
            let specialArg = false
            if (this._options.includes(arg)) {
                args.options.push(arg)
                specialArg = true
            }
            for (const param in this._parameters.aliases)
                if (arg.startsWith(this._parameters.aliases[param])) {
                    args.arguments[param] = arg.slice(this._parameters.aliases[param].length)
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
        for (const param in this._parameters.defaults)
            if (!(param in args.arguments)) {
                args.arguments[param] = this._parameters.defaults[param]
            }
        for (const arg in args.arguments)
            args.arguments[arg] = args.arguments[arg].replace(/\\=/g, '=')
        const notGiven: string[] = []
        for (const param of this._parameters.required)
            if (!(param in args.arguments)) notGiven.push(param)
        if (notGiven.length) throw new CommandParseError('No enough required arguments', args, notGiven)
        debugVerbose('finish %s %o', command, args)
        return args
    }
}