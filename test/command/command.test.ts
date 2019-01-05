/// <reference types="jest" />
import { Command, CommandParseError } from '../../src/command/command'
let command: Command

test('Create Command', () => {
    expect(() => command = new Command('comm <a> <b>=1 [c(@)] [?d] --option')).not.toThrow()
})

test('Check Command Name', () => {
    expect(command.is('comm')).toBe(true)
    expect(command.is('not_this')).toBe(false)
})

test('Parse Regular Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever')).arguments.a).toBe('whatever')
})

test('Parse Default Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever')).arguments.b).toBe('1')
})

test('Parse Aliased Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever @i_am_aliased')).arguments.c).toBe('i_am_aliased')
})

test('Parse Key-Value Pair Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever b=i_am_paired')).arguments.b).toBe('i_am_paired')
})

test('Parse Unordered Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever whatever whatever d=value whatever')).arguments.d).toBe('value')
})

test('Parse Rest Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever whatever whatever whatever whatever')).rest).toContain('whatever')
})

test('Parse Options', async () => {
    expect.assertions(1)
    expect((await command.parse('comm whatever --option')).options).toContain('--option')
})

test('Split Quoted Strings', async () => {
    expect.assertions(1)
    expect((await command.parse('comm "a b"')).arguments.a).toBe('a b')
})

test('Split Escaped Strings', async () => {
    expect.assertions(1)
    expect((await command.parse('comm \\"a\\ b\\"\\\\')).arguments.a).toBe('"a b"\\')
})

test('Create Command With Processors', () => {
    expect(() => command = new Command('comm <a>:description', async function processor(args, { parameters: params }) {
        args.arguments.a = `${params.description.a}:${args.arguments.a}`
    })).not.toThrow()
})

test('Parse Descripted Args', async () => {
    expect.assertions(1)
    expect((await command.parse('comm a')).arguments.a).toBe('description:a')
})