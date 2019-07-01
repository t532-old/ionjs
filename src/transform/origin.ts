import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'
import { contextTypeOf } from '../platform/receiver'
import { ITransform } from './definition'

export enum OriginPermission { EVERYONE, ADMIN, OWNER, OPERATOR }

export class OriginTransform implements ITransform {
    private _manager = new MiddlewareManager<IExtensibleMessage>()
    private readonly _operators: number[]
    public constructor(operators: number[] = []) { this._operators = operators }
    public static from(last: OriginTransform) {
        const next = new OriginTransform(last._operators)
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    public isFromGroup(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.group_id)) await next()
        })
    }
    public isFromDiscuss(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.discuss_id)) await next()
        })
    }
    public isFromUser(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.user_id)) await next()
        })
    }
    public isType(...types: string[]) {
        return this._derive(async function (ctx, next) {
            if (types.some(i => contextTypeOf(ctx).includes(i))) await next()
        })
    }
    public hasPermission(level: OriginPermission) {
        return this._derive(async function (ctx, next) {
            switch (level) {
                case OriginPermission.EVERYONE:
                    await next()
                    break
                case OriginPermission.OPERATOR:
                    if (this._operators.includes(ctx.user_id)) await next()
                    break
                case OriginPermission.ADMIN:
                    if (!ctx.sender.role || ctx.sender.role === 'admin' || ctx.sender.role === 'owner') await next()
                    break
                case OriginPermission.OWNER:
                    if (!ctx.sender.role || ctx.sender.role === 'owner') await next()
                    break
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
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = OriginTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
}
