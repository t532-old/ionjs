import { PassThrough } from 'stream'

export class MessageStreamError extends Error {}
/** A class that extends PassThrough stream, supports async message fetching */
export class MessageStream<T> extends PassThrough {
    /** Deleter is a function that'll called by free() */
    private readonly _deleter: () => void
    /** Whether this.free() has been called */
    private _isFree = false
    /** Number of references */
    private _references = 1
    public constructor(deleter: () => void) {
        super({ objectMode: true })
        this._deleter = deleter
    }
    /**
     * get an object asynchronously.
     * if there is an object in the stream, it'll be directly resolved;
     * else it'll be resolved when a new object is pushed into the stream.
     */
    public get(condition: (ctx: T) => Promise<boolean>|boolean = () => true): Promise<T> {
        async function _recursiveHandler(resolve: (ctx: T) => void, reject: (err: MessageStreamError) => void) {
            const result = this.read()
            if (result && await condition(result)) {
                resolve(result)
            } else {
                if (!this.writable) reject(new MessageStreamError('Can\'t get new data because stream has been ended'))
                this.once('end', () => reject(new MessageStreamError('Can\'t get new data because stream has been ended')))
                this.once('readable', _recursiveHandler.bind(this, resolve, reject))
            }
        }
        return new Promise<T>(_recursiveHandler.bind(this))
    }
    /** Alias of this.resume() */
    public waste() { this.resume() }
    /** Alias of this.pause() */
    public keep() { this.pause() }
    /** End the stream and free related resources */
    public free() {
        if (!this._isFree) {
            this.end()
            this._deleter()
            this._isFree = true
        }
    }
    /** Number of references */
    public get references() { return this._references }
    public set references(val) {
        this._references = val
        if (val === 0) this.free()
    }
}
