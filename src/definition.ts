import { IMessage } from './platform/receiver'

/** IMessage that has been extended */
export interface IExtensibleMessage extends IMessage {
    [x: string]: any
}
