/** A type alias for a validator function */
export interface IValidator<T = any> { (ctx: T, ...extraArgs: any[]): boolean|Promise<boolean> }

/** A type alias for a validator callback function */
export interface IValidatorCallback<T = any> { (ctx: T, ...extraArgs: any[]): void }

/** A type alias for a parser function */
export interface IParser<T = any, R = any> { (ctx: T, ...extraArgs: any[]): R|Promise<R> }

/** An object that represents a series of conditions and parsers */
export interface IWhen {
    /**
     * add some functions (condition or parser) to the current collection.
     * function name is identifier. a newer function with the same name will replace the old one.
     * @param derivation the functions to be added
     */
    derive(derivation: { validate?: IValidator, parse?: IParser, validCallback?: IValidatorCallback, invalidCallback?: IValidatorCallback }): void
    /** validate a context asynchronously */
    validate(ctx: any, ...extraArgs: any[]): Promise<boolean>
    /** parse a context asynchronously */
    parse(ctx: any, ...extraArgs: any[]): Promise<any>
}