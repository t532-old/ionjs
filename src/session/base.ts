import { IBehavior } from './behavior'
import Debug from 'debug'
const debug = {
    addBehavior: Debug('ionjs: SessionManager: addBehavior'),
    removeBehavior: Debug('ionjs: SessionManager: removeBehavior'),
}
/** The base class that represents an object that stores Behaviors */
export abstract class SessionManager {
    /** The list of the stored behaviors */
    protected readonly _behaviors: IBehavior[] = []
    /** Generates a session id for a context */
    protected readonly _identifier: (ctx: any) => any
    /** @param identifier A function that generates a session id for a context */
    constructor(identifier: (ctx: any) => any) { this._identifier = identifier }
    /**
     * Will be called before the behavior is pushed into the list
     * @param behavior the behavior
     */
    protected abstract _onAddBehavior(behavior: IBehavior): void
    /**
     * Push a behavior into the list
     * @param behavior the behavior
     */
    addBehavior(behavior: IBehavior) {
        debug.addBehavior('added new behavior')
        this._onAddBehavior(behavior)
        this._behaviors.push(behavior)
        return this
    }
    /**
     * Will be called before the behavior is removed
     * @param behavior the behavior
     */
    protected abstract _onRemoveBehavior(behavior: IBehavior): void
    /** Remove a behavior from the list */
    removeBehavior(behavior: IBehavior) {
        debug.removeBehavior('deleted behavior')
        const pos = this._behaviors.indexOf(behavior)
        if (pos < 0) throw new Error('Behavior doesn\'t exist')
        this._onRemoveBehavior(behavior)
        this._behaviors.splice(pos, 1)
        return this
    }
    /**
     * Pass a context to sessions
     * @param ctx the context that'll be passed
     */
    abstract push(ctx: any): void
}