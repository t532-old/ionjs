/// <reference types="jest" />
import { BotWhen } from '../src/classes/when'
import { processCommandString } from '../src/classes/when/utils'
let when: BotWhen

test('Create BotWhen instance', () => expect(() => when = new BotWhen()).not.toThrow())

test('Init BotWhen', () => {
    BotWhen.init({
        operators: [114514],
        prefixes: ['!'],
        self: 1919810,
    })
})

test('Validator: Forever', async () => {
    expect.assertions(2)
    expect(() => when = new BotWhen().ever()).not.toThrow()
    expect(await when.validate(111)).toBeTruthy()
})

test('Parser: Raw', async () => {
    expect.assertions(2)
    expect(() => when = new BotWhen().raw()).not.toThrow()
    expect((await when.parse(111)).raw).toBe(111)
})

test('Validator: Match', async () => {
    expect.assertions(3)
    expect(() => when = new BotWhen().match({
        a: /abc.+/,
        b: 893,
        c(c) { return c < Infinity },
    })).not.toThrow()
    expect(await when.validate({ a: 'abcxyz', b: 893, c: 1e10 })).toBeTruthy()
    expect(await when.validate({ a: 'abcxyz', b: 893, c: Infinity })).toBeFalsy()
})

test('Validator & Parser: Contain', async () => {
    expect.assertions(5)
    expect(() => when = new BotWhen().contain('abc', 'xyz')).not.toThrow()
    expect(await when.validate({ message: 'abc!' })).toBeTruthy()
    expect(await when.validate({ message: 'abc_!xyz' })).toBeTruthy()
    expect(await when.validate({ message: 'ab!c_x$yz' })).toBeFalsy()
    expect((await when.parse({ message: 'abc!!' })).contain).toContain('abc')
})

test('Validator & Parser: Type', async () => {
    expect.assertions(5)
    expect(() => when = new BotWhen().type('message/private', 'meta_event')).not.toThrow()
    expect(await when.validate({ post_type: 'message', message_type: 'private' })).toBeTruthy()
    expect(await when.validate({ post_type: 'meta_event' })).toBeTruthy()
    expect(await when.validate({ post_type: 'notice' })).toBeFalsy()
    expect((await when.parse({ post_type: 'meta_event' })).type).toContain('meta_event')
})

test('Validator: At', async () => {
    expect.assertions(3)
    expect(() => when = new BotWhen().at()).not.toThrow()
    expect(await when.validate({ message: '[CQ:at,qq=1919810]' })).toBeTruthy()
    expect(await when.validate({ message: '[CQ:at,qq=114514]' })).toBeFalsy()
})

test('Validator & Parser: Role (Only Creation Call)', () => {
    for (const i of ['everyone', 'admin', 'owner', 'operator']) {
        expect(() => when = new BotWhen().role(i as 'everyone'|'admin'|'owner'|'operator')).not.toThrow()
    }
})

test('Validator & Parser: Command', async () => {
    expect.assertions(2)
    let commWhen: BotWhen
    expect(() => commWhen = new BotWhen().command(['name_a', 'name_b'], '<arg> <arg2> [arg3]=良いよ来いよ', {
        types: {
            arg: 'raw',
            arg2: 'array',
        },
        prompts: { arg2: 'GIVE THIS PARAMETER: arg2' },
    })).not.toThrow()
    expect((await commWhen.parse({ message: '!name_a 1 2' })).command.arguments).toEqual({
        arg: '1',
        arg2: [{ type: 'text', data: { text: '2' } }],
        arg3: '良いよ来いよ'
    })
})

test('Repeating Validators and Parsers', () => {
    expect(() => when = new BotWhen().command('dummy').command(['name_a', 'name_b'], '<arg> <arg2> [arg3($)]=良いよ来いよ')).not.toThrow()
})

test('Utilities: processCommandString', () => {
    expect(processCommandString('a [CQ:at,qq="1"] b="c"')).toBe('a "[CQ:at,qq\\\\=\\"1\\"]" b="c"')
})