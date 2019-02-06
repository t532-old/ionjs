import { init, start, sender, useModuleMetadata, useRegistrationMetadata } from '@ionjs/core'

init({
    receivePort: 8080,
    sendURL: 'http://localhost:5700',
    self: 1145141919,
    prefixes: ['!', '！', '/', '／', '']
})

setInterval(async () => {
    try { await sender.to({ message_type: 'private', user_id: 1002647525 }).send('哇') }
    catch (err) { console.error(err) }
}, 10 * 1000)

require('./plugins/timeout')
require('./plugins/usage')
require('./plugins/tuling')
require('./plugins/repeater')
require('./plugins/weather')

start()