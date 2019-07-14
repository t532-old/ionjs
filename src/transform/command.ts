import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import { Command, ICommandArguments, CommandParseError } from '../util/command'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'
import { ICQCodeArray } from '../platform/cqcode'
import { toArray } from '../platform/cqcode/util'

declare module '../definition' {
    interface IExtensibleMessage {
        /** The parsed command */
        command?: ICommandArguments & { arguments: Record<string, any> }
    }
}

/** Transformations related to commands */
export class CommandTransform implements ITransform {
    private _manager = new MiddlewareManager<IExtensibleMessage>()
        .use(async function (ctx, next) {
            if (this._command.is(ctx.message)) await next()
        }).use(async function (ctx, next) {
            if (!ctx.$validation) {
                try { ctx.command = this._command.parse(ctx.message) }
                catch (err) {
                    if (err instanceof CommandParseError) {
                        if (!this._prompts.$all)
                            if (err.notGiven.some(i => !this._prompts[i])) return
                        ctx.command = err.args
                        for (const i of err.notGiven) {
                            await ctx.$session().reply(this._prompts[i] || this._prompts.$all)
                            ctx.command.arguments[i] = (await ctx.$session().stream.get()).message
                        }
                    } else return
                }
            }
            await next()
        })
    private _command: Command
    private _prompts: Record<string, ICQCodeArray> = {}
    /** Deep-copy a Transform object */
    public static from(last: CommandTransform) {
        const next = new CommandTransform()
        next._manager = MiddlewareManager.from(last._manager)
        if (last._command) next._command = Command.from(last._command)
        next._prompts = ObjectFrom({}, last._prompts)
        return next
    }
    /**
     * @param names The command's names
     */
    public constructor(...names: string[]) { this._command = new Command(...names) }
    /**
     * Add a parameter to the command
     * @param name The parameter's name
     */
    public param(name: string, { optional = false, unordered = false, defaultVal, alias }: {
        /** Whether the parameter is optional. Defaults to false */
        optional?: boolean
        /** Whether the parameter is unordered (can only be specified by K-V pairs). Defaults to false */
        unordered?: boolean
        /** The parameter's default value */
        defaultVal?: string
        /** The parameter's alias. [alias][value] is the same as [param]=[value] */
        alias?: string
    } = {}) { return this._deriveCommand(this._command.param(name, { optional, unordered, defaultVal, alias })) }
    /** Add an option to the command. */
    public option(opt: string) { return this._deriveCommand(this._command.option(opt)) }
    /** Set the general prompt of ungiven required parameters */
    public promptAll(quote: ICQCodeArray | string) {
        const next = CommandTransform.from(this)
        next._prompts.$all = toArray(quote)
        return next
    }
    /** Set the prompt of an ungiven required parameter */
    public prompt(name: string, quote: ICQCodeArray | string) {
        const next = CommandTransform.from(this)
        next._prompts[name] = toArray(quote)
        return next
    }
    /** Set a validator function for a parameter */
    public validate(name: string, validator: (arg: any) => boolean|Promise<boolean>, prompt = true) {
        return this._derive(async function (ctx, next) {
            if (!ctx.$validation) {
                if (await validator(ctx.command.arguments[name]))
                    await next()
            } else await next()
        })
    }
    /** Set a parser function for a parameter */
    public parse(name: string, parser: (arg: any) => any) {
        return this._derive(async function (ctx, next) {
            if (!ctx.$validation)
                if (ctx.command.arguments[name])
                    ctx.command.arguments[name] = parser(ctx.command.arguments[name])
            await next()
        })
    }
    public async transform(msg: IExtensibleMessage) {
        let finished = false
        const man = this._manager.use(async function (ctx, next) {
            finished = true
            await next()
        })
        const copy = ObjectFrom({}, msg)
        await man.runBound(copy, this)
        if (finished) return copy
        else return null
    }
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = CommandTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
    private _deriveCommand(command: Command) {
        const next = CommandTransform.from(this)
        next._command = command
        return next
    }
}
