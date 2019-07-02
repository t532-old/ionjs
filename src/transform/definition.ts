import { IExtensibleMessage } from '../definition'

/** A transform object */
export interface ITransform {
    transform(ctx: IExtensibleMessage): Promise<IExtensibleMessage>|null
}
