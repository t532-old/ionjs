import { ITransform } from './definition'
import { IExtensibleMessage } from '../definition'
import * as ObjectFrom from 'deepmerge'

export function allOf(...transform: ITransform[]): ITransform {
    return {
        async transform(ctx: IExtensibleMessage) {
            let result = ctx
            for (const i of transform) {
                const curr = await i.transform(ctx)
                if (curr) result = ObjectFrom(result, curr)
                else return null
            }
            return result
        }
    }
}

export function someOf(...transform: ITransform[]): ITransform {
    return {
        async transform(ctx: IExtensibleMessage) {
            let result = ctx
            let flag = false
            for (const i of transform) {
                const curr = await i.transform(ctx)
                if (curr) {
                    flag = true
                    result = ObjectFrom(result, curr)
                }
            }
            if (flag) return result
            else return null
        }
    }
}