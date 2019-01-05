import { Receiver } from '../../src/adapter/receiver'
import * as Koa from 'koa'
import axios from 'axios'
import { createHmac } from 'crypto'
const fakeServer = new Koa()
let receiver: Receiver
const secret = Math.random().toString()

test('Create Receiver', () => {
    expect(() => receiver = new Receiver(secret)).not.toThrow()
})

test('Listen on 8080', () => {
    expect(() => receiver.listen(8080)).not.toThrow()
})

test('Return 401 When No X-Signature', async () => {
    expect.assertions(1)
    try { await axios.post('http://localhost:8080') }
    catch (err) { expect(err.response.status).toBe(401) }
})

test('Return 403 When Wrong X-Signature', async () => {
    expect.assertions(1)
    try { await axios.post('http://localhost:8080', {}, { headers: { 'x-signature': 'sha1=whatever' } }) }
    catch (err) { expect(err.response.status).toBe(403) }
})

test('Handle Event Types', async () => {
    expect.assertions(4)
    const post = {
        post_type: 'fake_post',
        meta_event_type: 'unit_test',
        sub_type: 'fake_sub_type',
    }
    receiver.once('post', ctx => expect(ctx).toMatchObject(post))
    receiver.once('fake_post', ctx => expect(ctx).toMatchObject(post))
    receiver.once('fake_post/unit_test', ctx => expect(ctx).toMatchObject(post))
    receiver.once('fake_post/unit_test/fake_sub_type', ctx => expect(ctx).toMatchObject(post))
    await axios.post('http://localhost:8080', post, { headers: {'x-signature': `sha1=${createHmac('sha1', secret).update(JSON.stringify(post)).digest('hex')}`} })
})