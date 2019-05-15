import { ICQCodeArray } from './definition'
import { isCQCodeObject } from './util'
import { Text } from './code'

export function cq(text: string[], ...codes: any[]) {
    const result: ICQCodeArray = []
    for (const i in text) {
        if (text[i]) result.push(Text(text[i]))
        if (isCQCodeObject(codes[i])) result.push(codes[i])
        else result.push(Text(String(codes[i])))
    }
    result.pop()
    return result
}
