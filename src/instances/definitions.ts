import { IMessage } from '../classes/receiver'
import { Sender, ISendResult } from '../classes/sender'
import { MessageStream } from '../classes/session'
import { ICQCode } from '../classes/cqcode'

/** IMessage that has been extended */
export type TExtensibleMessage = IMessage&{ [x: string]: any }

/** Contexts that'll be passed into essions */
export interface ISessionContext {
    /** The first context */
    init: { [x: string]: any }
    /** Sender bound to this.init.raw */
    sender: Sender
    /** Stream of messages */
    stream: MessageStream<TExtensibleMessage>
    /** Get a copy of the next message from this.stream */
    get(condition?: (ctx: IMessage) => boolean): Promise<TExtensibleMessage>
    /** Reply to user */
    reply(...message: (string|ICQCode)[]): Promise<ISendResult> 
    /** Question user and get an answer */
    question(...prompt: (string|ICQCode)[]): Promise<TExtensibleMessage>
    /** Forward to other sessions */
    forward(...message: (string|ICQCode)[]): Promise<void[]>
}