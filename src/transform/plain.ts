import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'
import { ISessionMatcher } from '../core/session'

/** Basic transformations */
export class PlainTransform implements ITransform {
    private _manager = new MiddlewareManager<IExtensibleMessage>()
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
    /** Add a parser function */
    public async transform(msg: IExtensibleMessage) {
        let finished = false
        const man = this._manager.use(async function (ctx, next) {
            finished = true
            await next()
        })
        const copy = ObjectFrom({}, msg)
        await man.runBound(copy, this)
        if (finished) return copy
        else return null
    }
}
