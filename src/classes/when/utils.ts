import { sender } from '../../instances/sender'
import { MessageStream } from '../session'
import { Utils as Utils } from '../cqcode'
import { TExtensibleMessage } from '../../instances/definitions'
import { escapeArgument, ICommandArguments } from '../command'
import { TValidator } from './definitions'

export function compare(matcher: any, obj: any) {
    if (matcher instanceof RegExp) return matcher.test(obj)
    else if (matcher instanceof Function) return matcher(obj)
    else if (typeof matcher !== 'object' || !matcher) return matcher === obj
    else
        for (const i in matcher)
            if (!compare(matcher[i], obj[i])) return false
    return true
}

export function processCommandString(msg: string, atSelf: string) {
    let str = Utils.arrayToString(Utils.stringToArray(msg).map(i => i.type === 'text' ? i : {
        type: i.type,
        data: Object.keys(i.data).reduce((acc, val) => {
            acc[`${val}\\\\`] = escapeArgument(i.data[val])
            return acc
        }, {})
    })).trim().replace(/\[/g, '"[').replace(/\]/g, ']"')
    const escapedAtSelf = atSelf.replace(/=/g, '\\\\=')
    if (str.startsWith(escapedAtSelf)) str = str.slice(escapedAtSelf.length).trim()
    return str
}

export async function processArgs(
    { arguments: args }: Record<keyof ICommandArguments, any>,
    notGiven: string[],
    { prompts, types, validators }: {
        prompts: { [param: string]: string },
        types: { [param: string]: string },
        validators: { [param: string]: TValidator },
    },
    { init, stream }: {
        init: TExtensibleMessage,
        stream: MessageStream<TExtensibleMessage>
    }
) {
    notGiven = [
        ...notGiven,
        ...Object.keys(args).filter(i => !Utils.filterType(Utils.stringToArray(args[i]), types[i] || 'string')),
        ...Object.keys(args).filter(i => validators[i]).filter(i => {
            const data = Utils.filterType(Utils.stringToArray(args[i]), types[i] || 'string')
            return data && validators[i](data)
        })
    ]
    for (const i of notGiven) {
        const prompt = prompts[i] || prompts.$default.replace(/\{\}/g, i)
        await sender.to(init).send(prompt)
        args[i] = await stream.get(async ({ message }) => {
            const converted = Utils.filterType(Utils.stringToArray(message), types[i] || 'string')
            if (!converted) return false
            if (validators[i]) return validators[i](converted)
            else return true
        })
    }
    for (const i in args) args[i] = Utils.filterType(Utils.stringToArray(args[i]), types[i] || 'string')
}