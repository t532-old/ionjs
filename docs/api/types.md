# 类型别名

## TCommandProcessor [<Badge text="classes/command/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/definitions.ts)
命令解析完毕后的可选参数处理函数。

```ts {2}
/** An extraneous processor for arguments */
type TCommandProcessor = (args: ICommandArguments, params: {
    parameters: ICommandParameters
    options: string[]
}, ...extraArgs: any[]) => void
```

## TExtensibleMessage [<Badge text="instances/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/definitions.ts)
经中间件处理后的 `IMessage`，可能包含别的键。

```ts {2}
/** IMessage that has been extended */
type TExtensibleMessage = IMessage & {
    [x: string]: any
}
```

## TMiddleware [<Badge text="classes/middleware/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/middleware/definitions.ts)
中间件处理器 `MiddlewareManager` 可接受的中间件。

```ts {1}
type TMiddleware = (ctx: any, next: () => Promise<void>) => void
```

## TParser [<Badge text="classes/when/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/when/definitions.ts)
条件判断器 `When` 的解析组件。

```ts {2}
/** A type alias for a parser function */
type TParser = (ctx: any, ...extraArgs: any[]) => any | Promise<any>
```

## TSessionFn [<Badge text="classes/session/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/definitions.ts)
会话管理器 `SessionStore` 可接受的会话函数。

```ts {1}
type TSessionFn<T> = (stream: MessageStream<T>) => void
```

## TSessionMatcher [<Badge text="classes/session/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/session/definitions.ts)
会话管理器 `SessionStore` 可接受的会话条件判断函数。

```ts {1}
type TSessionMatcher<T> = (ctx: T) => boolean | Promise<boolean>
```

## TValidator [<Badge text="classes/when/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/when/definitions.ts)
条件判断器 `When` 的判断组件。

```ts {2}
/** A type alias for a validator function */
type TValidator = (ctx: any, ...extraArgs: any[]) => boolean | Promise<boolean>
```

## TValidatorCallback [<Badge text="classes/when/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/when/definitions.ts)
条件判断器 `When` 的判断组件的回调函数。

```ts {2}
/** A type alias for a validator callback function */
type TValidatorCallback = (ctx: any, ...extraArgs: any[]) => void
```

