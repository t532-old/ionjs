# 使用会话
::: tip 参见
- [API: *function* useSession: 注册会话](/api/functions.html#usesession)
:::

首先，我们观察一下 Ion.js 中会话的概念：
> **会话**，是在满足一定条件时触发的，触发后可以与用户持续交互的行为。

在 Ion.js，我们可以通过导出的柯里化函数 `useSession` 来注册会话：
```js
import { useSession, when } from '@ionjs/core'
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
- [指南: 使用命令](using-commands.html)
- [API: *class* Command: 命令](/api/classes.html#command)
- [API: *interface* ICommandArguments: 命令解析结果(实参)](/api/interfaces.html#icommandarguments)
:::

使用 `when.command(命令名, 参数声明)` 来声明一个命令。其中，命令名也可为数组，这意味着注册多个命令。

关于命令声明的更多信息，见[**使用命令**](using-commands.html)。

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

你还可以指定一个检查器，这样，所有不符合检查器的消息都会被忽略并丢弃：
```js
const nextMessageWithHello = await ctx.get(i => i.indexOf('hello') >= 0)
```

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

## 自定义会话
::: warning 注意
这一部分可能有些难以理解，请尽量看懂。（
:::
通过更高级的会话自定义操作，你可以使会话有更符合你所希望的逻辑。这些自定义由 `ionjs.useSession` 的第二个参数（是一个对象，下称 `options`）指定。

### 会话标识符
::: tip 参见
- [API: *function* createSessionManager: 根据会话标识符生成器创建会话管理器](/api/functions.html#createsessionmanager)
:::

Ion.js 判断消息应该传入哪些会话的依据是将每条消息的**会话标识符**与会话的会话标识符匹配。会话标识符由**会话标识符生成器**产生。通过指定 `options.identifier`，你可以指定会话应该注册到哪个会话标识符生成器下。

Ion.js 默认的会话标识符生成器名称是 `default`，它所生成的的会话标识符是`<user_id> + <contextType> + <unionId>`。例如，`114514message/group/normal1919810` 即为 “在群 `1919810` 中的用户 `114514` 的发送消息行为”。

可选的会话标识符生成器还有：
- `'group'`，仅生成群号；
- `'user'`，仅生成发送者 QQ 号。

你也可以自定义标识符生成器：
```js
ionjs.createSessionManager('my-identifier', ctx => ctx.message)
```
这样，标识符生成器 `'my-identifier'` 生成的会话标识符就是消息的内容。

### 覆盖性与并发性
::: tip 参见
- [API: *class* SingleSessionManager: 一对一会话管理器](/api/classes.html#singlesessionmanager)
- [API: *class* ConcurrentSessionManager: 一对多会话管理器](/api/classes.html#concurrentsessionmanager)
:::

#### 定义
- 所有会话默认是**普通会话**；
- 通过指定 `options.concurrent` 为 `true`，可以使其作为一个**并发会话**被注册。
- 通过指定 `options.override` 为 `true`，可以使其作为一个**优先普通会话**被注册。
- 两者不能同时指定。

#### 规则 
- 并发会话无论当前是否有运行中的会话，都会被触发。
- 普通会话在当前有其他普通会话运行时，不会被触发。
- 优先普通会话无论当前是否有运行中的会话，都会被触发。同时，优先普通会话会强制关闭当前普通会话的消息流。
