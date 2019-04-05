import { escapeArgument } from '../../../src/util/command'

test('escapeArgument()', () => {
    expect(escapeArgument('\\ \'"“”‘’')).toBe('\\\\\\ \\\'\\"\\“\\”\\‘\\’')
})
