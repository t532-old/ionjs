import { Receiver } from '../platform/receiver'
import * as Signale from 'signale'
const logger = Signale.scope('receiver')

/** The raw receiver */
export let receiver: Receiver

let receivePort: number
/**
 * Initialize the reciever
 * @param port The port the receiver'll listen to
 * @param secret CQHTTP's secret
 */
export function init({ port, secret }: {
    port: number,
    secret?: string
}) {
    receivePort = port
    receiver = new Receiver(secret)
    logger.info(`Receiver initialized with port ${port}, ${secret ? `secret '${secret}'` : 'no secret'}`)
}

/** Let the receiver start listening */
export function start() {
    receiver.listen(receivePort)
    logger.start(`Your application is running on http://localhost:${receivePort}`)
}
