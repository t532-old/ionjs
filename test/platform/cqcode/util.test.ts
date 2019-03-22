/// <reference types="jest" />
import { Util } from '../../../src/platform/cqcode'

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

test('Util.arrayToString()', () => {
    expect(Util.arrayToString(arr)).toBe(str)
})

test('Util.stringToArray()', () => {
    expect(Util.stringToArray(str)).toEqual(strictArr)
})

test('Util.filterType()', () => {
    expect(Util.filterType(strictArr, 'rawstring')).toBe(str)
    expect(Util.filterType(strictArr, 'string')).toBe(str
        .replace(/&#91;/g, '[')
        .replace(/&#93;/g, ']')
    )
    expect(Util.filterType(strictArr, 'any')).toEqual(Util.stringToArray(str))
    expect(Util.filterType(strictArr, 'image')).toEqual([strictArr[1]])
})