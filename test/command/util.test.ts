import { escapeArgument } from '../../src/command'

test('escapeArgument()', () => {
    expect(escapeArgument('\\ \'"“”‘’')).toBe('\\\\\\ \\\'\\"\\“\\”\\‘\\’')
})