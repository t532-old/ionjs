import { ICQCode } from './definitions'
export const Utils = {
    isCQCodeObject(obj: any): obj is ICQCode { return typeof obj === 'object' && typeof obj.type === 'string' && typeof obj.data === 'object' && obj.data },
    isRealCQCodeObject(obj: any) { return Utils.isCQCodeObject(obj) && obj.type !== 'text' },
    encodePlainText(str: string) { return str.replace(/&/g, '&amp;').replace(/\[/g, '&#91;').replace(/\]/g, '&#93;') },
    decodePlainText(str: string) { return str.replace(/&amp;/g, '&').replace(/&#91;/g, '[').replace(/&#93;/g, ']') }, // lgtm [js/double-escaping]
    encodeCQCodeText(str: string) { return Utils.encodePlainText(str).replace(/,/g, '&#44;') },
    decodeCQCodeText(str: string) { return Utils.decodePlainText(str).replace(/&#44;/g, ',') },
    arrayToString(message: (ICQCode|string)[]) {
        let converted = ''
        for (const i of message) {
            if (Utils.isCQCodeObject(i)) {
                if (Utils.isRealCQCodeObject(i)) converted += `[CQ:${i.type}${Object.keys(i.data).length ? ',' : ''}${Object.keys(i.data).map(key => `${key}=${Utils.encodeCQCodeText((i as ICQCode).data[key].toString())}`).join(',')}]`
                else converted += Utils.encodePlainText(i.data.text)
            }
            else converted += Utils.encodePlainText(i.toString())
        }
        return converted
    },
    stringToArray(message: string) {
        const splitted = message.split(/(?=\[)|(?<=\])/)
        const converted = []
        for (const i of splitted) {
            const matched = i.match(/\[CQ:(.+?)(?:,(.+?))?\]/)
            if (matched) {
                const [, type, rawData] = matched
                const data = rawData.split(',').reduce((acc, val) => {
                    const pair = val.split('=')
                    acc[pair[0]] = Utils.decodeCQCodeText(pair[1])
                    return acc
                }, {})
                converted.push({ type, data })
            } else converted.push({ type: 'text', data: { text: Utils.decodePlainText(i) } })
        }
        return converted
    },
    filterType(message: ICQCode[], type: string) {
        if (type === 'rawstring') return Utils.arrayToString(message)
        else if (type === 'string') return Utils.decodePlainText(Utils.arrayToString(message))
        else if (type === 'any') return message
        else return message.filter(i => i.type === type)
    }
}