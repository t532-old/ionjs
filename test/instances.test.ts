/// <reference types="jest" />
import * as ionjs from '../src'
import axios from 'axios'
import { EventEmitter } from 'events'
import { IMessage } from '../src/classes/receiver'

const PORT_OFFSET = 0
const bus = new EventEmitter()

test('Initialize bot', () => {
    expect(() => {
        ionjs.init({
            receivePort: 8080 + PORT_OFFSET,
            sendURL: `http://localhost:${5700 + PORT_OFFSET}`,
            operators: [114514],
            self: 1919810,
        })
    }).not.toThrow()
})

test('Start server', () => {
    expect(() => ionjs.start()).not.toThrow()
})

test('Use Middleware', async done => {
    expect(() => ionjs.useMiddleware(async (ctx, next) => {
        expect(typeof ctx.message).toBe('string')
        await next()
        done()
    })).not.toThrow()
    axios.post(`http://localhost:${8080 + PORT_OFFSET}`, { message: [] })
})

test('Create Session Manager', () => {
    expect(() =>
        ionjs.createSessionManager('a-new-one', ctx => ctx.message)
    ).not.toThrow()
})

test('Register Session', () => {
    expect(() =>
        ionjs.useSession(ionjs.when().ever()) (
            async function(ctx) {
                await ctx.forward('test-concurrent')
                bus.emit('session', ctx.init.raw)
            }
        )
    ).not.toThrow()
    expect(() =>
        ionjs.useSession(ionjs.when().match({ message: /concurrent/ }), { concurrent: true }) (
            async function(ctx) { bus.emit('session-concurrent', ctx.init.raw) }
        )
    ).not.toThrow()
    expect(() =>
        ionjs.useSession(ionjs.when().ever(), { identifier: 'not-exist' }) (
            async function(ctx) { bus.emit('session-concurrent', ctx.init.raw) }
        )
    ).toThrow()
})

test('Run Session', async (done) => {
    const ctx = { post_type: 'message', message_type: 'private', user_id: 114514, message: 'test' },
          concurrentCtx = { post_type: 'message', message_type: 'private', user_id: 114514, message: 'test-concurrent' }
    await ionjs.runSession(ctx as IMessage)
    bus.on('session', received => {
        expect(received).toEqual(ctx)
    })
    bus.on('session-concurrent', received => {
        expect(received).toEqual(concurrentCtx)
    })
    setTimeout(done, 500)
})