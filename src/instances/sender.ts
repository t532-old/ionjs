import { Sender } from '../classes/sender'

/** The raw sender */
let _sender: Sender

export function sender() { return _sender }

/** Initialize the sender */
export function init(url: string, token?: string) {
    _sender = new Sender(url, token)
    console.log(`[INFO] Sender initialized with post URL ${url}, ${token ? `token '${token}'` : 'no token'}`)
}