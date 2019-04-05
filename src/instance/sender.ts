import { Sender } from '../platform/sender'

/** The raw sender */
export let sender: Sender

/** Initialize the sender */
export function init({ url, token }: {
    url: string,
    token?: string
}) {
    sender = new Sender(url, token)
    console.log(`[INFO] Sender initialized with post URL ${url}, ${token ? `token '${token}'` : 'no token'}`)
}
