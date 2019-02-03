import { IMessage } from '../classes/receiver'

/** IMessage that has been extended */
export type TExtensibleMessage = IMessage&{ [x: string]: any }