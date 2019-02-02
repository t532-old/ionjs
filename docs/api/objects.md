# 对象

## receiver [<Badge text="instances/receiver" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/receiver.ts)
Ion.js 使用的上报接收端实例。

```ts {2}
/** The raw receiver */
let receiver: Receiver
```

## sender [<Badge text="instances/sender" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/sender.ts)
Ion.js 使用的消息发送端实例。

```ts {2}
/** The raw sender */
let sender: Sender
```

## sessionCount [<Badge text="0.5.0+" /> <Badge text="instances/session" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/session.ts)
目前运行中的会话计数。

```ts {1}
let sessionCount: number
```

## when [<Badge text="instances/when" />](https://github.com/ionjs-dev/ionjs/tree/master/src/index.ts)
Ion.js 使用的条件判断器实例。

```ts {2}
/** An object for determining when should a session start */
const when: BotWhen
```
