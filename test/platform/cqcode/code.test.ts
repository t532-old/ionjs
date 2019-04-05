/// <reference types="jest" />
import * as Code from '../../../src/platform/cqcode/code'

const cases = {
    Text: {
        args: ['123'],
        expected: {
            type: 'text',
            data: { text: '123' },
        },
    },
    Face: {
        args: [123],
        expected: {
            type: 'face',
            data: { id: 123 },
        },
    },
    Emoji: {
        args: [123],
        expected: {
            type: 'emoji',
            data: { id: 123 },
        },
    },
    BFace: {
        args: [123],
        expected: {
            type: 'bface',
            data: { id: 123 },
        },
    },
    SFace: {
        args: [123],
        expected: {
            type: 'sface',
            data: { id: 123 },
        },
    },
    Image: {
        args: ['/path/to/img'],
        expected: {
            type: 'image',
            data: { file: '/path/to/img' },
        },
    },
    Record: {
        args: ['/path/to/audio', true],
        expected: {
            type: 'record',
            data: { file: '/path/to/audio', magic: true },
        },
    },
    At: {
        args: [1145141919],
        expected: {
            type: 'at',
            data: { qq: 1145141919 },
        },
    },
    RPS: {
        args: [],
        expected: {
            type: 'rps',
            data: { },
        },
    },
    Dice: {
        args: [],
        expected: {
            type: 'dice',
            data: { },
        },
    },
    Shake: {
        args: [],
        expected: {
            type: 'shake',
            data: { },
        },
    },
    Anonymous: {
        args: [true],
        expected: {
            type: 'anonymous',
            data: { ignore: true },
        },
    },
    PlatformMusic: {
        args: ['163', 1145141919],
        expected: {
            type: 'music',
            data: { type: '163', id: 1145141919 },
        },
    },
    CustomMusic: {
        args: ['https://url', '/path/to/audio', 'title', 'content', '/path/to/image'],
        expected: {
            type: 'music',
            data: {
                type: 'custom',
                url: 'https://url',
                audio: '/path/to/audio',
                title: 'title',
                content: 'content',
                image: '/path/to/image',
            },
        },
    },
    Share: {
        args: ['https://url', 'title', 'content', '/path/to/image'],
        expected: {
            type: 'share',
            data: {
                url: 'https://url',
                title: 'title',
                content: 'content',
                image: '/path/to/image',
            },
        },
    },
}

for (const i in cases) {
    test(`Code.${i}()`, () => {
        expect(Code[i](...cases[i].args)).toEqual(cases[i].expected)
    })
}
