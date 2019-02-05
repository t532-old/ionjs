import * as ionjs from '../src'

const modMdata = {
    name: 'a-module',
    author: 'anonymous',
    version: '0.1.0',
    description: 'a random module',
    registrations: ['a-registration'],
    license: 'MIT',
}
const regMdata = {
    name: 'a-registration',
    module: 'a-module',
    usage: 'a random registration',
}

test('Register Module Metadata', () => {
    expect(() => ionjs.useModuleMetadata(modMdata)).not.toThrow()
})

test('Register Registration Metadata', () => {
    expect(() => ionjs.useRegistrationMetadata(regMdata)).not.toThrow()
})

test('Get Module Metadata', () => {
    expect(ionjs.getModuleMetadata('a-module')).toBe(modMdata)
    expect(ionjs.getAllModuleMetadata()).toEqual([modMdata])
})

test('Get Registration Metadata', () => {
    expect(ionjs.getRegistrationMetadata('a-module', 'a-registration')).toBe(regMdata)
    expect(ionjs.getAllRegistrationMetadata('a-module')).toEqual([regMdata])
})