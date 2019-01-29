import { PassThrough } from 'stream'
import Debug from 'debug'
const debugExVerbose = Debug('ex-verbose-ionjs:session')

export class MessageStreamError extends Error {}
/** A class that extends PassThrough stream, supports async message fetching */
export class MessageStream<T> extends PassThrough {
    /** Deleter is a function that'll called by free() */
    private readonly deleter: () => void
    constructor(deleter: () => void) {
        super({ objectMode: true })
        this.deleter = deleter
    }
    /**
     * get an object asynchronously.
     * if there is an object in the stream, it'll be directly resolved;
     * else it'll be resolved when a new object is pushed into the stream.
     */
    get(condition: (ctx: T) => Promise<boolean>|boolean = () => true): Promise<T> {
        async function _recursiveHandler(resolve: (ctx: T) => void, reject: (err: MessageStreamError) => void) {
            debugExVerbose('get:attempt')
            const result = this.read()
            if (result && await condition(result)) {
                debugExVerbose('get:success')
                resolve(result)
            } else {
                debugExVerbose('get:failing')
                if (!this.writable) reject(new MessageStreamError('Can\'t get new data because stream has been ended'))
                this.once('end', () => reject(new MessageStreamError('Can\'t get new data because stream has been ended')))
                this.once('readable', _recursiveHandler.bind(this, resolve, reject))
            }
        }
        return new Promise<T>(_recursiveHandler.bind(this))
    }
    /** Alias of this.resume() */
    waste() { this.resume() }
    /** Alias of this.pause() */
    keep() { this.pause() }
    /** End the stream and free related resources */
    free() {
        this.end()
        this.deleter()
    }
}