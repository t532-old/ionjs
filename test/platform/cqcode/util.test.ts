/// <reference types="jest" />
import * as Util from '../../../src/platform/cqcode/util'

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

test('Util.toString()', () => {
    expect(Util.toString(str)).toBe(str)
    expect(Util.toString(arr)).toBe(str)
})

test('Util.toArray()', () => {
    expect(Util.toArray(str)).toEqual(strictArr)
    expect(Util.toArray(arr)).toEqual(strictArr)
    expect(Util.toArray(strictArr)).toEqual(strictArr)
})

const conversions = {
    pick: {
        args: [arr, 'text'],
        expected: [{
            type: 'text',
            data: { text: '123[]' },
        }, {
            type: 'text',
            data: { text: '456' },
        }],
    },
    pickFirst: {
        args: [arr, 'text'],
        expected: {
            type: 'text',
            data: { text: '123[]' },
        },
    },
    pickLast: {
        args: [arr, 'text'],
        expected: {
            type: 'text',
            data: { text: '456' },
        },
    },
    pickPlainText: {
        args: [arr],
        expected: '123[]456',
    },
    filter: {
        args: [arr, 'text'],
        expected: [{
            type: 'image',
            data: { file: '/path/to/image' },
        }],
    },
    filterFirst: {
        args: [arr, 'text'],
        expected: [{
            type: 'image',
            data: { file: '/path/to/image' },
        }, {
            type: 'text',
            data: { text: '456' },
        }],
    },
    filterLast: {
        args: [arr, 'text'],
        expected: [{
            type: 'text',
            data: { text: '123[]' },
        }, {
            type: 'image',
            data: { file: '/path/to/image' },
        }],
    },
}

for (const cv in conversions) {
    test(`Util.${cv}()`, () => {
        expect(Util[cv](...conversions[cv].args)).toEqual(conversions[cv].expected)
    })
}

test('Util.isAll()', () => {
    expect(Util.isAll(arr, 'text')).toBe(false)
    expect(Util.isAll(Util.pick(arr, 'text'), 'text')).toBe(true)
})

test('Util.isStructure()', () => {
    expect(Util.isStructure(arr, ['text', 'text'])).toBe(false)
    expect(Util.isStructure(Util.pick(arr, 'text'), ['text', 'text'])).toBe(true)
})

test('Util.isAllPlainText()', () => {
    expect(Util.isAllPlainText(arr)).toBe(false)
    expect(Util.isAllPlainText(Util.pick(arr, 'text'))).toBe(true)
})
