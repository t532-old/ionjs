/// <reference types="jest" />
import { Utils } from '../../../src/classes/cqcode/utils'

const str = '123&#91;&#93;[CQ:image,file=/path/to/image]456',
    strictArr = [{
        type: 'text',
        data: { text: '123[]' },
    }, {
        type: 'image',
        data: { file: '/path/to/image' },
    }, {
        type: 'text',
        data: { text: '456' },
    }],
    arr = [strictArr[0], strictArr[1], strictArr[2].data.text]

test('Utils.arrayToString()', () => {
    expect(Utils.arrayToString(arr)).toBe(str)
})

test('Utils.stringToArray()', () => {
    expect(Utils.stringToArray(str)).toEqual(strictArr)
})

test('Utils.filterType()', () => {
    expect(Utils.filterType(strictArr, 'rawstring')).toBe(str)
    expect(Utils.filterType(strictArr, 'string')).toBe(str
        .replace(/&#91;/g, '[')
        .replace(/&#93;/g, ']')
    )
    expect(Utils.filterType(strictArr, 'any')).toEqual(Utils.stringToArray(str))
    expect(Utils.filterType(strictArr, 'image')).toEqual([strictArr[1]])
})