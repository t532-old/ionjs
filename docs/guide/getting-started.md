# 起步

## 初始化
::: tip 参见
- API 定义
    - [API: init: 加载配置](/api/functions.html#init)
:::
在书写 Bot 的代码前，你需要通过调用 `init({ ... })` 来进行初始化：
```js
init({
    receivePort: 8080, // Ion.js 将监听的端口，i.e. CQHTTP 配置中的 post_url 的端口。
    receiveSecret: '<your-secret>', // CQHTTP 配置的 secret。没有则忽略。
    sendURL: 'http://localhost:5700', // CQHTTP API 监听的 URL。
    sendToken: '<your-token>', // CQHTTP 配置的 token。没有则忽略。
    operators: [YOUR_QQ_ID, ...], // Bot 的管理者列表，可忽略
    self: BOT_QQ_ID, // Bot 自身的 QQ 号
})
```

## 发送消息
::: tip 参见
- 拓展阅读
    - [API: Sender: CQHTTP消息发送端](/api/classes.html#sender)
    - [API: SenderError: CQHTTP消息发送错误](/api/classes.html#sendererror)
- API 定义
    - [API: sender: 消息发送端默认实例](/api/objects.html#sender)
:::
Ion.js 使用导出的对象 `sender` 来发送消息。下面，我们使 Bot 每分钟向 QQ 号 `1145141919` 发送一条问候：

```js
setInterval(async () => {
    await sender.to({ // to() 方法指定这条消息的接收方
        message_type: 'private',
        user_id: 1145141919,
    }).send('你好哇')
}, 30 * 60 * 1000)
```

## 启动
::: tip 参见
- API 定义
    - [API: start: 接收端开始监听](/api/functions.html#start)
:::
最后，我们通过一个简单的 `start` 函数调用来启动 Bot：
```js
start()
```
运行它然后等待来自 Bot 的消息：
```bash
node .
```
恭喜你：你已经创建了你的第一个 Ion.js Bot！接下来，我们将扩展它，使它支持更多的功能。