/// <reference types="jest" />
import { SingleSessionManager } from '../../src/session/single'
import { EventEmitter } from 'events'
import { spy } from 'sinon'
let manager: SingleSessionManager
const bus = new EventEmitter()
interface ITestContext {
    id: number
    data: any
}

function wasteTime(time = 500) { return new Promise(resolve => setTimeout(resolve, time)) }

test('Create SingleSessionManager', () => {
    expect(() => manager = new SingleSessionManager((ctx: ITestContext) => ctx.id)).not.toThrow()
})

test('Use Session Templates', () => {
    expect(() => manager.use(async stream => {
        bus.emit('dummy')
        while (1) await stream.get()
    }, (i: ITestContext) => i.data.startsWith('a'))).not.toThrow()
    expect(() => manager.use(async stream => {
        bus.emit('first:start')
        while (1) {
            let ctx
            try { ctx = await stream.get() }
            catch (err) { return }
            bus.emit(`first:get:${ctx.id}-${ctx.data}`, ctx)
        }
    }, (i: ITestContext) => i.data.startsWith('a'))).not.toThrow()
    expect(() => manager.use(async stream => {
        const ctx = await stream.get()
        bus.emit('second', ctx)
        stream.free()
    }, (i: ITestContext) => i.data.startsWith('ab'), true)).not.toThrow()
})

test('Run Plain Sessions Correctly', async () => {
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

test('Run Override Sessions', async () => {
    expect.assertions(5)
    const happened = spy()
    const template = { id: 1, data: 'ab' }
    bus.on('second', ctx => expect(ctx).toBe(template))
    bus.on('first:start', () => happened())
    bus.on('first:get:1-ab', () => happened())
    for (let i = 0; i < 4; i++) await manager.run(template)
    expect(happened.notCalled).toBe(true)
    await wasteTime()
})

test('Prevent Running Corresponding Sessions', async () => {
    expect.assertions(6)
    const firstHappened = spy(), dummyHappened = spy()
    const template = { id: 1, data: 'a1' }
    bus.on('first:start', () => firstHappened())
    bus.on('first:get:1-a1', ctx => expect(ctx).toBe(template))
    bus.on('dummy', () => dummyHappened())
    for (let i = 0; i < 4; i++) await manager.run(template)
    expect(firstHappened.calledOnce).toBe(true)
    expect(dummyHappened.notCalled).toBe(true)
    await wasteTime()
})