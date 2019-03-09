import { When } from './base'

/** A type alias for a validator function */
export interface IValidator<T = any> { (ctx: T, ...extraArgs: any[]): boolean|Promise<boolean> }

/** A type alias for a validator callback function */
export interface IValidatorCallback<T = any> { (ctx: T, ...extraArgs: any[]): void }

/** A type alias for a parser function */
export interface IParser<T = any, R = any> { (ctx: T, ...extraArgs: any[]): R|Promise<R> }

/** A type alias for class When and its derived classes */
export interface IWhenClass<T extends When> {
    new({ validate, parse, validCallback, invalidCallback }: {
        validate?: IValidator[],
        parse?: IParser[],
        validCallback?: IValidatorCallback[],
        invalidCallback?: IValidatorCallback[],
    }): T
}