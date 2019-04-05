# 类

## BotWhen [<Badge text="classes/when/derived" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/when/derived.ts)
针对QQ机器人特化的条件判断器 `When`，带有一系列实用方法。

```ts {2,9,16,18,24,31,36,42,49,65}
/** A class that represents conditions that determines whether a session should start ot not */
class BotWhen extends When {
    private config: {
        operators?: number[]
        prefixes?: string[]
        self?: number
        atSelf?: string
    }
    init({ operators, prefixes, self }: {
        operators: number[]
        prefixes: string[]
        self: number
    }): this
    private derive
    /** Return a When instance with no conditions */
    ever(): BotWhen
    /** Add the raw message to the parsed result */
    raw(): BotWhen
    /**
     * Add a custom matcher
     * @param condition the matcher
     * @param failMessage message that'll be sent to user when invalid
     */
    match(condition: {
        [x: string]: any
    }, ...failMessage: (string | ICQCode)[]): BotWhen
    /**
     * Check if a message contains one of the keywords
     * @param keywords the keywords
     */
    contain(...keywords: (RegExp | string)[]): BotWhen
    /**
     * Specify expected content types
     * @param type The expected content type(s)
     */
    type(...types: string[]): BotWhen
    /**
     * Specify the required role
     * @param role The role
     * @param failMessage message that'll be sent to user when invalid
     */
    role(role: 'everyone' | 'admin' | 'owner' | 'operator', ...failMessage: (string | ICQCode)[]): BotWhen
    /**
     * Use a command for the conditions
     * @param names the commands' names
     * @param params the parameters' declaration
     * @param config the config object
     */
    command(names: string | string[], params?: string, { withPrefixes, types, prompts, validators }?: {
        withPrefixes?: boolean
        types?: {
            [param: string]: any
        }
        prompts?: string | {
            [params: string]: string
        }
        validators?: {
            [params: string]: TValidator
        }
    }): BotWhen
    /**
     * At only
     * @param failMessage message that'll be sent to user when invalid
     */
    at(...failMessage: (string | ICQCode)[]): BotWhen
}
```

## Command [<Badge text="classes/command/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/classes.ts)
表达一个命令并可对字符串进行命令解析的类。

```ts {2,15,18,20,22,27}
/** A class that represents a shell-like-command and is able to parse commands */
class Command {
    /** The raw declaration of the command instance */
    private readonly _raw
    /** The delcared parameters */
    private readonly _parameters
    /** An array of declared options */
    private readonly _options
    /** The command's name */
    private readonly _name
    /**
     * Check if a command matches the name
     * @param command the command for checking
     */
    readonly is: (command: string) => boolean
    /** Regexps for parsing declarations and commands */
    private static readonly _REGEXES
    readonly parameters: ICommandParameters
    /** @param declaration The command declaration */
    constructor(declaration: string)
    /** Reloaded version of toString() that returns the raw declaration */
    toString(): string
    /**
     * Parse a command
     * @param command The command for parsing
     */
    parse(command: string): ICommandArguments
}
```

## CommandParseError [<Badge text="classes/command/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/classes.ts)
命令类 `Command` 在调用方法 `parse()` 解析时遇到的错误。

```ts {1,2,3}
class CommandParseError extends Error {
    args: ICommandArguments
    notGiven: string[]
    constructor(message: string, result?: ICommandArguments, notGiven?: string[])
}
```

## ConcurrentSessionManager [<Badge text="classes/session/concurrent" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/concurrent.ts)
一个会话标识符可同时对应多个会话的会话管理器。

```ts {2,10,16}
/** A session manager that allows multi processes */
class ConcurrentSessionManager<T> extends SessionStore<T> {
    /** Stores streams of active sessions */
    private readonly _streams
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     */
    use(session: TSessionFn<T>, match: TSessionMatcher<T>): this
    /**
     * Pass a context to every active session that matches the session id
     * Or create sessions if the context matches the conditions of them
     * @param ctx the context
     */
    run(ctx: T): Promise<void>
}

```

## MessageStream [<Badge text="classes/session/stream" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/stream.ts)
会话管理器 `*SessionManager` 传给 `TSessionFn` 的流，拥有一些实用方法以异步地获得会话管理器传来的消息。

```ts {2,5,11,13,15,17}
/** A class that extends PassThrough stream, supports async message fetching */
class MessageStream<T> extends PassThrough {
    /** Deleter is a function that'll called by free() */
    private readonly deleter
    constructor(deleter: () => void)
    /**
     * get an object asynchronously.
     * if there is an object in the stream, it'll be directly resolved
     * else it'll be resolved when a new object is pushed into the stream.
     */
    get(condition?: (ctx: T) => boolean): Promise<T>
    /** Alias of this.resume() */
    waste(): void
    /** Alias of this.pause() */
    keep(): void
    /** End the stream and free related resources */
    free(): void
}

```

## MessageStreamError [<Badge text="classes/session/stream" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/stream.ts)
`MessageStream` 在调用 `get()` 方法异步等待读取流时遇到的错误。

```ts {1}
class MessageStreamError extends Error {
}
```

## MiddlewareManager [<Badge text="classes/middleware/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/middleware/classes.ts)
类似 [koa](https://koajs.com) 的中间件管理器。

```ts {2,8,13,18,23}
/** A middleware manager */
class MiddlewareManager<T> {
    /** The list of middlewares */
    private _middlewares
    /** The list of middlewares that runs at last */
    private _lastMiddlewares
    /** Returns how many middlewares there are */
    readonly length: number
    /**
     * add a middleware to the middleware list
     * @param middleware the middleware
     */
    use(middleware: TMiddleware<T>): this
    /**
     * add a middleware to another middleware list that'll be run at last
     * @param middleware the middleware
     */
    useLast(middleware: TMiddleware<T>): this
    /**
     * Let context go through the middlewares
     * @param ctx the context
     */
    run(ctx: T): Promise<void>
}
```

## Receiver [<Badge text="classes/receiver/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/classes.ts)
内部使用 `koa` 的 CQHTTP 上报接收端。

```ts {1,3,4}
class Receiver extends EventEmitter {
    private readonly _server
    constructor(secret?: string)
    listen(port: number): void
}
```

## Sender [<Badge text="classes/sender/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/sender/classes.ts)
内部使用 `httpie` 的 CQHTTP API 请求端。

```ts {1,5,6,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38}
class Sender {
    private readonly _context
    private readonly _sendURL
    private readonly _token?
    constructor(sendURL: string, token?: string, context?: IMessage)
    to(context: any): Sender
    private _post
    private _checkContext
    send(...mixedMessage: (string | ICQCode)[]): Promise<Result.ISendResult>
    'delete'(message_id: number): Promise<Result.INoneResult>
    sendLike(times: number): Promise<Result.INoneResult>
    kick(reject_add_request?: boolean): Promise<Result.INoneResult>
    ban(duration?: number): Promise<Result.INoneResult>
    unban(): Promise<Result.INoneResult>
    wholeBan(): Promise<Result.INoneResult>
    wholeUnban(): Promise<Result.INoneResult>
    setAdmin(): Promise<Result.INoneResult>
    unsetAdmin(): Promise<Result.INoneResult>
    enableAnonymous(): Promise<Result.INoneResult>
    disableAnonymous(): Promise<Result.INoneResult>
    setCard(card?: string): Promise<Result.INoneResult>
    deleteCard(): Promise<Result.INoneResult>
    setSpecialTitle(title?: string): Promise<Result.INoneResult>
    deleteSpecialTitle(): Promise<Result.INoneResult>
    leave(is_dismiss?: boolean): Promise<Result.INoneResult>
    solveRequest(approve?: boolean, remarkOrReason?: string): Promise<Result.INoneResult>
    getSelfInfo(): Promise<Result.ISelfInfoResult>
    getInfo(no_cache?: boolean): Promise<Result.IInfoResult>
    getGroupList(no_cache?: boolean): Promise<Result.IGroupListResult>
    getMemberList(): Promise<Result.IMemberInfoListResult>
    getCredentials(): Promise<Result.ICredentialsResult>
    getRecord(): Promise<Result.IRecordResult>
    getPluginStatus(): Promise<Result.IPluginStatusResult>
    getPluginVersionInfo(): Promise<Result.IPluginVersionInfoResult>
    restart(clean_log?: boolean, clean_cache?: boolean, clean_event?: boolean): Promise<Result.INoneResult>
    restartPlugin(delay?: number): Promise<Result.INoneResult>
    cleanDataDir(data_dir: string): Promise<Result.INoneResult>
    cleanPluginLog(): Promise<Result.INoneResult>
}
```

## SenderError [<Badge text="classes/sender/classes" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/sender/classes.ts)
`Sender` 在请求 CQHTTP API 时遇到的错误。

```ts {1,2,5,6,7}
class SenderError extends Error {
    readonly post: {
        [x: string]: any
    }
    readonly url: string
    readonly retcode: number
    constructor(post: {
        [x: string]: any
    }, url: string, retcode: number)
}
```

## SessionStore [<Badge text="classes/session/base" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/base.ts)
会话管理器的抽象基类。

```ts {2,10,12,14,19}
/** The base class that represents an object that stores Behaviors */
abstract class SessionStore<T> {
    /** The list of the stored session templates */
    protected readonly _templates: (ISessionTemplate<T> & {
        [x: string]: any
    })[]
    /** Generates a session id for a context */
    protected readonly _identifier: (ctx: any) => any
    /** Returns how many session templates there are */
    readonly length: number
    /** @param identifier A function that generates a session id for a context */
    constructor(identifier: (ctx: any) => any)
    /** Push a session template into the list */
    abstract use(...params: any[]): void
    /**
     * Pass a context to sessions
     * @param ctx the context that'll be passed
     */
    abstract run(ctx: any): void
}
```

## SingleSessionManager [<Badge text="classes/session/single" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/single.ts)
一个会话标识符仅可同时对应一个会话的会话管理器。

```ts {2,13,20}
/** A session manager that is single-process for each user */
class SingleSessionManager<T> extends SessionStore<T> {
    /** Stores streams of active sessions */
    private readonly _streams
    /**
     * set an empty Stream Map and the symbol when new template is added
     * @param session the function for generating sessions
     * @param match determines whether the session should be created or not
     * @param override determines when the condition is matched,
     *                 whether to force end the previous session (true)
     *                 or ignore this context (false or not determined)
     */
    use(session: TSessionFn<T>, match: TSessionMatcher<T>, override?: boolean): this
    /**
     * Pass a context to current active session
     * If no existing ones, check which session can be created, last ones has higher priority
     * Additionally, override templates will take over even when there's a session running
     * @param ctx the context
     */
    run(ctx: T): Promise<void>
}

```

## When [<Badge text="classes/when/base" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/when/base.ts)
一个可扩展的条件判断器。

```ts {2,12,19,26,28}
/** A class that represents a series of conditions */
class When {
    /** The validators */
    protected readonly _validators: TValidator[]
    /** The parsers */
    protected readonly _parsers: TParser[]
    /** The validator callback (when valid) */
    protected readonly _validCallbacks: TValidatorCallback[]
    /** The validator callback (when invalid) */
    protected readonly _invalidCallbacks: TValidatorCallback[]
    /** @param fns functions for When */
    constructor({ validate, parse, validCallback, invalidCallback }?: {
        validate?: TValidator[]
        parse?: TParser[]
        validCallback?: TValidatorCallback[]
        invalidCallback?: TValidatorCallback[]
    })
    /** Returns a new When instance based on this, with one more validator and/or parser */
    protected deriveFromType<T extends When>(derivation: {
        validate?: TValidator
        parse?: TParser
        validCallback?: TValidatorCallback
        invalidCallback?: TValidatorCallback
    }): T
    /** Validate a context */
    validate(ctx: any, ...extraArgs: any[]): Promise<boolean>
    /** Parse a context */
    parse(ctx: any, ...extraArgs: any[]): Promise<any>
}
```
