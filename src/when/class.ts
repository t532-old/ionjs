import { IValidator, IValidatorCallback, IParser } from './definition'

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

/** A class that represents a series of conditions */
export class When implements IWhen {
    /** The validators */
    private readonly _validators: IValidator[] = []
    /** The parsers */
    private readonly _parsers: IParser[] = []
    /** The validator callback (when valid) */
    private readonly _validCallbacks: IValidatorCallback[] = []
    /** The validator callback (when invalid) */
    private readonly _invalidCallbacks: IValidatorCallback[] = []
    /** @param fns functions for When */
    constructor({ validate = [], parse = [], validCallback = [], invalidCallback = [] }: {
        validate?: IValidator[],
        parse?: IParser[],
        validCallback?: IValidatorCallback[],
        invalidCallback?: IValidatorCallback[],
    } = {}) {
        this._validators = validate
        this._parsers = parse
        this._validCallbacks = validCallback
        this._invalidCallbacks = invalidCallback
    }
    /** Returns a new When instance based on this, with one more validator and/or parser */
    derive(derivation: { validate?: IValidator, parse?: IParser, validCallback?: IValidatorCallback, invalidCallback?: IValidatorCallback }) {
        const original = {
            validate: Array.from(this._validators),
            parse: Array.from(this._parsers),
            validCallback: Array.from(this._validCallbacks),
            invalidCallback: Array.from(this._invalidCallbacks),
        }
        for (const name in original) {
            if (derivation[name]) {
                const last = original[name].findIndex(fn => fn.name === derivation[name].name)
                if (last >= 0) original[name].splice(last, 1)
                original[name].push(derivation[name])
            }
        }
        return new When(original)
    }
    /** Validate a context */
    async validate(ctx: any, ...extraArgs: any[]) {
        for (const validate in this._validators) {
            if (!(await this._validators[validate](ctx, ...extraArgs))) {
                if (this._invalidCallbacks[validate]) this._invalidCallbacks[validate](ctx, ...extraArgs)
                return false
            } else if (this._validCallbacks[validate]) this._validCallbacks[validate](ctx, ...extraArgs)
        }
        return true
    }
    /** Parse a context */
    async parse(ctx: any, ...extraArgs: any[]): Promise<any> {
        const parsed = {}
        for (const parse of this._parsers)
            parsed[parse.name] = await parse(ctx, ...extraArgs)
        return parsed
    }
}