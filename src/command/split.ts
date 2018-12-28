import Debug from 'debug'
const debug = Debug('extra-verbose-ionjs: split')
/**
 * Split a string, by spaces, ASCII quotes and CJK quotes (Both single and double)
 * @param string The string for splitting
 */
export function split(string: string) {
    debug(`splitting started: ${string}`)
    const result: string[] = []
    const lastItem = () => result.length - 1
    let inStr = ''
    for (const i of string) {
        if (!inStr) {
            if (i === ' ') {
                if (result[lastItem()]) {
                    result.push('')
                    debug(`(char '${i}') new item`)
                }
            } else if (/["“”'‘’]/.test(i)) {
                inStr = i
                debug(`(char '${i}') in string`)
            } else {
                if (lastItem() >= 0) result[lastItem()] += i
                else result.push(i)
                debug(`(char '${i}') add to last item`)
            }
        } else {
            if (i === inStr || 
                (inStr === '“' && i === '”') ||
                (inStr === '‘' && i === '’') ||
                (inStr === '”' && i === '“') ||
                (inStr === '’' && i === '‘')
            ) {
                inStr = ''
                debug(`(char '${i}') out string`)
            } else {
                if (lastItem() >= 0) result[lastItem()] += i
                else result.push(i)
                debug(`(char '${i}') add to last item`)
            }
        }
    }
    debug('splitting finished')
    return result
}