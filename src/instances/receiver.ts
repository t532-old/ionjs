import { Receiver } from '../classes/receiver'

/** The raw receiver */
export let receiver: Receiver

let receivePort: number
/**
 * Initialize the reciever
 * @param port The port the receiver'll listen to
 * @param secret CQHTTP's secret
 */
export function init(port: number, secret?: string) { 
    receivePort = port
    receiver = new Receiver(secret)
}

/** Let the receiver start listening */
export function start() { receiver.listen(receivePort) }
