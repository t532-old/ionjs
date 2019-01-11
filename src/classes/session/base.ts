import { ISessionTemplate } from './definitions'
/** The base class that represents an object that stores Behaviors */
export abstract class SessionStore {
    /** The list of the stored session templates */
    protected readonly _templates: (ISessionTemplate&any)[] = []
    /** Generates a session id for a context */
    protected readonly _identifier: (ctx: any) => any
    /** @param identifier A function that generates a session id for a context */
    constructor(identifier: (ctx: any) => any) { this._identifier = identifier }
    /** Push a session template into the list */
    abstract use(...params: any[]): void
    /**
     * Pass a context to sessions
     * @param ctx the context that'll be passed
     */
    abstract run(ctx: any): void
}