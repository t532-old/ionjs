import { When } from './base'

/** A type alias for a validator function */
export type TValidator<T = any> = (ctx: T, ...extraArgs: any[]) => boolean|Promise<boolean>

/** A type alias for a validator callback function */
export type TValidatorCallback<T = any> = (ctx: T, ...extraArgs: any[]) => void

/** A type alias for a parser function */
export type TParser<T = any, R = any> = (ctx: T, ...extraArgs: any[]) => R|Promise<R>

/** A type alias for class When and its derived classes */
export type TWhenClass<T extends When> = Function&{
    new({ validate, parse, validCallback, invalidCallback }: {
        validate?: TValidator[],
        parse?: TParser[],
        validCallback?: TValidatorCallback[],
        invalidCallback?: TValidatorCallback[],
    }): T
}