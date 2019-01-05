/// <reference types="jest" />
import { CQHTTP_API } from '../../src/adapter/api'

test('Load API List', () => {
    expect(CQHTTP_API).toBeInstanceOf(Object)
})