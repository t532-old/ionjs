/// <reference types="jest" />
import { init, load } from '../src'
import axios from 'axios'
import { EventEmitter } from 'events'
import * as Koa from 'koa'
import * as koaBody from 'koa-bodyparser'
import * as ionjs from '@ionjs/core'

const PORT_OFFSET = 4
const bus = new EventEmitter()
new Koa().use(koaBody()).use(async ctx => {
    bus.emit(ctx.request.body.flag, ctx.request.body)
    ctx.status = 200
    console.log(ctx.body)
}).listen(5700 + PORT_OFFSET)
function wasteTime(time = 100) { return new Promise(resolve => setTimeout(resolve, time)) }

ionjs.init({
    receivePort: 8080 + PORT_OFFSET,
    sendURL: `http://localhost:${5700 + PORT_OFFSET}`,
    self: 1919810,
})
ionjs.start()

test('Initialize', () => {
    expect(() => init()).not.toThrow()
    expect(() => init({
        friend: true,
        groupAdd: true,
        groupInvite: false,
        userBlacklist: id => id % 2 ? true : false,
        groupBlacklist: id => id % 2 ? false : true,
    })).not.toThrow()
    expect(() => init({
        friend: true,
        groupAdd: true,
        groupInvite: true,
        userBlacklist: [1919810],
        groupBlacklist: [114514],
    })).not.toThrow()
})

test('Register', () => {
    expect(() => {
        load(ionjs)
    }).not.toThrow()
})

test('Request Friend', async (done) => {
    bus.on('01', ctx => {
        expect(ctx).toEqual({ flag: '01', approve: true, remark: '' })
    })
    bus.on('02', ctx => {
        expect(ctx).toEqual({ flag: '02', approve: false, remark: '' })
        done()
    })
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '01',
        user_id: 114514,
        post_type: 'request',
        request_type: 'friend',
    })
    await wasteTime()
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '02',
        user_id: 1919810,
        post_type: 'request',
        request_type: 'friend',
    })
})

test('Request Group Add', async (done) => {
    bus.on('03', ctx => {
        expect(ctx).toEqual({ flag: '03', approve: false, remark: '' })
    })
    bus.on('04', ctx => {
        expect(ctx).toEqual({ flag: '04', approve: false, remark: '' })
    })
    bus.on('05', ctx => {
        expect(ctx).toEqual({ flag: '05', approve: true, remark: '' })
        done()
    })
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '03',
        user_id: 114514,
        group_id: 114514,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'add',
    })
    await wasteTime()
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '04',
        user_id: 1919810,
        group_id: 1919810,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'add',
    })
    await wasteTime()
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '05',
        user_id: 114514893,
        group_id: 8931919810,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'add',
    })
})

test('Request Group Invite', async (done) => {
    bus.on('06', ctx => {
        expect(ctx).toEqual({ flag: '06', approve: false, remark: '' })
    })
    bus.on('07', ctx => {
        expect(ctx).toEqual({ flag: '07', approve: false, remark: '' })
    })
    bus.on('08', ctx => {
        expect(ctx).toEqual({ flag: '08', approve: true, remark: '' })
        done()
    })
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '06',
        user_id: 114514,
        group_id: 114514,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'invite',
    })
    await wasteTime()
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '07',
        user_id: 1919810,
        group_id: 1919810,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'invite',
    })
    await wasteTime()
    await axios.post(`http://localhost:${8080 + PORT_OFFSET}`, {
        flag: '08',
        user_id: 114514893,
        group_id: 8931919810,
        post_type: 'request',
        request_type: 'group',
        sub_type: 'invite',
    })
})