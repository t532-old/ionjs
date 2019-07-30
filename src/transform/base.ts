import { ITransform } from './definition'
import { MiddlewareManager } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import merge from 'deepmerge'

export abstract class BaseTransform implements ITransform {
    protected _manager: MiddlewareManager<IExtensibleMessage>
    public async transform(msg: IExtensibleMessage) {
        let finished = false
        const man = this._manager.use(async function (ctx, next) {
            finished = true
            await next()
        })
        const copy = merge({}, msg)
        await man.runBound(copy, this)
        if (finished) return copy
        else return null
    }
}
