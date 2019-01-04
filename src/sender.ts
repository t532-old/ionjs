import { Sender } from './adapter'

/** The raw sender */
export let sender: Sender

/** Initialize the sender */
export function init(url: string, token?: string) { sender = new Sender(url, token) }