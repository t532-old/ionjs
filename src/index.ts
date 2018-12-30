import * as Adapter from './adapter'
import * as Command from './command'
import * as Middleware from './middleware'
import * as Session from './session'

const _middlewareManager = new Middleware.MiddlewareManager()

function _defaultIdentifier(ctx) { return `${ctx.user_id}${ctx.message_type[0]}${ctx._union_id}` }
const _sessionManagers: any = { default: { single: new Session.SingleSessionManager(_defaultIdentifier), concurrent: new Session.ConcurrentSessionManager(_defaultIdentifier) } }

const _config: { operators?: number[], prefixes?: string[], self?: number } = {}

let _receivePort: number
export let receiver: Adapter.Receiver

export let sender: Adapter.Sender

export function init({ receivePort = 8080, receiveSecret, sendURL = 'http://127.0.0.1:5700', sendToken, operators = [], prefixes = [], self }: {
    receivePort: number, 
    receiveSecret?: string, 
    sendURL: string, 
    sendToken?: string, 
    operators?: number[],
    prefixes?: string[],
    self: number,
}) {
    _receivePort = receivePort
    receiver = new Adapter.Receiver(receiveSecret)
    sender = new Adapter.Sender(sendURL, sendToken)
    _config.operators = operators
    _config.prefixes = prefixes
    _config.self = self
    receiver.on('message', async ctx => {
        await _middlewareManager.run(ctx)
        for (const i in _session) {
            _sessionManagers[i].single.run(ctx)
            _sessionManagers[i].concurrent.run(ctx)
        }
    })
}

export function start() { receiver.listen(this._receivePort) }

export function useMiddleware(middleware: Middleware.TMiddleware) { _middlewareMnanager.use(middleware) }

// TODO: function useSession()

export const Classes = { Adapter, Command, Middleware, Session }
