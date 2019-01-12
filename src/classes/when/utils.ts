import { config } from './derived'
import { sender } from '../../instances/sender'
import { MessageStream } from '../session'
import { Utils as CQCodeUtils } from '../cqcode'

export function compare(matcher: any, obj: any) {
    if (typeof matcher !== 'object' || !matcher) return matcher === obj
    else if (matcher instanceof RegExp) return matcher.test(obj)
    else 
        for (const i in matcher)
            if (!compare(matcher[i], obj[i])) return false
    return true
}

export async function commandProcessor({ arguments: args }, { parameters: params }, rawMessage: any, stream: MessageStream) {
    const paramList = [...params.required, ...Object.keys(args)].reduce((acc, val) => acc.includes(val) ? acc : [...acc, val], [])
    for (const i of paramList) {
        const rawDescription: string[] = (params.description[i] || '').split(',').reduce((acc, val) => {
            if (acc.length >= 2) return [acc[0], acc[1] + val]
            else return [...acc, val]
        }, [])
        const description = { type: rawDescription[0] || 'string', prompt: rawDescription[1] || `Enter '${i}'${rawDescription[0] ? `(include ${rawDescription[0]})` : ''}:` }
        let result = CQCodeUtils.filterType(CQCodeUtils.stringToArray(args[i] || ''), description.type)
        while (!result) {
            await sender.to(rawMessage).send(description.prompt)
            result = CQCodeUtils.filterType(CQCodeUtils.stringToArray((await stream.get()).message), description.type)
        }
        args[i] = result
    }
}

export function processCommandString(msg: string) {
    let str = CQCodeUtils.arrayToString(CQCodeUtils.stringToArray(msg).map(i => i.type === 'text' ? i : { 
        type: i.type, 
        data: Object.keys(i.data).reduce((acc, val) => {
            acc[`${val}\\\\`] = i.data[val]
            return acc
        }, {}) 
    })).trim()
    if (str.startsWith(config.atSelf)) str = str.slice(config.atSelf.length).trim()
    return str
}