import { ConcurrentSessionManager } from '../../../src/core/session'
import { EventEmitter } from 'events'
import { spy as Spy } from 'sinon'

interface IDummyContext {
    content: string
    id: number
}

const eventBus = new EventEmitter()

test('ConcurrentSessionManager#run() (continuous fetching)', async done => {
    const ID = 0,
        TRIGGER_CONTENT = 'trigger test',
        EXTRA_CONTENT = 'test',
        END_CONTENT = 'end test'
    let cnt = Spy(), ended = Spy()
    const man = new ConcurrentSessionManager<IDummyContext>(i => i.id)
        .use(async (stream, _, trigger) => {
            const ctx = await stream.get()
            cnt()
            expect(ctx).toBe(trigger)
            while (true) {
                const ctx = await stream.get()
                cnt()
                if (ctx.content === END_CONTENT) {
                    ended()
                    eventBus.emit('end: continuous fetching')
                    break
                }
            }
        }, i => i.content === TRIGGER_CONTENT)
    eventBus.once('end: continuous fetching', () => {
        expect(cnt.callCount).toBe(3)
        expect(ended.called).toBe(true)
        done()
    })
    await man.run({
        content: TRIGGER_CONTENT,
        id: ID,
    })
    await man.run({
        content: EXTRA_CONTENT,
        id: ID,
    })
    await man.run({
        content: END_CONTENT,
        id: ID,
    })
})

test('ConcurrentSessionManager#run() (concurrent fetching)', async done => {
    const ID = 0,
        TRIGGER_FIRST = 'trigger 1st',
        TRIGGER_SECOND = 'trigger 2nd'
    let started = Spy()
    const man = new ConcurrentSessionManager<IDummyContext>(i => i.id)
        .use(async stream => {
            expect((await stream.get()).content).toBe(TRIGGER_FIRST)
            expect((await stream.get()).content).toBe(TRIGGER_SECOND)
            eventBus.emit('end: concurrent fetching')
        }, i => i.content === TRIGGER_FIRST)
        .use(async stream => {
            expect((await stream.get()).content).toBe(TRIGGER_SECOND)
            eventBus.emit('end: concurrent fetching')
        }, i => i.content === TRIGGER_SECOND)
    eventBus.once('end: concurrent fetching', () => {
        expect(started.called).toBe(false)
        done()
    })
    await man.run({
        content: TRIGGER_FIRST,
        id: ID,
    })
    await man.run({
        content: TRIGGER_SECOND,
        id: ID,
    })
})

test('ConcurrentSessionManager#run() (fetching other streams)', async done => {
    const ID_FIRST = 0,
        ID_SECOND = 1,
        TRIGGER_MESSAGE = 'trigger test',
        EXTRA_MESSAGE = 'test'
    let msg = []
    const man = new ConcurrentSessionManager<IDummyContext>(i => i.id)
        .use(async (stream, streamOf) => {
            const anotherStream = streamOf({ id: ID_SECOND })
            msg.push(await stream.get())
            msg.push(await anotherStream.get())
            eventBus.emit('end: fetching other streams')
        }, i => i.content === TRIGGER_MESSAGE)
    eventBus.once('end: fetching other streams', () => {
        expect(msg[0].content).toBe(TRIGGER_MESSAGE)
        expect(msg[1].content).toBe(EXTRA_MESSAGE)
        done()
    })
    await man.run({
        content: TRIGGER_MESSAGE,
        id: ID_FIRST,
    })
    await man.run({
        content: EXTRA_MESSAGE,
        id: ID_SECOND,
    })
})
