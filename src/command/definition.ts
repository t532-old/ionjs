/** A list of delcared parameters */
export interface IParameters {
    /** The keys are the aliases and the values are param names  */
    aliases: any
    /** The keys are param names and the values are default values */
    defaults: any
    /** An array of ordered params */
    ordered: string[]
    /** An array of required params */
    required: string[]
    /** Description of parameters */
    description: any
}

/** A list of given arguments */
export interface IArguments {
    /** The specified options */
    options: any[]
    /** The specified arguments */
    arguments: any
    /** Rest unparsed items */
    rest: any[]
}

/** An extraneous processor for arguments */
export type TExtraneousProcessor = (args: IArguments, params: { parameters: IParameters, options: string[] }) => void