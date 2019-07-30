import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import { ISessionMatcher } from '../core/session'
import { BaseTransform } from './base'

/** Basic transformations */
export class PlainTransform extends BaseTransform {
    protected _manager = new MiddlewareManager<IExtensibleMessage>()
    /** Deep-copy a Transform object */
    public static from(last: PlainTransform) {
        const next = new PlainTransform()
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    /** Add a plain middleware to transformation */
    public use(mw: IMiddleware<IExtensibleMessage>) {
        const next = PlainTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
    /** Add a validation function */
    public validate(fn: ISessionMatcher<IExtensibleMessage>) {
        return this.use(async function (ctx, next) {
            if (await fn(ctx)) next()
        })
    }
}
