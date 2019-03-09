import { MessageStream } from './stream'

export interface ISessionFn<T> { (stream: MessageStream<T>): void }

export interface ISessionMatcher<T> { (ctx: T): boolean|Promise<boolean> }

export interface ISessionTemplate<T> {
    /**
     * determines whether the session should be created or not
     * @param ctx the context
     */
    match: ISessionMatcher<T>
    /**
     * the function for generating sessions
     * @param stream the stream for contexts matches the session id
     */
    session: ISessionFn<T>
}

export interface IConcurrentSessionTemplate<T> extends ISessionTemplate<T> {
    /**
     * (Only avaliable in class ConcurrentSessionManager)
     * A unique symbol of the session template
     */
    symbol?: symbol
}

export interface ISingleSessionTemplate<T> extends ISessionTemplate<T> {
    /**
     * (Only avaliable in class SingleSessionManager)
     * determines when the condition is matched,
     * whether to force end the previous session (true)
     * or ignore this context (false or not determined)
     */
    override?: boolean
}
