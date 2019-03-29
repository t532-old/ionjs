import { MiddlewareManager, IMiddleware } from '../../middleware'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'
import { ITransform } from './definition'

declare module "../definition" {
    interface IExtensibleMessage {
        match?: RegExpMatchArray
        contain?: string[]
    }
}

export class MessageTransform implements ITransform {
    public static from(last: MessageTransform) {
        const next = new MessageTransform()
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    private _manager = new MiddlewareManager<IExtensibleMessage>()
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = MessageTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
    public matchesRegex(regex: RegExp) {
        return this._derive(async (ctx, next) => {
            const matched = ctx.message.match(regex)
            if (matched) {
                ctx.match = matched
                await next()
            }
        })
    }
    public contains(...strings: string[]) {
        return this._derive(async (ctx, next) => {
            const contained = strings.filter(i => ctx.message.indexOf(i) >= 0)
            if (contained.length) {
                ctx.contain = contained
                await next()
            }
        })
    }
    public matches(validator: (msg: string) => boolean|Promise<boolean>) {
        return this._derive(async (ctx, next) => {
            if (await validator(ctx.message))
                await next()
        })
    }
    public async transform(msg: IExtensibleMessage) {
        let finished = false
        const man = this._manager.use(async (ctx, next) => {
            finished = true
            await next()
        })
        const copy = ObjectFrom({}, msg)
        await man.run(copy)
        if (finished) return copy
        else return null
    }
}