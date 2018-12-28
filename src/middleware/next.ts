export function generateNextExecutor(offset: number, context: any, recorder: boolean[]) {
    async function executeNext() {
        if (this.middlewares[offset] instanceof Function && !recorder[offset]) {
            recorder[offset] = true
            await this.middlewares[offset](context, this._generateNextExecutor(offset + 1, context, recorder))
        }
    }
    return executeNext.bind(this)
}