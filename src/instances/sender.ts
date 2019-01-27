import { Sender } from '../classes/sender'

/** The raw sender */
export let sender: Sender

/** Initialize the sender */
export function init(url: string, token?: string) {
    sender = new Sender(url, token)
    console.log(`[INFO] Sender initialized with post URL ${url}, ${token ? `token '${token}'` : 'no token'}`)
}