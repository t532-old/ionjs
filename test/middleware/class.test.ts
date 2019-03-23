/// <reference types="jest" />
import { MiddlewareManager } from '../../src/middleware'
import { spy as Spy } from 'sinon'

test('MiddlewareManager() (construct from existing instance)', async () => {
    expect.assertions(2)
    const mgr = new MiddlewareManager<{ processed: boolean }>()
    mgr.use(async (ctx, next) => {
        await next()
    })
    const nextMgr = new MiddlewareManager(mgr)
    nextMgr.use(async (ctx, next) => {
        ctx.processed = true
    })
    const ctx = { processed: false }
    await mgr.run(ctx)
    expect(ctx.processed).toBe(false)
    await nextMgr.run(ctx)
    expect(ctx.processed).toBe(true)
})

test('MiddlewareManager#use() (flow control)', async () => {
    expect.assertions(2)
    const mgr = new MiddlewareManager<number>()
    const spy = Spy()
    mgr.use(async (ctx, next) => {
        if (ctx) await next()
    }).use(spy)
    await mgr.run(0)
    expect(spy.notCalled).toBe(true)
    await mgr.run(1)
    expect (spy.calledOnce).toBe(true)
})

test('MiddlewareManager#use() (properties modifying)', async () => {
    expect.assertions(1)
    const mgr = new MiddlewareManager<{ processed: boolean }>(),
        ctx = { processed: false }
    mgr.use(async (ctx, next) => {
        ctx.processed = true
    })
    await mgr.run(ctx)
    expect(ctx.processed).toBe(true)
})

test('MiddlewareManager#useLast()', async () => {
    expect.assertions(2)
    const mgr = new MiddlewareManager<number>()
    const spy = Spy()
    mgr.useLast(spy).use(async (ctx, next) => {
        if (ctx) await next()
    })
    await mgr.run(0)
    expect(spy.notCalled).toBe(true)
    await mgr.run(1)
    expect (spy.calledOnce).toBe(true)
})

test('get MiddlewareManager#length', () => {
    const mgr = new MiddlewareManager<void>()
    expect(mgr.length).toBe(0)
    mgr.use(() => {}).useLast(() => {})
    expect(mgr.length).toBe(2)
})