import { Sender } from '../platform/sender'
import Signale from 'signale'
const logger = Signale.scope('sender')

/** The raw sender */
export let sender: Sender

/** Initialize the sender */
export function init({ url, token }: {
    url: string,
    token?: string
}) {
    sender = new Sender(url, token)
    logger.info(`Sender initialized with post URL ${url}, ${token ? `token '${token}'` : 'no token'}`)
}
