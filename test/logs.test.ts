import * as ionjs from '../src'
import axios from 'axios'
const PORT_OFFSET = 4

ionjs.init({
    receivePort: 8080 + PORT_OFFSET,
    sendURL: `http://localhost:${5700 + PORT_OFFSET}`,
    self: 114514,
    middlewareTimeout: 400,
})
ionjs.useMiddleware(async (ctx, next) => {
    if (ctx.message === 'mw-timeout') setTimeout(next, 500)
    else await next()
})
ionjs.useMiddleware(async (ctx, next) => {
    if (ctx.message === 'mw-throw') throw new Error()
    else await next()
})
ionjs.useSession(ionjs.when.ever()) (
    async function() {
        throw new Error()
    }
)
ionjs.start()

test('Middleware timeout', async (done) => {
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, { message: 'mw-timeout' })
    setTimeout(done, 600)
})

test('Session error', async (done) => {
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, { message: 'session-throw', post_type: 'message' })
    setTimeout(done, 600)
})

test('Middleware error', async (done) => {
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, { message: 'mw-throw' })
    setTimeout(done, 600)
})


