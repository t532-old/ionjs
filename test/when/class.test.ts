/// <reference types="jest" />
import { When } from '../../src/when'
import { spy as Spy } from 'sinon'

test('When#validate() (basic)', async () => {
    expect.assertions(2)
    const when = new When<number>().validate(i => i ? true : false)
    expect(await when.process(1)).toBe(1)
    expect(await when.process(0)).toBe(null)
})

test('When#validate() (callbacks)', async () => {
    expect.assertions(2)
    const success = Spy(), failure = Spy()
    const when = new When<number>().validate(i => i ? true : false, { success, failure })
    await when.process(1)
    await when.process(0)
    expect(success.calledOnce).toBe(true)
    expect(failure.calledOnce).toBe(true)
})

test('When#parse()', async () => {
    expect.assertions(1)
    const when = new When<{ parsed: boolean }>().parse(ctx => ctx.parsed = true)
    expect(await when.process({ parsed: false })).toEqual({ parsed: true })
})
