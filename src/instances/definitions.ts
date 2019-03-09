import { IMessage } from '../classes/receiver'

/** IMessage that has been extended */
export interface IExtensibleMessage extends IMessage {
    [x: string]: any
}