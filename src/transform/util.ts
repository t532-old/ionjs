import { ITransform } from './definition'
import { IExtensibleMessage } from '../definition'
import merge from 'deepmerge'

/** Combine Transforms with logical AND */
export function allOf(...transform: ITransform[]): ITransform {
    return {
        async transform(ctx: IExtensibleMessage) {
            let result = ctx
            for (const i of transform) {
                const curr = await i.transform(ctx)
                if (curr) result = merge(result, curr)
                else return null
            }
            return result
        }
    }
}

/** Combine Transforms with logical OR */
export function someOf(...transform: ITransform[]): ITransform {
    return {
        async transform(ctx: IExtensibleMessage) {
            let result = ctx
            let flag = false
            for (const i of transform) {
                const curr = await i.transform(ctx)
                if (curr) {
                    flag = true
                    result = merge(result, curr)
                }
            }
            if (flag) return result
            else return null
        }
    }
}

/** Combine Transforms with logical OR, with short-circuiting */
export function shortCircuitSomeOf(...transform: ITransform[]): ITransform {
    return {
        async transform(ctx: IExtensibleMessage) {
            let result = ctx
            for (const i of transform) {
                const curr = await i.transform(ctx)
                if (curr) return merge(result, curr)
            }
            return null
        }
    }
}

export const always: ITransform = {
    async transform(ctx: IExtensibleMessage) {
        return merge({}, ctx)
    }
}
