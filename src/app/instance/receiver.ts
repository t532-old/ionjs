import { Receiver } from '../../platform/receiver'

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
    console.log(`[INFO] Receiver initialized with port ${port}, ${secret ? `secret '${secret}'` : 'no secret'}`)
}

/** Let the receiver start listening */
export function start() {
    receiver.listen(receivePort)
    console.log(`[INFO] Your application is running on http://localhost:${receivePort}`)
}
