import Debug from 'debug'
const debug = Debug('extra-verbose-ionjs: split')
const delimiters = ['\'', '"', '‘', '“', '’', '”']
/**
 * Split a string, by spaces, ASCII quotes and CJK quotes
 * @param string The string for splitting
 */
export function split(string: string) {
    debug(`splitting started: ${string}`)
    const result: string[] = []
    const lastItem = () => result.length - 1
    let inStr = '', escape = false
    for (const i of string) {
        let regular = false
        if (!escape) {
            if (i === '\\') escape = true
            else if (!inStr) {
                if (i === ' ') {
                    if (result[lastItem()]) {
                        result.push('')
                        debug(`(char '${i}') new item`)
                    }
                } else if (delimiters.includes(i)) {
                    inStr = i
                    debug(`(char '${i}') in string`)
                } else regular = true
            } else {
                if (delimiters.includes(i)) { 
                    inStr = ''
                    debug(`(char '${i}') out string`)
                } else regular = true
            }
        } else regular = true
        if (regular) {
            if (lastItem() >= 0) result[lastItem()] += i
            else result.push(i)
            escape = false
            debug(`(char '${i}') add to last item`)
        }
    }
    debug('splitting finished')
    return result
}