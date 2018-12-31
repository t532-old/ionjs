import { TMiddleware } from './definition'
/**
 * Generate a function that calls a function in an array, 
 * records the call and pass a funciton that calls the next function, etc. recursively 
 * until the end of the funciton array
 * @param list the function array
 * @param offset the position of the next function
 * @param context the context that'll be passed to the function
 */
export function generateNextExecutor(list: TMiddleware[], offset: number, context: any) {
    return async function executeNext() {
        if (list[offset] instanceof Function)
            await list[offset](context, generateNextExecutor(list, offset + 1, context))
    }
}