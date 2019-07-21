import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import merge from 'deepmerge'
import { ITransform } from './definition'

declare module '../definition' {
    interface IExtensibleMessage {
        /** The array matched with RegExp */
        match?: RegExpMatchArray
        /** Words contained in the message */
        contain?: string[]
    }
}

/** Transformations related to message contents */
export class MessageTransform implements ITransform {
    private _manager = new MiddlewareManager<IExtensibleMessage>()
    /** Deep-copy a Transform object */
    public static from(last: MessageTransform) {
        const next = new MessageTransform()
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    /** Require the message to match a regex */
    public matchesRegex(regex: RegExp) {
        return this._derive(async function (ctx, next) {
            const matched = ctx.message.match(regex)
            if (matched) {
                ctx.match = matched
                await next()
            }
        })
    }
    /** Require the message to contain specific substrings */
    public contains(...strings: string[]) {
        return this._derive(async function (ctx, next) {
            const contained = strings.filter(i => ctx.message.indexOf(i) >= 0)
            if (contained.length) {
                ctx.contain = contained
                await next()
            }
        })
    }
    /** Validate the message with a validator function */
    public matches(validator: (msg: string) => boolean|Promise<boolean>) {
        return this._derive(async function (ctx, next) {
            if (await validator(ctx.message))
                await next()
        })
    }
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
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = MessageTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
}
