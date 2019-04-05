import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'

export class PrefixTransform implements ITransform {
    public static from(last: PrefixTransform) {
        const next = new PrefixTransform(last._qqid)
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    public constructor(qqid: number) {
        this._qqid = qqid
        this._atStr = `[CQ:at,qq=${qqid}]`
    }
    private readonly _qqid: number
    private readonly _atStr: string
    private _manager = new MiddlewareManager<IExtensibleMessage>()
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = PrefixTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
    public withString(...strings: string[]) {
        return this._derive(async function (ctx, next) {
            const sliceLen = (strings.find(i => ctx.message.startsWith(i)) || '').length
            ctx.message = ctx.message.slice(sliceLen)
            await next()
        })
    }
    public mustWithString(...strings: string[]) {
        return this._derive(async function (ctx, next) {
            const sliceLen = (strings.find(i => ctx.message.startsWith(i)) || '').length
            if (sliceLen) {
                ctx.message = ctx.message.slice(sliceLen)
                await next()
            }
        })
    }
    public withRegex(regex: RegExp) {
        return this._derive(async function (ctx, next) {
            const matched = ctx.message.match(regex)
            if (matched && matched.index === 0)
                ctx.message = ctx.message.slice(matched[0].length)
            await next()
        })
    }
    public mustWithRegex(regex: RegExp) {
        return this._derive(async function (ctx, next) {
            const matched = ctx.message.match(regex)
            if (matched && matched.index === 0) {
                ctx.message = ctx.message.slice(matched[0].length)
                await next()
            }
        })
    }
    public withAt() {
        return this._derive(async function (ctx, next) {
            if (ctx.message.startsWith(this._atStr))
                ctx.message = ctx.message.slice(this._atStr.length)
            await next()
        })
    }
    public mustWithAt() {
        return this._derive(async function (ctx, next) {
            if (ctx.message.startsWith(this._atStr)) {
                ctx.message = ctx.message.slice(this._atStr.length)
                await next()
            }
        })
    }
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