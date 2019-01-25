# 工具函数

## contextTypeOf [<Badge text="classes/receiver/utils" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/utils.ts)
获取上报数据的上报类型。

```ts {1}
function contextTypeOf(ctx: any): string[]
```

## escapeArgument [<Badge text="classes/command/utils" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/utils.ts)
将字符串转义使其成为合法的单个命令实参。

```ts {5}
/**
 * escape a string so that it is a legal command argument
 * @param str The string that needs to be escaped
 */
function escapeArgument(str: string): string
```

## unionIdOf [<Badge text="classes/receiver/utils" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/utils.ts)
若上报消息来自群组，返回群号/讨论组；否则返回QQ号。

```ts {1}
function unionIdOf(ctx: any): number
```