# 使用会话
::: tip 参见
- [API: *function* useSession: 注册会话](/api/functions.html#usesession)
:::

首先，我们观察一下 Ion.js 中会话的概念：
> **会话**，是在满足一定条件时触发的，触发后可以与用户持续交互的行为。

在 Ion.js，我们可以通过导出的柯里化函数 `useSession` 来注册会话：
```js
import { useSession, when } from 'ionjs'
useSession(when./* 链式调用 */) (
    async function mySession(ctx/* 会话上下文 */) {
        ...
    }
)
```

## 使用 When 进行条件判断
::: tip 参见
- [API: *object* when: 条件判断器默认实例](/api/objects.html#when)
- [API: *class* BotWhen: 针对QQ机器人特化的条件判断器](/api/classes.html#botwhen)
:::
when 是类 `BotWhen` 的一个实例，它是 Ion.js 条件判断器的默认实例。通过它我们可以便捷地进行对上报消息的条件判断。

某些方法同时也会往会话上下文的 `init` 对象中添加数据。

### 包含字符串
`when.contain(...)` 接受一个或多个字符串，用以判断消息是否包含这些字符串中的任意一个。

你也可以**只**传入**一个** `RegExp`，来判断消息是否匹配正则。

> 这个方法同时向上下文的 `init` 对象添加数组 `contain`（i.e. `ctx.init.contain`），为匹配到的字符串数组或正则的 match 结果。

### 判断权限
`when.role(...)` 可以用来判断发送者的权限，有四种选项：
- `'everyone'` *default*：任何人。
- `'admin'`：群管理员或私信。
- `'owner'`：群主或私信。
- `'operator'`：`ionjs.init()` 配置中 `operators` 字段指定的 QQ 号。

### 判断消息类型
::: tip 参见
- [API: *function* contextTypeOf: CQHTTP上报类型代码](/api/tool-functions.html#contexttypeof)
:::

`when.type(...)` 可以用来判断消息类型。可以传入单个或多个类型字符串。

消息类型应该是标准的 `ionjs.contextTypeOf(ctx)` 返回的字符串，默认为 `'message'`。

> 这个方法同时向上下文的 `init` 对象添加数组 `type`（i.e. `ctx.init.type`），为匹配到的上报类型。

### 判断 @
`when.at()` 意味着只有含有 @ 配置内 `self` 的消息可以触发。

### 自定义条件
使用 `when.match(...)` 可以添加自定义条件。
- 若传入函数，则按照函数返回值是否为 Truthy 来判断；
- 若传入对象，则对每个 key 递归检测；
- 递归检测若传入函数，则也按照函数返回值是否为 Truthy 来判断；
- 递归检测若传入可枚举值，则按照 `===` 判断；
- 递归检测若传入 `RegExp`，则按照 `regex.test(...)` 判断。

### 命令
::: tip 参见
- [指南: 使用命令](use-commands.html)
- [API: *class* Command: 命令](/api/classes.html#command)
- [API: *interface* ICommandArguments: 命令解析结果(实参)](/api/interfaces.html#icommandarguments)
:::

使用 `when.command(命令名, 参数声明)` 来声明一个命令。其中，命令名也可为数组，这意味着注册多个命令。

关于命令声明的更多信息，见[**使用命令**](use-commands.html)。

> 这个方法同时向上下文的 `init` 对象添加 `command`（i.e. `ctx.init.command`），为 `ICommandArguments`。

## 使用上下文与用户交互
一旦会话被创建，Ion.js 将生成对应的会话上下文（下文称 `ctx`）并将其作为传入会话的唯一参数。通过会话上下文，你可以与用户进行交互。

### 获取消息
Ion.js 默认不会对获取到的上报消息进行包装，因此你获取到的是标准的 [CQHTTP 上报数据](https://cqhttp.cc/docs/4.7/#/Post)。

第一条消息，即触发会话的消息，位于 `ctx.init.raw`。

若要继续获取消息，只需要调用异步函数 `ctx.get()`：
```js
const nextMessage = await ctx.get()
```

Ion.js 将等待用户发来下一条消息并在收到后使 `ctx.get()` 返回这条消息。

### 发送消息
通过函数 `ctx.reply()` 可以回复发送者：

```js
await ctx.reply('你好！')
```

### 询问
询问操作发送一条消息并等待用户的消息：
```js
const usersName = await ctx.question('你的名字是什么？')
```

### 转发
::: warning 注意
通常，在调用 `ctx.forward()` 后会话不能 `await` 异步操作，除非这个会话是 concurrent 的。
:::

有时，你需要对用户传来的消息进行加工以让它符合其他会话的条件。`ctx.forward()` 提供了这种功能。

假设我们有一个命令 `!send-hello <n>`，它使 Bot 发送 "Hello" n 次。此时我们需要一个命令 `!5-hellos` 来发送 5 次 "Hello"，就可以在 `!5-hellos` 的会话中如此编写：
```js
async function fiveHellos(ctx) {
    ctx.forward('!send-hello 5')
}
```

### 其他
::: tip 参见
- [API: *class* Sender: CQHTTP消息发送端](/api/classes.html#sender)
- [API: *class* MessageStream: 会话消息流](/api/classes.html#messagestream)
:::

`ctx` 还包含了：
- `ctx.sender`：默认绑定到 `ctx.init.raw` 的 `Sender` 实例。
- `ctx.stream`：当前会话的 `MessageStream` 消息流。