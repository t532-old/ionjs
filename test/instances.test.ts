import * as ionjs from '../src'
import { EventEmitter } from 'events'

const bus = new EventEmitter

test('Initialize bot', () => {
    expect(() => ionjs.init({
        receivePort: 8080,
        sendURL: 'http://localhost:5700',
        operators: [114514],
        self: 1919810,
    })).not.toThrow()
})

test('Create Session Manager', () => {
    expect(() =>
        ionjs.createSessionManager('a-new-one', ctx => ctx.message)
    ).not.toThrow()
})

test('Register Session', () => {
    expect(() =>
        ionjs.useSession(ionjs.when.ever()) (
            async function(ctx) { 
                await ctx.forward('test-concurrent')
                bus.emit('session', ctx.init.raw) 
            }
        )
    ).not.toThrow()
    expect(() =>
        ionjs.useSession(ionjs.when.match({ message: /concurrent/ }), { concurrent: true }) (
            async function(ctx) { bus.emit('session-concurrent', ctx.init.raw) }
        )
    ).not.toThrow()
    expect(() =>
        ionjs.useSession(ionjs.when.ever(), { identifier: 'not-exist' }) (
            async function(ctx) { bus.emit('session-concurrent', ctx.init.raw) }
        )
    ).toThrow()
})

test('Run Session', async (done) => {
    const ctx = { post_type: 'message', message_type: 'private', user_id: 114514, message: 'test' },
          concurrentCtx = { post_type: 'message', message_type: 'private', user_id: 114514, message: 'test-concurrent' }
    await ionjs.runSession(ctx)
    bus.on('session', received => {
        expect(received).toEqual(ctx)
    })
    bus.on('session-concurrent', received => {
        expect(received).toEqual(concurrentCtx)
    })
    setTimeout(done, 500)
})