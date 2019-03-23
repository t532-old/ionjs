/** A list of delcared parameters */
export interface ICommandParameters {
    /** The keys are the aliases and the values are param names  */
    aliases: Map<string, string>
    /** The keys are param names and the values are default values */
    defaults: Map<string, string>
    /** An array of ordered params */
    ordered: string[]
    /** An array of required params */
    required: string[]
}

/** A list of given arguments */
export interface ICommandArguments {
    /** The specified options */
    options: string[]
    /** The specified arguments */
    arguments: { [param: string]: string }
    /** Rest unparsed items */
    rest: string[]
    /** The command name */
    name: string
}

/** A class that can parse shell-like commands */
export interface ICommand {
    /** Reloaded version of toString() that returns the raw declaration */
    toString(): string
    /**
     * Check if a command matches the name
     * @param command the command for checking
     */
    is(command: string): boolean
    /**
     * Parse a command
     * @param command The command for parsing
     */
    parse(command: string): ICommandArguments
}

/** A class that represents data of a shell-like command */
export interface ICommandData {
    /** The command's name */
    name: string
    /** The delcared parameters */
    parameters: ICommandParameters
    /** An array of declared options */
    options: string[]
}