import { IValidator, IValidatorCallback, IParser } from './definition'
import { MiddlewareManager } from '../middleware'

/** An object that represents a series of conditions and parsers */
export interface IWhen<T> {
    validate(fn: IValidator<T>, { success, failure }?: {
        success?: IValidatorCallback<T>,
        failure?: IValidatorCallback<T>,
    }): IWhen<T>
    parse(fn: IParser<T>): IWhen<T>
    process(ctx: T, ...extraArgs: any[]): Promise<T|null>
}

interface IWhenMiddlewareManagerContext<T> {
    data: T
    extraArgs: any[]
    finished: boolean
}

/** A class that represents a series of conditions */
export class When<T = any> implements IWhen<T> {
    /** The middleware manager */
    private _manager: MiddlewareManager<IWhenMiddlewareManagerContext<T>> = new MiddlewareManager<IWhenMiddlewareManagerContext<T>>()
        .useLast(ctx => ctx.finished = true)
    /** Construct from an existing instance */
    static from<T>(last: When<T>) {
        const next = new When<T>()
        next._manager = MiddlewareManager.from(last._manager)
        return next
    }
    validate(fn: IValidator<T>, { success = () => {}, failure = () => {} }: {
        success?: IValidatorCallback<T>,
        failure?: IValidatorCallback<T>,
    } = {}): When<T> {
        const next = When.from(this)
        next._manager.use(async (ctx, next) => {
            const flag = await fn(ctx.data, ...ctx.extraArgs)
            if (flag) {
                success(ctx.data, ...ctx.extraArgs)
                await next()
            } else failure(ctx.data, ...ctx.extraArgs)
        })
        return next
    }
    parse(fn: IParser<T>): When<T> {
        const next = When.from(this)
        next._manager.use(async (ctx, next) => {
            await fn(ctx.data, ...ctx.extraArgs)
            await next()
        })
        return next
    }
    async process(ctx: T, ...extraArgs: any[]) {
        const state = {
            data: ctx,
            extraArgs,
            finished: false,
        }
        await this._manager.run(state)
        if (state.finished) return state.data
        else return null
    }
}