import { PassThrough } from 'stream'
import Debug from 'debug'
const debugExVerbose = Debug('ex-verbose-ionjs:session')

/** A class that extends PassThrough stream, supports async message fetching */
export class MessageStream extends PassThrough {
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
    get(condition: (ctx: any) => boolean = () => true): any {
        function _recursiveHandler(resolve) {
            debugExVerbose('get:attempt')
            const result = this.read()
            if (result && !!condition(result)) {
                debugExVerbose('get:success')
                resolve(result)
            } else {
                debugExVerbose('get:failing')
                this.once('readable', _recursiveHandler.bind(this, resolve))
            }
        }
        return new Promise(_recursiveHandler.bind(this))
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