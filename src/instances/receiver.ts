import { Receiver } from '../classes/receiver'

/** The raw receiver */
let _receiver: Receiver

let receivePort: number

export function receiver() { return _receiver }

/**
 * Initialize the reciever
 * @param port The port the receiver'll listen to
 * @param secret CQHTTP's secret
 */
export function init(port: number, secret?: string) {
    receivePort = port
    _receiver = new Receiver(secret)
    console.log(`[INFO] Receiver initialized with port ${port}, ${secret ? `secret '${secret}'` : 'no secret'}`)
}

/** Let the receiver start listening */
export function start() {
    _receiver.listen(receivePort)
    console.log(`[INFO] Your application is running on http://localhost:${receivePort}`)
}
