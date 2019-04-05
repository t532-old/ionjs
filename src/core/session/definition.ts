import { MessageStream } from './stream'

export interface IStreamGetter<T> { (ctx: T): MessageStream<T> }

export interface ISessionFn<T> { (stream: MessageStream<T>, streamOf: IStreamGetter<T>, triggerObj: T): void }

export interface ISessionMatcher<T> { (ctx: T): boolean|Promise<boolean> }

export interface ISessionIdentifier<T> { (ctx: T): any }

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
