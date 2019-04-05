import { ICQCode, ICQCodeArray } from './definition'
import { Text } from './code'

export function isCQCodeObject(obj: any): obj is ICQCode { return typeof obj === 'object' && typeof obj.type === 'string' && typeof obj.data === 'object' && obj.data }
export function isRealCQCodeObject(obj: any) { return isCQCodeObject(obj) && obj.type !== 'text' }
export function encodePlainText(str: string) { return str.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;') }
export function decodePlainText(str: string) { return str.replace(/&amp;/g, '&').replace(/&#91;/g, '[').replace(/&#93;/g, ']') } // lgtm [js/double-escaping]
export function encodeCQCodeText(str: string) { return encodePlainText(str).replace(/,/g, '&#44;') }export function decodeCQCodeText(str: string) { return decodePlainText(str).replace(/&#44;/g, ',') }
export function toString(message: ICQCodeArray|string) {
    if (typeof message === 'string') return message
    else {
        let converted = ''
        for (const i of message) {
            if (isCQCodeObject(i)) {
                if (isRealCQCodeObject(i)) converted += `[CQ:${i.type}${Object.keys(i.data).length ? ',' : ''}${Object.keys(i.data).map(key => `${key}=${encodeCQCodeText((i as ICQCode).data[key].toString())}`).join(',')}]`
                else converted += encodePlainText(i.data.text)
            }
            else converted += encodePlainText(i.toString())
        }
        return converted
    }
}
export function toArray(message: ICQCodeArray|string): ICQCode[] {
    if (message instanceof Array)
        return Array.from(message)
            .map(i => typeof i === 'string' ? Text(i) : i)
            .filter(i => isCQCodeObject(i))
    else {
        const splitted = message.split(/(?=\[)|(?<=\])/)
        const converted = []
        for (const i of splitted) {
            const matched = i.match(/\[CQ:(.+?)(?:,(.+?))?\]/)
            if (matched) {
                const [, type, rawData] = matched
                const data = rawData.split(',').reduce((acc, val) => {
                    const pair = val.split('=')
                    acc[pair[0]] = decodeCQCodeText(pair[1])
                    return acc
                }, {})
                converted.push({ type, data })
            } else converted.push(Text(decodePlainText(i)))
        }
        return converted
    }
}
export function pick(message: ICQCodeArray|string, ...type: string[]) { return toArray(message).filter(i => type.includes(i.type)) }
export function pickFirst(message: ICQCodeArray|string, ...type: string[]) { return toArray(message).find(i => type.includes(i.type)) || null }
export function pickLast(message: ICQCodeArray|string, ...type: string[]) { return toArray(message).reverse().find(i => type.includes(i.type)) || null }
export function pickPlainText(message: ICQCodeArray|string) { return pick(message, 'text').map(i => i.data.text).join('') }
export function filter(message: ICQCodeArray|string, ...type: string[]) { return toArray(message).filter(i => !type.includes(i.type)) }
export function filterFirst(message: ICQCodeArray|string, ...type: string[]) {
    const result = toArray(message)
    result.splice(result.findIndex(i => type.includes(i.type)), 1 )
    return result
}
export function filterLast(message: ICQCodeArray|string, ...type: string[]) {
    const result = toArray(message).reverse()
    result.splice(result.findIndex(i => type.includes(i.type)), 1)
    return result.reverse()
}
export function isAll(message: ICQCodeArray|string, ...type: string[]) { return toArray(message).every(i => type.includes(i.type)) }
export function isStructure(message: ICQCodeArray|string, structure: string[]) { return toArray(message).every((i, k) => structure[k] === i.type) }
export function isAllPlainText(message: ICQCodeArray|string) { return toArray(message).every(i => i.type === 'text') }
