import { When } from './base'
import { compare, commandProcessor, processCommandString } from './utils'
import { TValidator, TParser } from './definitions'
import { sender } from '../../instances/sender'
import { Command } from '../command'
import { MessageStream } from '../session'
import { contextTypeOf } from '../receiver'
import { IMemberInfoResult } from '../sender'

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
    private derive(obj: { validate?: TValidator, parse?: TParser }) { return this.deriveFromType<BotWhen>(obj) }
    /** Return a When instance with no conditions */
    ever() { return this.derive({}) }
    /** Add the raw message to the parsed result */
    raw() { 
        return this.derive({ parse: function raw(ctx: any) { return ctx } })
    }
    /**
     * Add a custom matcher
     * @param condition the matcher
     */
    match(condition: any) {
        return this.derive({ validate: function match(ctx: any) { return compare(condition, ctx) } })
    }
    /**
     * Check if a message contains one of the keywords
     * @param keywords the keywords
     */
    contain(keywords: RegExp|string|string[]) {
        return this.derive({
            validate: function contain(ctx: any) {
                if (keywords instanceof RegExp) return keywords.test(ctx.message)
                else if (keywords instanceof Array) return keywords.some(i => ctx.message.indexOf(i) >= 0)
                else return ctx.message.indexOf(keywords) >= 0
            }, 
            parse: function contain(ctx: any) {
                if (keywords instanceof RegExp) return ctx.message.match(keywords)
                else if (keywords instanceof Array) return keywords.find(i => ctx.message.indexOf(i) >= 0)
                else return keywords
            },
        })
    }
    /**
     * Specify expected content types
     * @param type The expected content type(s)
     */
    type(types: string|string[]) {
        if (!(types instanceof Array)) types = [types]
        return this.derive({ 
            validate: function type(ctx: any) {
                const ctxTypes = contextTypeOf(ctx)
                for (const i of types)
                    if (ctxTypes.includes(i)) return true
                return false
            }, 
            parse: function type(ctx: any) { return contextTypeOf(ctx) },
        })
    }
    /**
     * Specify the required role
     * @param role The role
     */
    role(role: 'everyone'|'admin'|'owner'|'operator') {
        const requiredRole = ['everyone', 'admin', 'owner', 'operator'].indexOf(role)
        return this.derive({ 
            validate: async function role(ctx: any) {
                let actualRole: number
                if (config.operators.includes(ctx.user_id)) actualRole = 3
                else if (ctx.message_type !== 'group') 
                    actualRole = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo() as IMemberInfoResult).data.role)
                else actualRole = 2
                if (actualRole < requiredRole) return false
                return true
            },
        })
    }
    /**
     * Use a command for the conditions
     * @param names the commands' names
     * @param params the parameters' declaration
     * @param withPrefixes whether this Command should be called with prefixes
     */
    command(names: string|string[], params?: string, withPrefixes: boolean = true) {
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
            commands.push(new Command(`"${name}"${params ? ` ${params}` : ''}`, commandProcessor))
        return this.derive({ 
            validate: function command(ctx: any) {
                const msg = processCommandString(ctx.message)
                return commands.some(i => i.is(msg))
            }, 
            parse: async function command(ctx: any, stream: MessageStream) {
                const msg = processCommandString(ctx.message)
                return await commands.find(i => i.is(msg)).parse(msg, ctx, stream)
            },
        })
    }
    /** At only */
    at() {
        return this.derive({
            validate: function at(ctx: any) {
                if (!ctx.message.startsWith(config.atSelf)) return false
                return true
            },
        })
    }
}
