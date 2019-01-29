import { When } from './base'
import { compare, processArgs, processCommandString } from './utils'
import { TValidator, TParser, TValidatorCallback } from './definitions'
import { sender } from '../../instances/sender'
import { Command, ICommandArguments } from '../command'
import { MessageStream } from '../session'
import { contextTypeOf } from '../receiver'
import { TExtensibleMessage } from '../../instances/sessions'
import { ICQCode } from '../cqcode'

export const config: { operators?: number[], prefixes?: string[], self?: number, atSelf?: string } = {}

/** A class that represents conditions that determines whether a session should start ot not */
export class BotWhen extends When {
    static init({ operators, prefixes, self }: {
        operators: number[],
        prefixes: string[],
        self: number,
    }) {
        config.operators = operators
        config.prefixes = prefixes
        config.self = self
        config.atSelf = `[CQ:at,qq=${self}]`
    }
    private derive(obj: { validate?: TValidator<TExtensibleMessage>, parse?: TParser<TExtensibleMessage>, validCallback?: TValidatorCallback<TExtensibleMessage>, invalidCallback?: TValidatorCallback<TExtensibleMessage> }) { return this.deriveFromType<BotWhen>(obj) }
    /** Return a When instance with no conditions */
    ever() { return this.derive({}) }
    /** Add the raw message to the parsed result */
    raw() {
        return this.derive({ parse: function raw(ctx: TExtensibleMessage) { return ctx } })
    }
    /**
     * Add a custom matcher
     * @param condition the matcher
     * @param failMessage message that'll be sent to user when invalid
     */
    match(condition: { [x: string]: any }, ...failMessage: (string|ICQCode)[]) {
        return this.derive({
            validate: function match(ctx: TExtensibleMessage) { return compare(condition, ctx) },
            invalidCallback: function match(ctx: TExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
        })
    }
    /**
     * Check if a message contains one of the keywords
     * @param keywords the keywords
     */
    contain(...keywords: (RegExp|string)[]) {
        const keywords0 = keywords[0]
        return this.derive({
            validate: function contain(ctx: TExtensibleMessage) {
                if (keywords0 instanceof RegExp) return keywords0.test(ctx.message)
                else return keywords.some(i => ctx.message.indexOf(i as string) >= 0)
            },
            parse: function contain(ctx: TExtensibleMessage) {
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
            validate: function type(ctx: TExtensibleMessage) {
                const ctxTypes = contextTypeOf(ctx)
                for (const i of types)
                    if (ctxTypes.includes(i)) return true
                return false
            },
            parse: function type(ctx: TExtensibleMessage) { return contextTypeOf(ctx) },
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
            validate: async function role(ctx: TExtensibleMessage) {
                let actualRole: number
                if (config.operators.includes(ctx.user_id)) actualRole = 3
                else if (ctx.message_type === 'group')
                    actualRole = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo()).data.role)
                else actualRole = 2
                if (actualRole < requiredRole) return false
                return true
            },
            invalidCallback: function role(ctx: TExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
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
        validators?: { [params: string]: TValidator },
    } = {}) {
        names = names instanceof Array ? names : [names]
        if (withPrefixes) {
            const prefixedNames: string[] = []
            for (const i of config.prefixes)
                for (const j of names)
                    prefixedNames.push(`${i}${j}`)
            names = prefixedNames
        }
        const commands: Command[] = []
        for (const name of names)
            commands.push(new Command(`"${name}"${params ? ` ${params}` : ''}`))
        if (typeof prompts === 'string') prompts = { $default: prompts }
        if (!prompts.$default) prompts.$default = 'Please enter the parameter {}.'
        return this.derive({
            validate: function command(ctx: TExtensibleMessage) {
                const msg = processCommandString(ctx.message)
                return commands.some(i => i.is(msg))
            },
            parse: async function command(ctx: TExtensibleMessage, stream: MessageStream<TExtensibleMessage>) {
                const msg = processCommandString(ctx.message)
                const comm = commands.find(i => i.is(msg))
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
        return this.derive({
            validate: function at(ctx: TExtensibleMessage) {
                if (!ctx.message.startsWith(config.atSelf)) return false
                return true
            },
            invalidCallback: function at(ctx: TExtensibleMessage) { if (failMessage.length) sender.to(ctx).send(...failMessage) },
        })
    }
}
