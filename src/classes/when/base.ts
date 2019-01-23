import { TValidator, TValidatorCallback, TParser, TWhenClass } from './definitions'

/** A class that represents a series of conditions */
export class When {
    /** The validators */
    protected readonly _validators: TValidator[] = []
    /** The parsers */
    protected readonly _parsers: TParser[] = []
    /** The validator callback (when valid) */
    protected readonly _validCallbacks: TValidatorCallback[] = []
    /** The validator callback (when invalid) */
    protected readonly _invalidCallbacks: TValidatorCallback[] = []
    /**
     * @param validators A list of validators
     * @param parsers A list of parsers
     */
    constructor({ validate = [], parse = [], validCallback = [], invalidCallback = [] }: {
        validate?: TValidator[], 
        parse?: TParser[],
        validCallback?: TValidatorCallback[],
        invalidCallback?: TValidatorCallback[],
    } = {}) {
        this._validators = validate
        this._parsers = parse
        this._validCallbacks = validCallback
        this._invalidCallbacks = invalidCallback
    }
    /** Returns a new When instance based on this, with one more validator and/or parser */
    protected deriveFromType<T extends When>(deriviation: { validate?: TValidator, parse?: TParser, validCallback?: TValidatorCallback, invalidCallback?: TValidatorCallback }) {
        const original = {
            validate: Array.from(this._validators),
            parse: Array.from(this._parsers),
            valid: Array.from(this._validCallbacks),
            invalid: Array.from(this._invalidCallbacks),
        }
        for (const name in original) {
            if (deriviation[name]) {
                const last = original[name].findIndex(fn => fn.name === deriviation[name].name)
                if (last >= 0) original[name].splice(last, 1)
                original[name].push(deriviation[name])
            }
        }
        return new (this.constructor as TWhenClass<T>)(original)
    }
    /** Validate a context */
    async validate(ctx: any, ...extraArgs: any[]) {
        for (const validate of this._validators)
            if (!(await validate(ctx, ...extraArgs))) return false
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