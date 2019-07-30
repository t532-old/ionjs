import { MiddlewareManager, IMiddleware } from '../core/middleware'
import { IExtensibleMessage } from '../definition'
import { contextTypeOf } from '../platform/receiver'
import { BaseTransform } from './base'

/** Permission levels of OriginTransform.hasPermission() */
export enum OriginPermission { EVERYONE, ADMIN, OWNER, OPERATOR }

/** Transformations related to the origin user */
export class OriginTransform extends BaseTransform {
    protected _manager = new MiddlewareManager<IExtensibleMessage>()
    private readonly _operators: number[]
    /**
     * @param operators users with OriginPermission.OPERATOR permission level
     */
    public constructor(operators: number[] = []) {
        super()
        this._operators = operators
    }
    /** Deep-copy a Transform object */
    public static from(last: OriginTransform) {
        const next = new OriginTransform(last._operators)
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    /** Require the message to be from specific group(s) */
    public isFromGroup(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.group_id)) await next()
        })
    }
    /** Require the message to be from specific discuss group(s) */
    public isFromDiscuss(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.discuss_id)) await next()
        })
    }
    /** Require the message to be from specific user(s) */
    public isFromUser(...id: number[]) {
        return this._derive(async function (ctx, next) {
            if (id.includes(ctx.user_id)) await next()
        })
    }
    /** Require the message to be specific type(s) */
    public isType(...types: string[]) {
        return this._derive(async function (ctx, next) {
            if (types.some(i => contextTypeOf(ctx).includes(i))) await next()
        })
    }
    /** Require the message's sender to have a specific level of permission */
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
    private _derive(mw: IMiddleware<IExtensibleMessage>) {
        const next = OriginTransform.from(this)
        next._manager = this._manager.use(mw)
        return next
    }
}
