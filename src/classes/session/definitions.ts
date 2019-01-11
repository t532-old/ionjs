import { MessageStream } from './stream'

export type TSessionFn = (stream: MessageStream) => void

export type TSessionMatcher = (ctx: any) => boolean|Promise<boolean>

export interface ISessionTemplate {
    /**
     * determines whether the session should be created or not
     * @param ctx the context
     */
    match: TSessionMatcher
    /**
     * the function for generating sessions
     * @param stream the stream for contexts matches the session id
     */
    session: TSessionFn
}

export interface IConcurrentSessionTemplate extends ISessionTemplate {
    /** 
     * (Only avaliable in class ConcurrentSessionManager)
     * A unique symbol of the session template
     */
    symbol?: symbol
}

export interface ISingleSessionTemplate extends ISessionTemplate {
    /** 
     * (Only avaliable in class SingleSessionManager)
     * determines when the condition is matched,
     * whether to force end the previous session (true) 
     * or ignore this context (false or not determined) 
     */
    override?: boolean
}
