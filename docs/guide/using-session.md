# 与用户持续交互
::: tip 参见
- API 定义
    - [API: useSession: 注册会话](/api/functions.html#usesession)
:::
迄今为止，我们的 Bot 都只能对单条消息进行处理。在许多场景下，Bot 需要与用户持续交互，而单条处理并不能产生有效率的代码。Ion.js 为这种场景提供了解决方案：session。

要注册 session，导入 `useSession` 函数：
```js
import { useSession } from '@ionjs/core'
```
`useSession` 的用法如下：
```js
useSession(触发条件) (
    async function (ctx) {
        // ctx 是 session 用于与用户交互的对象。
        // ...在这里与用户交互
    }
)
```

我们现在为机器人添加第二个功能：复读。它的功能很简单，仅仅是在有两条相同消息时再发送一遍。

## 触发条件
::: tip 参见
- 拓展阅读
    - [API: BotWhen: 针对QQ机器人特化的条件判断器](/api/classes.html#botwhen)
    - [API: When: 条件判断器基类](/api/classes.html#when)
    - ~~[RCNB.js](https://github.com/coxxs/RCNB.js)~~
- API 定义
    - [API: when: 条件判断器默认实例](/api/objects.html#when)
:::
每个 session 都会有一个触发条件，而触发条件通过对对象 `when` 方法的链式调用来指定：
```js
import { when } from '@ionjs/core'
```

例如，我们只希望接收群消息，则可以写
```js
useSession(when.type('message/group')) (
    async function (ctx) {
        // ...
    }
)
```
要是希望只接收来自管理员和群主的包含 `rcnb` 字符串的消息，则可以写
```js
useSession(when.type('message/group').role('admin').contain('rcnb')) (
    async function (ctx) {
        // ...
    }
)
```

when 的更多用法用法参见 [API 文档](/api/classes.html#botwhen)。

## 与用户交互
::: tip 参见
- 前置知识
    - [CQHTTP 消息格式](https://cqhttp.cc/docs/4.7/#/Message)
- 拓展阅读
    - [API: createSessionManager: 根据会话标识符生成器创建会话管理器](/api/function.html#createsessionmanager)
    - [API: Utils: CQ码工具函数](/api/namespaces.html#utils)
- API 定义
    - [API: useSession: 注册会话](/api/functions.html#usesession)
:::
在 session 中，触发 session 的消息（即第一条消息）存储在 `ctx.init.raw` 中；之后，获取消息则可以使用异步函数 `ctx.get()`。

同时，我们可以通过 `ctx.reply(...)` 函数来回复发送者。

因此，复读功能就可以这样编写：
```js
useSession(when.type('message/group')) (
    async function repeat(ctx) {
        let last = ctx.init.raw // 第一条消息
        while (true) {
            const next = await ctx.get() // 第二条消息
            if (next.message === last.message && next.user_id !== last.user_id) {
                // 第一条与第二条一样，且不是同一个发送者
                await ctx.reply(last.message) // 发送这条消息
                return
            } else last = next // 否则将第一条消息更新为第二条
        }
    }
)
```

但这样还没有完成。我们需要解决其他的问题：
- 当复读内容包括非文字（图片、录音等）消息时，复读的消息会错误地发送CQ码字符串而非真实的媒体内容。
  > 为了解决这个问题，我们可以通过导出的工具函数 `Utils.stringToArray()` 来将消息转换为正确的数组格式。
- 默认情况下，session 只会接收一个用户的消息（而不是全群的消息）。
  > 我们需要将 session 配置的标识符模式从 “群号+QQ号”（`default`）改为 “群号”（`group`）。
- 在复读 session 运行的同时，其他 session 无法同时运行。
  > 我们需要将 session 配置的触发模式改为 “并发”（`concurrent`）。
```js {2,9}
// 这里，useSession() 接受了两个参数，第二个是对 session 的额外配置。
useSession(when.type('message/group'), { concurrent: true, identifer: 'group' }) (
    async function repeat(ctx) {
        let last = ctx.init.raw
        while (true) {
            const next = await ctx.get()
            if (next.message === last.message && next.user_id !== last.user_id) {
                // 在这里，我们将字符串格式的消息转换为数组格式并展开。
                await ctx.reply(...Utils.stringToArray(last.message))
                return
            } else last = next
        }
    }
)
```

session 只要一结束，就可以被再次触发。因此，复读会一直持续。