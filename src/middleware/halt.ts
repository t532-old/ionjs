/** An error class that represents a halt */
export class MiddlewareHaltError extends Error {}
/** Generate a general halter */
export function generateHalter() { return () => { throw new MiddlewareHaltError() } }