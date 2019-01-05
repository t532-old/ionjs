import { Sender } from '../../src/adapter/sender'
import * as Koa from 'koa'
import * as koaBody from 'koa-bodyparser'
declare module "koa" {
    interface Request {
        body: any
        rawBody: string
    }
}
const special = ['constructor', 'to', '_post', '_checkContext']
const token = Math.random().toString()
let sender: Sender

const fakeServer = new Koa().use(koaBody()).use(ctx => {
    ctx.assert(ctx.request.headers['authorization'] !== undefined, 401)
    ctx.assert(ctx.request.headers['authorization'] === `Token ${token}`, 403)
    if (ctx.request.body.title === '__test_fail__') ctx.body = { status: 'failed', retcode: -1 }
    else ctx.body = { status: 'success', retcode: 0 }
}).listen(5700)

test('Create Sender', () => {
    expect(() => sender = new Sender('http://localhost:5700', token)).not.toThrow()
})

test(`Send ill-formed message`, async () => {
    expect.assertions(1)
    try { await sender.setSpecialTitle('__test_fail__') }
    catch (err) { expect(err).not.toBeUndefined() }
})

for (const i of Object.getOwnPropertyNames(Sender.prototype))
    if (!special.includes(i))
        test(`Send ${i}`, async () => {
            expect.assertions(1)
            const result = await sender.to({
                message_type: 'group',
                request_type: 'friend',
            })[i]([])
            expect(result.status).toBe('success')
        })