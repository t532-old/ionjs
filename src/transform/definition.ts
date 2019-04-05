import { IExtensibleMessage } from '../definition'

export interface ITransform {
    transform(ctx: IExtensibleMessage): Promise<IExtensibleMessage>|null
}
