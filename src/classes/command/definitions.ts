/** A list of delcared parameters */
export interface ICommandParameters {
    /** The keys are the aliases and the values are param names  */
    aliases: { [param: string]: string }
    /** The keys are param names and the values are default values */
    defaults: { [param: string]: string }
    /** An array of ordered params */
    ordered: string[]
    /** An array of required params */
    required: string[]
    /** Description of parameters */
    description: { [param: string]: string }
}

/** A list of given arguments */
export interface ICommandArguments {
    /** The specified options */
    options: any[]
    /** The specified arguments */
    arguments: { [param: string]: any }
    /** Rest unparsed items */
    rest: any[]
}

/** An extraneous processor for arguments */
export type TCommandProcessor = (args: ICommandArguments, params: { parameters: ICommandParameters, options: string[] }, ...extraArgs: any[]) => void