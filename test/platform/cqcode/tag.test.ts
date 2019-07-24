/// <reference types="jest" />
import { cq } from '../../../src/platform/cqcode/tag'
import * as Code from '../../../src/platform/cqcode/code'

test('cq`...` (Plain String)', () => {
    expect(cq`abc123`).toEqual([{
        type: 'text',
        data: { text: 'abc123' },
    }])
})

test('cq`...` (Template String)', () => {
    expect(cq`abc${123}456${true}`).toEqual([{
        type: 'text',
        data: { text: 'abc' },
    }, {
        type: 'text',
        data: { text: '123' },
    }, {
        type: 'text',
        data: { text: '456' },
    }, {
        type: 'text',
        data: { text: 'true' },
    }])
})

test('cq`...` (CQCode)', () => {
    expect(cq`abc${Code.Emoji(233)}`).toEqual([{
        type: 'text',
        data: { text: 'abc' },
    }, {
        type: 'emoji',
        data: { id: 233 },
    }])
})
