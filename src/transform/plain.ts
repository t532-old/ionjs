import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'
import { ISessionMatcher } from '../core/session'

export class PlainTransform implements ITransform {
    public static from(last: PlainTransform) {
        const next = new PlainTransform()
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    private _manager = new MiddlewareManager<IExtensibleMessage>()
    public use(mw: IMiddleware<IExtensibleMessage>) {
        const next = PlainTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
    public validate(fn: ISessionMatcher<IExtensibleMessage>) {
        return this.use(async function (ctx, next) {
            if (await fn(ctx)) next()
        })
    }
    public async transform(msg: IExtensibleMessage) {
        let finished = false
        const man = this._manager.use(async function (ctx, next) {
            finished = true
            await next()
        })
        const copy = ObjectFrom({}, msg)
        await man.run(copy)
        if (finished) return copy
        else return null
    }
}