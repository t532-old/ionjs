/// <reference types="jest" />
import { Command } from '../../../src/util/command'

test('Command#is()', () => {
    const instance = new Command('name', 'name2')
    expect(instance.is('name')).toBe(true)
    expect(instance.is('name2')).toBe(true)
    expect(instance.is('not_this')).toBe(false)
})

test('Command#parse() (required params)', () => {
    const instance = new Command('name').param('param')
    expect(instance.parse('name arg')).toEqual({
        arguments: { param: 'arg' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(() => instance.parse('name')).toThrow()
})

test('Command#parse() (key-value-paired ordered params)', () => {
    const instance = new Command('name').param('param1').param('param2')
    expect(instance.parse('name param2=arg2 param1=arg1')).toEqual({
        arguments: {
            param1: 'arg1',
            param2: 'arg2',
        },
        options: [],
        rest: [],
        name: 'name',
    })
})

test('Command#parse() (key-value-paired unordered params)', () => {
    const instance = new Command('name').param('param', { optional: true, unordered: true })
    expect(instance.parse('name param=arg')).toEqual({
        arguments: { param: 'arg' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name arg')).toEqual({
        arguments: {},
        options: [],
        rest: ['arg'],
        name: 'name',
    })
})

test('Command#parse() (aliased params)', () => {
    const instance = new Command('name').param('param1').param('param2', { alias: '#' })
    expect(instance.parse('name #arg2 arg1')).toEqual({
        arguments: {
            param1: 'arg1',
            param2: 'arg2',
        },
        options: [],
        rest: [],
        name: 'name',
    })
})

test('Command#parse() (params with default values)', () => {
    const instance = new Command('name').param('param', { defaultVal: 'defaultarg' })
    expect(instance.parse('name')).toEqual({
        arguments: { param: 'defaultarg' },
        options: [],
        rest: [],
        name: 'name',
    })
})

test('Command#parse() (options)', () => {
    const instance = new Command('name').option('--opt')
    expect(instance.parse('name --opt')).toEqual({
        arguments: {},
        options: ['--opt'],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name --not-opt')).toEqual({
        arguments: {},
        options: [],
        rest: ['--not-opt'],
        name: 'name',
    })
})

test('Command#parse() (various delimiters)', () => {
    const instance = new Command('name').param('param')
    expect(instance.parse('name escaped\\\\\\ \\\'\\"\\“\\”\\‘\\’')).toEqual({
        arguments: { param: 'escaped\\ \'"“”‘’' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name \'single quoted\'')).toEqual({
        arguments: { param: 'single quoted' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name "double quoted"')).toEqual({
        arguments: { param: 'double quoted' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name ‘CJK single quoted’')).toEqual({
        arguments: { param: 'CJK single quoted' },
        options: [],
        rest: [],
        name: 'name',
    })
    expect(instance.parse('name “CJK double quoted”')).toEqual({
        arguments: { param: 'CJK double quoted' },
        options: [],
        rest: [],
        name: 'name',
    })
})
