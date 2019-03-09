import { When } from './base'
import { compare, processArgs, processCommandString } from './utils'
import { IValidator, IParser, IValidatorCallback } from './definitions'
import { sender } from '../../instances/sender'
import { Command, ICommandArguments } from '../command'
import { MessageStream } from '../session'
import { contextTypeOf } from '../receiver'
import { IExtensibleMessage } from '../../instances/definitions'
import { ICQCode } from '../cqcode'

/** A class that represents conditions that determines whether a session should start ot not */
export class BotWhen extends When {
    private config: { operators?: number[], prefixes?: string[], self?: number, atSelf?: string } = {}
    init({ operators, prefixes, self }: {
        operators: number[],
        prefixes: string[],
        self: number,
    }) {
        this.config.operators = operators
        this.config.prefixes = prefixes
        this.config.self = self
        this.config.atSelf = `[CQ:at,qq=${self}]`
        return this
    }
    private derive(obj: { validate?: IValidator<IExtensibleMessage>, parse?: IParser<IExtensibleMessage>, validCallback?: IValidatorCallback<IExtensibleMessage>, invalidCallback?: IValidatorCallback<IExtensibleMessage> }) {
        return this.deriveFromType<BotWhen>(obj).init({
            operators: this.config.operators,
            prefixes: this.config.prefixes,
            self: this.config.self,
        })
    }
    /** Return a When instance with no conditions */
    ever() { return this.derive({}) }
    /** Add the raw message to the parsed result */
    raw() {
        return this.derive({ parse: function raw(ctx: IExtensibleMessage) { return ctx } })
    }
    /**
     * Add a custom matcher
     * @param condition the matcher
     * @param failMessage message that'll be sent to user when invalid
     */
    match(condition: { [x: string]: any }, ...failMessage: (string|ICQCode)[]) {
        return this.derive({
            validate: function match(ctx: IExtensibleMessage) { return compare(condition, ctx) },
            invalidCallback: function match(ctx: IExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
        })
    }
    /**
     * Check if a message contains one of the keywords
     * @param keywords the keywords
     */
    contain(...keywords: (RegExp|string)[]) {
        const keywords0 = keywords[0]
        return this.derive({
            validate: function contain(ctx: IExtensibleMessage) {
                if (keywords0 instanceof RegExp) return keywords0.test(ctx.message)
                else return keywords.some(i => ctx.message.indexOf(i as string) >= 0)
            },
            parse: function contain(ctx: IExtensibleMessage) {
                if (keywords0 instanceof RegExp) return keywords0.test(ctx.message)
                else return keywords.filter(i => ctx.message.indexOf(i as string) >= 0)
            },
        })
    }
    /**
     * Specify expected content types
     * @param type The expected content type(s)
     */
    type(...types: string[]) {
        return this.derive({
            validate: function type(ctx: IExtensibleMessage) {
                const ctxTypes = contextTypeOf(ctx)
                for (const i of types)
                    if (ctxTypes.includes(i)) return true
                return false
            },
            parse: function type(ctx: IExtensibleMessage) { return contextTypeOf(ctx) },
        })
    }
    /**
     * Specify the required role
     * @param role The role
     * @param failMessage message that'll be sent to user when invalid
     */
    role(role: 'everyone'|'admin'|'owner'|'operator', ...failMessage: (string|ICQCode)[]) {
        const requiredRole = ['everyone', 'admin', 'owner', 'operator'].indexOf(role)
        return this.derive({
            validate: async function role(ctx: IExtensibleMessage) {
                let actualRole: number
                if (this.config.operators.includes(ctx.user_id)) actualRole = 3
                else if (ctx.message_type === 'group')
                    actualRole = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo()).data.role)
                else actualRole = 2
                if (actualRole < requiredRole) return false
                return true
            },
            invalidCallback: function role(ctx: IExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
        })
    }
    /**
     * Use a command for the conditions
     * @param names the commands' names
     * @param params the parameters' declaration
     * @param config the config object
     */
    command(names: string|string[], params?: string, { withPrefixes = true, types = {}, prompts = 'Please enter the parameter {}.', validators = {} }: {
        withPrefixes?: boolean,
        types?: { [param: string]: any },
        prompts?: string|{ [params: string]: string },
        validators?: { [params: string]: IValidator },
    } = {}) {
        names = names instanceof Array ? names : [names]
        if (withPrefixes) {
            const prefixedNames: string[] = []
            for (const i of this.config.prefixes)
                for (const j of names)
                    prefixedNames.push(`${i}${j}`)
            if (prefixedNames.length) names = prefixedNames
        }
        const commands: Command[] = []
        for (const name of names)
            commands.push(new Command(`"${name}"${params ? ` ${params}` : ''}`))
        if (typeof prompts === 'string') prompts = { $default: prompts }
        if (!prompts.$default) prompts.$default = 'Please enter the parameter {}.'
        const { atSelf } = this.config
        return this.derive({
            validate: function command(ctx: IExtensibleMessage) {
                const msg = processCommandString(ctx.message, atSelf)
                return commands.some(i => i.is(msg))
            },
            parse: async function command(ctx: IExtensibleMessage, stream: MessageStream<IExtensibleMessage>) {
                const msg = processCommandString(ctx.message, atSelf)
                let args: ICommandArguments
                let notGiven: string[] = []
                try { args = commands.find(i => i.is(msg)).parse(msg) }
                catch (err) { ({ args, notGiven } = err) }
                await processArgs(args, notGiven, { prompts: prompts as { [param: string]: string }, types, validators }, { init: ctx, stream })
                return args
            },
        })
    }
    /**
     * At only
     * @param failMessage message that'll be sent to user when invalid
     */
    at(...failMessage: (string|ICQCode)[]) {
        const { atSelf } = this.config
        return this.derive({
            validate: function at(ctx: IExtensibleMessage) {
                if (ctx.message.startsWith(atSelf) || ctx.message_type === 'private') return true
                return false
            },
            invalidCallback: function at(ctx: IExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
        })
    }
}
