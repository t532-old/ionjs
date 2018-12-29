/**
 * Generate a function that calls a function in an array, 
 * records the call and pass a funciton that calls the next function, etc. recursively 
 * until the end of the funciton array
 * @param list the function array
 * @param offset the position of the next function
 * @param context the context that'll be passed to the function
 * @param recorder the array that records whether a function in the function array is already called
 */
export function generateNextExecutor(list: ((ctx: any, next: any) => void)[], offset: number, context: any, recorder: boolean[]) {
    async function executeNext() {
        if (list[offset] instanceof Function && !recorder[offset]) {
            recorder[offset] = true
            await list[offset](context, generateNextExecutor(list, offset + 1, context, recorder))
        }
    }
    return executeNext
}