import { Receiver } from './adapter'

export let receiver: Receiver

let receivePort: number
export function init(port: number, secret?: string) { 
    receivePort = port
    receiver = new Receiver(secret)
}

export function start() { receiver.listen(receivePort) }
