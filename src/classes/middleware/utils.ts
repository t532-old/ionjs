import { TMiddleware } from './definitions'
/**
 * Generate a function that calls a function in an array, 
 * records the call and pass a function that calls the next function, etc recursively 
 * until the end of the funciton array
 * @param iter the iterator of the function array
 * @param context the context that'll be passed to the function
 */
export function nextExecutor<T>(iter: IterableIterator<TMiddleware<T>>, context: any) {
    const next = iter.next().value
    return async function executeNext() {
        if (next instanceof Function)
            await next(context, nextExecutor(iter, context))
    }
}