import { TValidator, TParser } from './definitions'

/** A class that represents a series of conditions */
export class When {
    /** The validators */
    protected readonly _validators: TValidator[] = []
    /** The parsers */
    protected readonly _parsers: TParser[] = []
    /**
     * @param validators A list of validators
     * @param parsers A list of parsers
     */
    constructor(validators: TValidator[], parsers: TParser[]) {
        this._validators = validators
        this._parsers = parsers
    }
    /** Returns a new When instance based on this, with one more validator and/or parser */
    derive({ validate, parse }: { validate?: TValidator, parse?: TParser }, Type) {
        const validators = Array.from(this._validators),
              parsers = Array.from(this._parsers)
        if (validate) validators.push(validate)
        if (parse) parsers.push(parse)
        return new Type(validators, parsers)
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