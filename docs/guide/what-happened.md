# 发生了什么？
在上一节，我们刚刚创建了第一个 Ion.js 应用。虽然只有 11 行代码，但 Ion.js 在幕后做了许多事情。

## 应用启动时

### 加载配置
```js
ionjs.init({
    receivePort: 8080,
    sendURL: 'http://localhost:5700',
    operators: [YOUR_QQ_ID, ...],
    self: BOT_QQ_ID,
})
```
通过这段代码，Ion.js 将提供的一系列配置数据分发给各个内部模块：
- `receivePort` 分发给 `receiver`
- `sendURL` 分发给 `sender`
- `operators`, `self` 分发给条件判断器 `when`

### 添加会话
::: tip 参见
- [API: *interface* ISessionContext（会话上下文）](/api/intefaces.html#ISessionContext)
- [API: *class* BotWhen（针对QQ机器人特化的条件判断器）](/api/classes.html#BotWhen)
:::

**会话**是 Ion.js 的两种消息处理器中的一种，通过调用 `ionjs.useSession(条件)(会话)` 来挂载。Ion.js 将在收到符合条件的信息后触发这个会话。
```js
ionjs.useSession(ionjs.when.contain('你好')) (
    async function greet(ctx) {
        await ctx.reply('你好呀!')
    }
)
```
在**条件**部分，我们使用了 Ion.js 的另一个特性：条件判断器 `when`。 `when` 提供了若干种判断消息是否符合条件的 methods，并且支持链式调用，直观简洁。在此处，`when.contain()` 方法用以判断消息是否包含关键词。

在**会话**部分，传入的则是一个 `async function`。它接收一个参数 `ctx`，包含了此次会话的信息和操作方法。在这里，异步方法 `reply()` 用以向发信人发送消息。

### 启动
通过调用 `start()`，Ion.js 开始监听 CQHTTP 的上报数据并将它们交由消息处理器处理。
```js
ionjs.start()
```

## 收到消息时

### 会话之前
::: tip 参见
- [API: *namespace* Utils（CQ码工具函数）](/api/objects.html#Utils)
:::
消息在传到会话前，已经经过了多次处理：
- 酷Q 将腾讯的加密消息解码；
- CQHTTP 将消息编码为 JavaScript 可读的形式；
- Ion.js 将消息统一转换为字符串格式

得益于 Ion.js 对于CQ码转换的完善实现，你最终收到的消息的[上报格式](https://cqhttp.cc/docs/4.7/#/Message)总会是字符串格式，且你可以在两种模式中自由切换。

### 条件判断
::: tip 参见
- [API: *class* SessionManager（会话管理器抽象基类）](/api/class.html#SessionManager)
- [API: *class* SingleSessionManager（一对一会话管理器）](/api/class.html#SingleSessionManager)
- [API: *class* ConcurrentSessionManager（一对多会话管理器）](/api/class.html#ConcurrentSessionManager)
- [API: *class* BotWhen（针对QQ机器人特化的条件判断器）](/api/classes.html#BotWhen)
:::
收到消息后，Ion.js 将会把它传入内部会话管理模块。
- 若对于当前发信者，没有已触发的会话，会话管理模块将依次比对所有已挂载会话的条件，并触发符合条件的会话。
- 如果有，则直接传进已触发的会话的消息流。

### 创建上下文
::: tip 参见
- [API: *interface* ISessionContext（会话上下文）](/api/intefaces#ISessionContext)
- [API: *class* BotWhen （条件判断器）](/api/classes#BotWhen)
:::
若触发了会话，Ion.js 将为其生成上下文，包括关于消息、发送方的信息以及一系列实用方法。
