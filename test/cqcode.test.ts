/// <reference types="jest" />
import { Codes, Utils } from '../src/classes/cqcode'

for (const i in Codes)
    if (i[0] === i[0].toUpperCase())
        test(`Generate CQCode ${i}()`, () => {
            expect(() => Codes[i]()).not.toThrow()
            expect(Codes[i]()).toEqual({ type: expect.any(String), data: expect.any(Object) })
        })

test(`Encode/Decode CQCode`, () => {
    const dec = '&[a,b]', plainEnc = '&amp;&#91;a,b&#93;', codeEnc = '&amp;&#91;a&#44;b&#93;'
    expect(Utils.encodePlainText(dec)).toBe(plainEnc)
    expect(Utils.decodePlainText(plainEnc)).toBe(dec)
    expect(Utils.encodeCQCodeText(dec)).toBe(codeEnc)
    expect(Utils.decodeCQCodeText(codeEnc)).toBe(dec)
})

test(`Form CQCode`, () => {
    const arr = [{ type: 'text', data: { text: 'abc' } }, { type: 'at', data: { qq: '1145141919810' } }]
    const str = 'abc[CQ:at,qq=1145141919810]'
    expect(Utils.arrayToString(arr)).toBe(str)
    expect(Utils.stringToArray(str)).toEqual(arr)
})

test(`Filter CQCode Types`, () => {
    const arr = [{ type: 'text', data: { text: 'abc' } }, { type: 'at', data: { qq: '1145141919810' } }]
    const raw = 'abc[CQ:at,qq=1145141919810]', str = 'abc[CQ:at,qq=1145141919810]', any = { type: 'text', data: { text: 'abc' } }
    expect(Utils.filterType(arr, 'raw')).toBe(raw)
    expect(Utils.filterType(arr, 'string')).toBe(str)
    expect(Utils.filterType(arr, 'any')).toEqual(any)
    expect(Utils.filterType(arr, 'text')).toEqual({ type: 'text', data: { text: 'abc' } })
})
