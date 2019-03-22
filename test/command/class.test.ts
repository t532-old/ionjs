/// <reference types="jest" />
import { Command } from '../../src/command'

test('Command#is()', () => {
    const instance = new Command('name')
    expect(instance.is('name')).toBe(true)
    expect(instance.is('not_this')).toBe(false)
})

test('Command#parse() (required params)', () => {
    const instance = new Command('name <param>')
    expect(instance.parse('name arg')).toEqual({
        arguments: { param: 'arg' },
        options: [],
        rest: [],
    })
    expect(() => instance.parse('name')).toThrow()
})

test('Command#parse() (key-value-paired ordered params)', () => {
    const instance = new Command('name <param1> <param2>')
    expect(instance.parse('name param2=arg2 param1=arg1')).toEqual({
        arguments: {
            param1: 'arg1',
            param2: 'arg2',
        },
        options: [],
        rest: [],
    })
})

test('Command#parse() (key-value-paired unordered params)', () => {
    const instance = new Command('name [?param]')
    expect(instance.parse('name param=arg')).toEqual({
        arguments: { param: 'arg' },
        options: [],
        rest: [],
    })
    expect(instance.parse('name arg')).toEqual({
        arguments: {},
        options: [],
        rest: ['arg'],
    })
})

test('Command#parse() (aliased params)', () => {
    const instance = new Command('name <param1> <param2(#)>')
    expect(instance.parse('name #arg2 arg1')).toEqual({
        arguments: {
            param1: 'arg1',
            param2: 'arg2',
        },
        options: [],
        rest: [],
    })
})

test('Command#parse() (params with default values)', () => {
    const instance = new Command('name <param>=defaultarg')
    expect(instance.parse('name')).toEqual({
        arguments: { param: 'defaultarg' },
        options: [],
        rest: [],
    })
})

test('Command#parse() (options)', () => {
    const instance = new Command('name --opt')
    expect(instance.parse('name --opt')).toEqual({
        arguments: {},
        options: ['--opt'],
        rest: [],
    })
    expect(instance.parse('name --not-opt')).toEqual({
        arguments: {},
        options: [],
        rest: ['--not-opt'],
    })
})

test('Command#parse() (various delimiters)', () => {
    const instance = new Command('name <param>')
    expect(instance.parse('name escaped\\\\\\ \\\'\\"\\“\\”\\‘\\’')).toEqual({
        arguments: { param: 'escaped\\ \'"“”‘’' },
        options: [],
        rest: [],
    })
    expect(instance.parse('name \'single quoted\'')).toEqual({
        arguments: { param: 'single quoted' },
        options: [],
        rest: [],
    })
    expect(instance.parse('name "double quoted"')).toEqual({
        arguments: { param: 'double quoted' },
        options: [],
        rest: [],
    })
    expect(instance.parse('name ‘CJK single quoted’')).toEqual({
        arguments: { param: 'CJK single quoted' },
        options: [],
        rest: [],
    })
    expect(instance.parse('name “CJK double quoted”')).toEqual({
        arguments: { param: 'CJK double quoted' },
        options: [],
        rest: [],
    })
})

test('get Command#parameters', () => {
    const instance = new Command(`name
        <required>
        <aliased(?)>
        <default>=value
        <?unordered>
        [optional]
        --opt
    `)
    expect(instance.parameters.aliases.get('aliased')).toBe('?')
    expect(instance.parameters.defaults.get('default')).toBe('value')
    expect(instance.parameters.ordered).toEqual(['required', 'aliased', 'default', 'optional'])
    expect(instance.parameters.required).toEqual(['required', 'aliased', 'default', 'unordered'])
})

test('Command#toString', () => {
    const desc = `name <required> <aliased(?)> <default>=value <?unordered> [optional] --opt`
    const instance = new Command(desc)
    expect(instance.toString()).toBe(desc)
})