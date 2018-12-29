import { PassThrough } from 'stream'
import Debug from 'debug'

/** debug loggers for class MessageStream */
const debug = {
    get: Debug('verbose-ionjs: MessageStream: get'),
    getSuccess: Debug('verbose-ionjs: MessageStream: get => _listener'),
    getFailed: Debug('verbose-ionjs: MessageStream: get => _listener'),
    timeout: Debug('verbose-ionjs: FlowMessageStream: timeout'),
}

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
    get(condition: (ctx: any) => boolean = () => true) {
        function _recursiveHandler(resolve) {
            debug.get('get a message')
            const result = this.read()
            if (result && !!condition(result)) {
                debug.getSuccess('get message succesfully: %o', result)
                resolve(result)
            } else {
                debug.getFailed('get message failed, keep listening')
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