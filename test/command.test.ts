/// <reference types="jest" />
import { Command, CommandParseError } from '../src/classes/command'
let command: Command

test('Create Command', () => {
    expect(() => command = new Command('comm <a> <b>=1 [c(@)] [?d] --option')).not.toThrow()
})

test('Check Command Name', () => {
    expect(command.is('comm')).toBe(true)
    expect(command.is('not_this')).toBe(false)
})

test('Parse Regular Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever').arguments.a).toBe('whatever')
})

test('Parse Default Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever').arguments.b).toBe('1')
})

test('Parse Aliased Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever @i_am_aliased').arguments.c).toBe('i_am_aliased')
})

test('Parse Key-Value Pair Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever b=i_am_paired').arguments.b).toBe('i_am_paired')
})

test('Parse Unordered Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever whatever whatever d=value whatever').arguments.d).toBe('value')
})

test('Parse Rest Args', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever whatever whatever whatever whatever').rest).toContain('whatever')
})

test('Parse Options', () => {
    expect.assertions(1)
    expect(command.parse('comm whatever --option').options).toContain('--option')
})

test('Split Quoted Strings', () => {
    expect.assertions(1)
    expect(command.parse('comm "a b"').arguments.a).toBe('a b')
})

test('Split Escaped Strings', () => {
    expect.assertions(1)
    expect(command.parse('comm \\"a\\ b\\"\\\\').arguments.a).toBe('"a b"\\')
})

test('Name Error', () => {
    expect(() => command.parse('not_this a')).toThrow()
})

test('Arg Error', () => {
    expect(() => command.parse('comm')).toThrow()
})