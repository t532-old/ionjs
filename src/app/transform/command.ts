import { MiddlewareManager, IMiddleware } from '../../middleware'
import { IExtensibleMessage } from '../definition'
import { Command, ICommandArguments, CommandParseError } from '../../command'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'

declare module "../definition" {
    interface IExtensibleMessage {
        command?: ICommandArguments & {
            arguments: Record<string, any>
            $prompts?: CommandTransform['_prompts']
            $notGiven?: CommandParseError['notGiven']
        }
    }
}

export class CommandTransform implements ITransform {
    public static from(last: CommandTransform) {
        const next = new CommandTransform()
        next._manager = MiddlewareManager.from(last._manager)
        if (last._command) next._command = Command.from(last._command)
        next._prompts = ObjectFrom({}, last._prompts)
        return next
    }
    private _manager = new MiddlewareManager<IExtensibleMessage>()
        .use(async function (ctx, next) {
            if (this._command.is(ctx.message)) await next()
        }).use(async function (ctx, next) {
            try { ctx.command = this._command.parse(ctx.message) }
            catch (err) {
                if (err instanceof CommandParseError) {
                    if (!this._prompts.$all)
                        if (err.notGiven.some(i => !this._prompts[i])) return
                    ctx.command = err.args
                    ctx.command.$notGiven = [...ctx.command.$notGiven, ...err.notGiven]
                } else return
            }
            ctx.command.$prompts = this._prompts
            await next()
        })
    private _command: Command
    private _prompts: { [param: string]: string } = {}
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
    public name(...names: string[]) { return this._deriveCommand(new Command(...names)) }
    public param(name: string, { optional = false, unordered = false, defaultVal, alias }: {
        optional?: boolean
        unordered?: boolean
        defaultVal?: string
        alias?: string
    } = {}) { return this._deriveCommand(this._command.param(name, { optional, unordered, defaultVal, alias })) }
    public option(opt: string) { return this._deriveCommand(this._command.option(opt)) }
    public promptAll(quote: string) {
        const next = CommandTransform.from(this)
        next._prompts.$all = quote
        return next
    }
    public prompt(name: string, quote: string) {
        const next = CommandTransform.from(this)
        next._prompts[name] = quote
        return next
    }
    public validate(name: string, validator: (arg: any) => boolean|Promise<boolean>, prompt = true) {
        return this._derive(async function (ctx, next) {
            if (await validator(ctx.command.arguments[name]))
                await next()
            else if (prompt && (this._prompts[name] || this._prompts.$all)) {
                ctx.command.$notGiven.push(name)
                await next()
            }
        })
    }
    public parse(name: string, parser: (arg: any) => any) {
        return this._derive(async function (ctx, next) {
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
        await man.run(copy, this)
        if (finished) return copy
        else return null
    }
}

export async function promptFor(ctx: IExtensibleMessage, question: (quote: string) => Promise<string>) {
    for (let i of ctx.command.$notGiven)
        ctx.command.arguments[i] = await question(ctx.command.$prompts[i] || ctx.command.$prompts.$all)
}