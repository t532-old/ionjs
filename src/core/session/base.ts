import { ISessionFn, ISessionMatcher, ISessionIdentifier } from './definition'
/** The interface that represents an object that stores sessions */
export interface ISessionManager<T> {
    /** total number of registered session templates */
    length: number
    /** the identifier generator */
    identifier: ISessionIdentifier<T>
    /**
     * register a session template
     * @param session the session function
     * @param match the condition that determines when should the session be started
     */
    use(session: ISessionFn<T>, match: ISessionMatcher<T>, ...params: any[]): void
    /**
     * pass a context to interested sessions
     * @param ctx the context
     */
    run(ctx: T): void
}

/** A class that represents an error produced by an ISessionManager */
export class SessionManagerError extends Error {}