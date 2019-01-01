import Debug from 'debug'
const debug = Debug('extra-verbose-ionjs: split')
/**
 * Split a string, by specific separators and delimiters
 * @param string The string for splitting
 * @param chars separators and delimiters
 */
export function split(string: string, { separators = [' '], delimiters = ['\'', '"', '‘', '“', '’', '”', ['‘', '’'], ['’', '‘'], ['“', '”'], ['”', '“']] }: { separators?: string[], delimiters?: (string[]|string)[] } = {}) {
    delimiters = delimiters.map(i => i instanceof Array ? i : [i, i])
    const preDelimiters = delimiters.map(i => i[0]),
          postDelimiters = delimiters.map(i => i[1])
    debug(`splitting started: ${string}`)
    const result: string[] = []
    const lastItem = () => result.length - 1
    let inStr = '', escape = false
    for (const i of string) {
        let regular = false
        if (!escape) {
            if (i === '\\') escape = true
            else if (!inStr) {
                if (separators.includes(i)) {
                    if (result[lastItem()]) {
                        result.push('')
                        debug(`(char '${i}') new item`)
                    }
                } else if (preDelimiters.includes(i)) {
                    inStr = i
                    debug(`(char '${i}') in string`)
                } else regular = true
            } else {
                const preDelimitersPos = preDelimiters.map((char, pos) => ({ char, pos })).filter(item => item.char === inStr).map(i => i.pos),
                      postDelimitersPos = postDelimiters.map((char, pos) => ({ char, pos })).filter(item => item.char === i).map(i => i.pos)
                if (preDelimitersPos.some(i => postDelimitersPos.includes(i))) { 
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