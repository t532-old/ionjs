/// <reference types="jest" />
import { MiddlewareManager } from '../src/classes/middleware'
let manager: MiddlewareManager

test('Create MiddlewareManager', () => {
    expect(() => manager = new MiddlewareManager()).not.toThrow()
})

test('Use Middlewares', () => {
    expect(() => manager.use(async (ctx, next) => {
        ctx.i--
        await next()
    }).use(async (ctx, next) => {
        if (ctx.i) await next()
    })).not.toThrow()
})

test('Use Middlewares (Last)', () => {
    expect(() => manager.useLast(async (ctx, next) => {
        ctx.finished = true
        await next()
    })).not.toThrow()
})

test('Run Middlewares', async () => {
    expect.assertions(4)
    const first = { i: 2, finished: false }, second = { i: 1, finished: false }
    await manager.run(first)
    expect(first.i).toBe(1)
    expect(first.finished).toBe(true)
    await manager.run(second)
    expect(second.i).toBe(0)
    expect(second.finished).toBe(false)
})