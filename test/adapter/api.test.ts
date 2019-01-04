import { CQHTTP_API } from '../../src/adapter/api'

test('API List Should Load Correctly', () => {
    expect(CQHTTP_API).toBeInstanceOf(Object)
})