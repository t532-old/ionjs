export const CQCode = {
    Text(text: string) { return { type: 'text', data: { text } } },
    Face(id: number) { return { type: 'face', data: { id } } },
    Emoji(id: number) { return { type: 'emoji', data: { id } } },
    BFace(id: number) { return { type: 'bface', data: { id } } },
    SFace(id: number) { return { type: 'sface', data: { id } } },
    Image(file: string) { return { type: 'image', data: { file } } },
    Record(file: string, magic: boolean = false) { return { type: 'record', data: { file, magic } } },
    At(qq: number) { return { type: 'at', data: { qq } } },
    RPS() { return { type: 'rps', data: { } } },
    Dice() { return { type: 'dice', data: { } } },
    Shake() { return { type: 'shake', data: { } } },
    Anonymous(ignore: boolean = false) { return { type: 'anonymous', data: { ignore } } },
    PlatformMusic(type: 'qq'|'163'|'xiami', id: number) { return { type: 'music', data: { type, id } } },
    CustomMusic(url: string, audio: string, title: string, content?: string, image?: string) { return { type: 'music', data: { type: 'custom', url, audio, title, content, image } } },
    Share(url: string, title: string, content?: string, image?: string) { return { type: 'share', data: { url, title, content, image } } },
    isCQCodeObject(obj: any) { return typeof obj === 'object' && typeof obj.type === 'string' && typeof obj.data === 'object' && obj.data },
    isRealCQCodeObject(obj: any) { return CQCode.isCQCodeObject(obj) && obj.type !== 'text' },
    encodePlainText(str: string) { return str.replace('&', '&amp;').replace('[', '&#91;').replace(']', '&#93;') },
    decodePlainText(str: string) { return str.replace('&amp;', '&').replace('&#91;', '[').replace('&#93;', ']') },
    encodeCQCodeText(str: string) { return CQCode.encodePlainText(str).replace(',', '&#44;') },
    decodeCQCodeText(str: string) { return CQCode.decodePlainText(str).replace('&#44;', ',') },
    arrayToString(message: any[]) {
        let converted = ''
        for (let i of message) {
            if (CQCode.isRealCQCodeObject(i)) converted += `[CQ:${i.type}${Object.keys(i.data).length ? ',' : ''}${Object.keys(i.data).map(key => `${key}=${CQCode.encodeCQCodeText(i.data[key])}`).join(',')}]`
            else if (CQCode.isCQCodeObject(i)) converted += CQCode.encodePlainText(i.data.text)
            else converted += CQCode.encodePlainText(i.toString())
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
                    acc[pair[0]] = CQCode.decodeCQCodeText(pair[1])
                    return acc
                }, {})
                converted.push({ type, data })
            } else converted.push({ type: 'text', data: { text: CQCode.decodePlainText(i) } })
        }
        return converted
    },
}