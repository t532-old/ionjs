const delimiters = ['\'', '"', '‘', '“', '’', '”']
const delimitersRegex = new RegExp(`([${delimiters.join('')}])`, 'g')
/**
 * Split a string, by spaces, ASCII quotes and CJK quotes
 * @param string The string for splitting
 */
export function split(string: string) {
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
                    }
                } else if (delimiters.includes(i)) {
                    inStr = i
                } else regular = true
            } else {
                if (delimiters.includes(i)) {
                    inStr = ''
                } else regular = true
            }
        } else regular = true
        if (regular) {
            if (lastItem() >= 0) result[lastItem()] += i
            else result.push(i)
            escape = false
        }
    }
    return result
}

/**
 * escape a string so that it is a legal command argument
 * @param str The string that needs to be escaped
 */
export function escapeArgument(str: string) {
    return str.replace(delimitersRegex, '\\$1').replace(' ', '\\ ')
}