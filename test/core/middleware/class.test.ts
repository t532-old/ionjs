/// <reference types="jest" />
import { MiddlewareManager } from '../../../src/core/middleware'
import { spy as Spy } from 'sinon'

test('MiddlewareManager.from() (construct from existing instance)', async () => {
    expect.assertions(2)
    let mgr = new MiddlewareManager<{ processed: boolean }>()
        .use(async (ctx, next) => {
            await next()
        })
    let nextMgr = MiddlewareManager.from(mgr)
        .use(async (ctx, next) => {
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
    let mgr = new MiddlewareManager<number>()
    const spy = Spy()
    mgr = mgr.use(async (ctx, next) => {
        if (ctx) await next()
    }).use(spy)
    await mgr.run(0)
    expect(spy.notCalled).toBe(true)
    await mgr.run(1)
    expect (spy.calledOnce).toBe(true)
})

test('MiddlewareManager#use() (properties modifying)', async () => {
    expect.assertions(1)
    let mgr = new MiddlewareManager<{ processed: boolean }>()
    const ctx = { processed: false }
    mgr = mgr.use(async (ctx, next) => {
        ctx.processed = true
    })
    await mgr.run(ctx)
    expect(ctx.processed).toBe(true)
})

test('MiddlewareManager#useLast()', async () => {
    expect.assertions(2)
    let mgr = new MiddlewareManager<number>()
    const spy = Spy()
    mgr = mgr.useLast(spy).use(async (ctx, next) => {
        if (ctx) await next()
    })
    await mgr.run(0)
    expect(spy.notCalled).toBe(true)
    await mgr.run(1)
    expect (spy.calledOnce).toBe(true)
})

test('MiddlewareManager#runBound()', async () => {
    expect.assertions(1)
    let mgr = new MiddlewareManager<void>()
    mgr = mgr.use(async function (ctx, next) {
        this.processed = true
    })
    const thisRef = { processed: false }
    await mgr.runBound(null, thisRef)
    expect(thisRef.processed).toBe(true)
})

test('get MiddlewareManager#length', () => {
    let mgr = new MiddlewareManager<void>()
    expect(mgr.length).toBe(0)
    mgr = mgr.use(() => {}).useLast(() => {})
    expect(mgr.length).toBe(2)
})
