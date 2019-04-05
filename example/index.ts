import { init, start, sender } from '@ionjs/core'

init({
    receivePort: 8080,
    sendURL: 'http://localhost:5700',
    self: 114514893,
    operators: [1919810],
    prefixes: ['!', '！', '/', '／', '']
})

setInterval(async () => {
    try { await sender.to({ message_type: 'private', user_id: 1919810 }).send('哇') }
    catch (err) { console.error(err) }
}, 10 * 1000)

require('./modules/timeout')
require('./modules/usage')
require('./modules/tuling')
require('./modules/repeater')
require('./modules/weather')

start()
