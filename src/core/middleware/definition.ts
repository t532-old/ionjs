export interface IMiddleware<T> { (ctx: T, next: () => Promise<void>): void }
