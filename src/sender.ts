import { Sender } from './adapter'

export let sender: Sender

export function init(url: string, token?: string) { sender = new Sender(url, token) }