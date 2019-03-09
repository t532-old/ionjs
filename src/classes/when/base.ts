import { IValidator, IValidatorCallback, IParser, IWhenClass } from './definitions'

/** A class that represents a series of conditions */
export class When {
    /** The validators */
    protected readonly _validators: IValidator[] = []
    /** The parsers */
    protected readonly _parsers: IParser[] = []
    /** The validator callback (when valid) */
    protected readonly _validCallbacks: IValidatorCallback[] = []
    /** The validator callback (when invalid) */
    protected readonly _invalidCallbacks: IValidatorCallback[] = []
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
    protected deriveFromType<T extends When>(derivation: { validate?: IValidator, parse?: IParser, validCallback?: IValidatorCallback, invalidCallback?: IValidatorCallback }) {
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
        return new (this.constructor as IWhenClass<T>)(original)
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