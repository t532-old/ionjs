import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import { BaseTransform } from './base'

/** Transformations for recognizing messages' prefixes */
export class PrefixTransform extends BaseTransform {
    private readonly _qqid: number
    private readonly _atStr: string
    protected _manager = new MiddlewareManager<IExtensibleMessage>()
    /**
     * @param qqid The bot itself's qqid
     */
    public constructor(qqid: number) {
        super()
        this._qqid = qqid
        this._atStr = `[CQ:at,qq=${qqid}]`
    }
    /** Deep-copy a Transform object */
    public static from(last: PrefixTransform) {
        const next = new PrefixTransform(last._qqid)
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    /** Strip string prefix(es) */
    public withString(...strings: string[]) {
        return this._derive(async function (ctx, next) {
            const sliceLen = (strings.find(i => ctx.message.startsWith(i)) || '').length
            ctx.message = ctx.message.slice(sliceLen)
            await next()
        })
    }
    /** Require & strip string prefix(es) */
    public mustWithString(...strings: string[]) {
        return this._derive(async function (ctx, next) {
            const sliceLen = (strings.find(i => ctx.message.startsWith(i)) || '').length
            if (sliceLen) {
                ctx.message = ctx.message.slice(sliceLen)
                await next()
            }
        })
    }
    /** Strip prefix matched with regex */
    public withRegex(regex: RegExp) {
        return this._derive(async function (ctx, next) {
            const matched = ctx.message.match(regex)
            if (matched && matched.index === 0)
                ctx.message = ctx.message.slice(matched[0].length)
            await next()
        })
    }
    /** Require & strip regex-matched prefix */
    public mustWithRegex(regex: RegExp) {
        return this._derive(async function (ctx, next) {
            const matched = ctx.message.match(regex)
            if (matched && matched.index === 0) {
                ctx.message = ctx.message.slice(matched[0].length)
                await next()
            }
        })
    }
    /** Strip at-mention of the bot */
    public withAt() {
        return this._derive(async function (ctx, next) {
            if (ctx.message.startsWith(this._atStr))
                ctx.message = ctx.message.slice(this._atStr.length)
            await next()
        })
    }
    /** Require & strip at-mention of the bot */
    public mustWithAt() {
        return this._derive(async function (ctx, next) {
            if (ctx.message.startsWith(this._atStr)) {
                ctx.message = ctx.message.slice(this._atStr.length)
                await next()
            }
        })
    }
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = PrefixTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
}
