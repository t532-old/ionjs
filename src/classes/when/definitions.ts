/** A type alias for a validator function */
export type TValidator = (ctx: any, ...extraArgs: any[]) => boolean|Promise<boolean>

/** A type alias for a validator callback function */
export type TValidatorCallback = (ctx: any, ...extraArgs: any[]) => void

/** A type alias for a parser function */
export type TParser = (ctx: any, ...extraArgs: any[]) => any|Promise<any>

/** A type alias for class When and its derived classes */
export type TWhenClass<T> = Function&{ 
    new({ validate, parse, validCallback, invalidCallback }: {
        validate?: TValidator[], 
        parse?: TParser[],
        validCallback?: TValidatorCallback[],
        invalidCallback?: TValidatorCallback[],
    }): T 
}