/** A type alias for a validator function */
export type TValidator = (ctx: any, ...extraArgs: any[]) => boolean|Promise<boolean>

/** A type alias for a parser function */
export type TParser = (ctx: any, ...extraArgs: any[]) => any|Promise<any>