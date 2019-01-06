/// <reference types="jest" />
import { CQCode } from '../../src/adapter/cqcode'

for (const i in CQCode)
    if (i[0] === i[0].toUpperCase())
        test(`Generate CQCode ${i}()`, () => {
            expect(() => CQCode[i]()).not.toThrow()
            expect(CQCode[i]()).toEqual({ type: expect.any(String), data: expect.any(Object) })
        })

test(`Encode/Decode CQCode`, () => {
    const dec = '&[a,b]', plainEnc = '&amp;&#91;a,b&#93;', codeEnc = '&amp;&#91;a&#44;b&#93;'
    expect(CQCode.encodePlainText(dec)).toBe(plainEnc)
    expect(CQCode.decodePlainText(plainEnc)).toBe(dec)
    expect(CQCode.encodeCQCodeText(dec)).toBe(codeEnc)
    expect(CQCode.decodeCQCodeText(codeEnc)).toBe(dec)
})

test(`Form CQCode`, () => {
    const arr = [{ type: 'text', data: { text: 'abc' } }, { type: 'at', data: { qq: '1145141919810' } }]
    const str = 'abc[CQ:at,qq=1145141919810]'
    expect(CQCode.arrayToString(arr)).toBe(str)
    expect(CQCode.stringToArray(str)).toEqual(arr)
})

test(`Filter CQCode Types`, () => {
    const arr = [{ type: 'text', data: { text: 'abc' } }, { type: 'at', data: { qq: '1145141919810' } }]
    const raw = 'abc[CQ:at,qq=1145141919810]', str = 'abc[CQ:at,qq=1145141919810]', any = { type: 'text', data: { text: 'abc' } }
    expect(CQCode.filterType(arr, 'raw')).toBe(raw)
    expect(CQCode.filterType(arr, 'string')).toBe(str)
    expect(CQCode.filterType(arr, 'any')).toEqual(any)
    expect(CQCode.filterType(arr, 'text')).toEqual({ text: 'abc' })
})
