import { escapeArgument } from '../../../src/classes/command/utils'

test('escapeArgument()', () => {
    expect(escapeArgument('\\ \'"“”‘’')).toBe('\\\\\\ \\\'\\"\\“\\”\\‘\\’')
})