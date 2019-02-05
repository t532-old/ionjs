# 函数

## createSessionManager [<Badge text="instances/session" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/session.ts)
使用会话标识符生成器生成新的会话管理器。

```ts {6}
/**
 * Create a new session manager
 * @param name the session manager's name
 * @param identifier the session manager's identifier
 */
function create(name: string, identifier: (ctx: IMessage) => any): void
```

## getAllModuleMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
获取所有模块的元信息。

```ts {2}
/** Get all modules' metadata */
function getAllModules(): IModuleMetadata[]
```

## getRegistrationMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
获取一个模块的所有注册的元信息。

```ts {5}
/**
 * Get all registrations' metadata of a module
 * @param moduleName the module's name
 */
function getAllRegistrations(moduleName: string): IRegistrationMetadata[]
```

## getModuleMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
获取一个模块的元信息。

```ts {5}
/**
 * Get a module's metadata
 * @param name the module's name
 */
function getModule(name: string): IModuleMetadata
```

## getRegistrationMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
获取一个注册的元信息。

```ts {6}
/**
 * Get a registration's metadata of a module
 * @param moduleName the module's name
 * @param name the registration's name
 */
function getRegistration(moduleName: string, name: string): IRegistrationMetadata
```

## init [<Badge text="app" />](https://github.com/ionjs-dev/ionjs/tree/master/src/app.ts)
加载 Ion.js 的一系列配置，初始化 Ion.js 应用。

```ts {5}
/**
 * Initialize the bot
 * @param config the bot's configuration
 */
function init({ receivePort, receiveSecret, sendURL, sendToken, operators, prefixes, self, middlewareTimeout, sessionTimeout }: {
    receivePort: number
    receiveSecret?: string
    sendURL: string
    sendToken?: string
    operators?: number[]
    prefixes?: string[]
    self: number
    middlewareTimeout?: number
    sessionTimeout?: number
}): void
```

## runMiddleware [<Badge text="instances/middlewares" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/middlewares.ts)
将给定的上下文传入中间件管理器执行（包括会话管理器）。

```ts {5}
/**
 * Let a context go through the middlewares
 * @param ctx the context
 */
function run(ctx: IMessage): Promise<void>
```

## runSession [<Badge text="instances/sessions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/sessions.ts)
将给定的上下文传入会话管理器执行（不经过中间件管理器）。

```ts {5}
/**
 * Pass a context through the sessions
 * @param ctx the context
 */
function run(ctx: TExtensibleMessage): Promise<void>
```

## start [<Badge text="instances/receiver" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/receiver.ts)
使接收端开始监听 CQHTTP 上报消息。

```ts {2}
/** Let the receiver start listening */
function start(): void
```

## useMiddleware [<Badge text="instances/middlewares" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/middlewares.ts)
注册一个或多个中间件。

```ts {5}
/**
 * Use a list of middlewares (or only one)
 * @param middlewares the middlewares
 */
function use(...middlewares: TMiddleware<TExtensibleMessage>[]): void
```

## useModuleMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
注册一个模块的元信息。

```ts {5}
/**
 * Register a module's metadata
 * @param data the module's metadata
 */
function useModule(data: IModuleMetadata): void
```

## useRegistrationMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
注册一个注册的元信息。

```ts {5}
/**
 * Register a registration's metadata
 * @param data the registration's metadata
 */
function useRegistration(data: IRegistrationMetadata): void
```

## useSession [<Badge text="instances/sessions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/sessions.ts)
注册一个在特定条件下触发的会话。

```ts {6}
/**
 * Use a session template
 * @param when when to start the session
 * @param params Another info of the session template
 */
function use(when: When, { override, identifier, concurrent }?: {
    override?: boolean
    identifier?: string
    concurrent?: boolean
}): (session: (ctx: ISessionContext) => void) => void
```

