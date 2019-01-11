import { When } from './base'
import { compare, commandProcessor, processCommandString } from './utils'
import { TValidator, TParser } from './definitions'
import { sender } from '@/instances/sender'
import { Command } from '@/classes/command'
import { MessageStream } from '@/classes/session'
import { contextTypeOf } from '@/classes/receiver'
import { IMemberInfoResult } from '@/classes/sender'

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
        config.atSelf = `[CQ:at,qq:${self}]`
    }
    static register(name: string, method: Function) { BotWhen.prototype[name] = method }
    deriveWithClass(obj: { validate?: TValidator, parse?: TParser }) { return this.derive(obj, BotWhen) }
    /** Return a When instance with no conditions */
    ever() { return this.deriveWithClass({}) }
    /** Add the raw message to the parsed result */
    raw() { 
        function raw(ctx: any) { return ctx }
        return this.deriveWithClass({ parse: raw })
    }
    /**
     * Add a custom matcher
     * @param condition the matcher
     */
    match(condition: any) {
        function validate(ctx: any) { return compare(condition, ctx) }
        return this.deriveWithClass({ validate })
    }
    /**
     * Check if a message contains one of the keywords
     * @param keywords the keywords
     */
    contain(keywords: RegExp|string|string[]) {
        function validate(ctx: any) {
            if (keywords instanceof RegExp) return keywords.test(ctx.message)
            else if (keywords instanceof Array) return keywords.some(i => ctx.message.indexOf(i) >= 0)
            else return ctx.message.indexOf(keywords) >= 0
        }
        function contain(ctx: any) {
            if (keywords instanceof RegExp) return ctx.message.match(keywords)
            else if (keywords instanceof Array) return keywords.find(i => ctx.message.indexOf(i) >= 0)
            else return keywords
        }
        return this.deriveWithClass({ validate, parse: contain })
    }
    /**
     * Specify expected content types
     * @param type The expected content type(s)
     */
    type(types: string|string[]) {
        if (!(types instanceof Array)) types = [types]
        function validate(ctx: any) {
            const ctxTypes = contextTypeOf(ctx)
            for (const i of types)
                if (ctxTypes.includes(i)) return true
            return false
        }
        function type(ctx: any) { return contextTypeOf(ctx) }
        return this.deriveWithClass({ validate, parse: type })
    }
    /**
     * Specify the permission level
     * @param level The level
     */
    permission(level: 'everyone'|'admin'|'owner'|'operator') {
        const requiredLevel = ['everyone', 'admin', 'owner', 'operator'].indexOf(level)
        async function validate(ctx: any) {
            let actualLevel: number
            if (config.operators.includes(ctx.user_id)) actualLevel = 3
            else if (ctx.message_type !== 'group') 
                actualLevel = ['member', 'admin', 'owner'].indexOf((await sender.to(ctx).getInfo() as IMemberInfoResult).data.role)
            else actualLevel = 2
            if (actualLevel < requiredLevel) return false
            return true
        }
        return this.deriveWithClass({ validate })
    }
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
        const commands: Command[] = []
        for (const name of names)
            commands.push(new Command(`"${name}" ${params}`, commandProcessor))
        function validate(ctx: any) {
            const msg = processCommandString(ctx.message)
            return commands.some(i => i.is(msg))
        }
        async function command(ctx: any, stream: MessageStream) {
            const msg = processCommandString(ctx.message)
            return await commands.find(i => i.is(msg)).parse(msg, ctx, stream)
        }
        return this.deriveWithClass({ validate, parse: command })
    }
    /** At only */
    at() {
        function validate(ctx: any) {
            if (!ctx.message.startsWith(config.atSelf)) return false
            return true
        }
        return this.deriveWithClass({ validate })
    }
}