# 接收和发送消息
你可以通过 Ion.js 导出的 `EventEmitter` 对象 `receiver` 来监听消息并作出处理：
```js
import { receiver } from '@ionjs/core'
```

同时，可以通过 `sender` 对象来发送消息：
```js
import { sender } from '@ionjs/core'
```

## 接收消息
::: tip 参见
- 前置知识
    - [CQHTTP 上报消息格式](https://cqhttp.cc/docs/4.7/#/Post)
    - [Node.js EventEmitter API](https://nodejs.org/dist/latest-v11.x/docs/api/events.html#events_class_eventemitter)
- API 定义
    - [API: receiver: 上报接收端默认实例](/api/objects.html#receiver)
    - [API: Receiver: CQHTTP上报接收端](/api/classes.html#receiver)
:::
Receiver 的所有事件都遵循同一个命名规则：
```
<post_type>[/<<post_type>_type>[/<sub_type>]]
```
例如，对于这个 CQHTTP 上报消息：
```json {3,4,5}
{
    "time": 1515204254,
    "post_type": "message",
    "message_type": "private",
    "sub_type": "friend",
    "message_id": 12,
    "user_id": 12345678,
    "message": "你好～",
    "raw_message": "你好～",
    "font": 456,
    "sender": {
        "nickname": "小不点",
        "sex": "male",
        "age": 18
    }
}
```
它将会触发以下几个事件：
```
post // 任何上报都会触发该事件
message
message/private
message/private/friend
```

现在，我们为 Bot 添加第一个功能：自动同意加群请求，并在成员进群时发送欢迎消息。

我们可以通过标准的 `EventEmitter` API 在 `receiver` 上监听请求加群和成员进群事件：
```js {2,7}
// 请求加群
receiver.on('request/group/add', ctx => {
    // ctx 是 CQHTTP 上报消息对象。
    // ...在这里作出处理
})
// 成员进群
receiver.on('notice/group_increase', ctx => {
    // ...在这里作出处理
})
```

## 发送消息
::: tip 参见
- 前置知识
    - [指南：起步#发送消息](/guide/getting-started.html#发送消息)
- 拓展阅读
    - [API: Sender: CQHTTP消息发送端](/api/classes.html#sender)
    - [API: SenderError: CQHTTP消息发送错误](/api/classes.html#sendererror)
- API 定义
    - [API: sender: 消息发送端默认实例](/api/objects.html#sender)
:::
我们已经在上一节中学习了如何使用 `sender` 发送消息。因此，我们能很容易地补全“成员进群时发送欢迎消息”的代码：
```js {2}
receiver.on('notice/group_increase', ctx => {
    sender.to(ctx).send('欢迎新成员！')
})
```
在这里，我们直接将 `ctx` 传入了 `sender.to()` 来指明发送目标；这是 Ion.js 的推荐做法。

现在，如何实现另外一个功能“自动同意加群请求”呢？Ion.js 为 sender 提供了另外一个函数：
```js {2}
receiver.on('request/group/add', ctx => {
    sender.to(ctx).solveRequest(true)
})
```
`sender.solveRequest()` 中，`true` 代表统一请求，`false` 则代表拒绝请求。`sender` 还有更多用于处理消息的函数，详见 [API 文档](/api/classes.html#sender)。
