/// <reference types="jest" />
import { ConcurrentSessionManager } from '../src/classes/session/concurrent'
import { EventEmitter } from 'events'
import { spy } from 'sinon'
const bus = new EventEmitter()
interface ITestContext {
    id: number
    data: any
}
let manager: ConcurrentSessionManager<ITestContext>

function wasteTime(time = 100) { return new Promise(resolve => setTimeout(resolve, time)) }

test('Create ConcurrentSessionManager', () => {
    expect(() => manager = new ConcurrentSessionManager((ctx: ITestContext) => ctx.id)).not.toThrow()
})

test('Use Session Templates', () => {
    expect(() => manager.use(async stream => {
        bus.emit('first:start')
        while (1) {
            const ctx = await stream.get()
            bus.emit(`first:get:${ctx.id}-${ctx.data}`, ctx)
        }
    }, (i: ITestContext) => i.data.startsWith('a'))).not.toThrow()
    expect(() => manager.use(async stream => {
        const ctx = await stream.get()
        bus.emit('second', ctx)
        stream.free()
    }, (i: ITestContext) => i.data.startsWith('ab'))).not.toThrow()
})

test('Run Sessions Correctly', async () => {
    expect.assertions(9)
    const happened = spy()
    const template1 = { id: 1, data: 'a' }, template2 = { id: 2, data: 'a' }
    bus.on('first:start', () => happened())
    bus.on('first:get:1-a', ctx => expect(ctx).toBe(template1))
    bus.on('first:get:2-a', ctx => expect(ctx).toBe(template2))
    for (let i = 0; i < 4; i++) await manager.run(template1)
    for (let i = 0; i < 4; i++) await manager.run(template2)
    expect(happened.calledTwice).toBe(true)
    await wasteTime()
})

test('Run Sessions Concurrently', async () => {
    expect.assertions(9)
    const happened = spy()
    const template = { id: 1, data: 'ab' }
    bus.on('second', ctx => expect(ctx).toBe(template))
    bus.on('first:start', () => happened())
    bus.on('first:get:1-ab', ctx => expect(ctx).toBe(template))
    for (let i = 0; i < 4; i++) await manager.run(template)
    expect(happened.notCalled).toBe(true)
    await wasteTime()
})