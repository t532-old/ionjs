# 接收端与CQ码函数

## 接收端
::: tip 参见
- [API: *object* receiver: 上报接收端默认实例](/api/objects.html#receiver)
- [API: *class* Receiver: CQHTTP上报接收端](/api/classes.html#receiver)
:::

除了注册中间件或会话，你还可以直接监听 CQHTTP 的上报事件：
```js {1}
import { receiver } from '@ionjs/core'
receiver.on('any_event', ctx => {
    ... // Do something
})
```
### 可监听的事件列表
::: tip 格式
所有 `<...>` 代表将其替换为上报数据内的对应字段。
:::
::: warning 注意
`'/'` 不代表“或”；它是事件名称的一部分.
:::

- `'post'` i.e. 所有上报事件
- `'<post_type>'`
- `'<post_type>/<<post_type>_type>'`
- `'<post_type>/<<post_type>_type>/<sub_type>'`

## CQ码
### 生成
::: tip 参见
- [API: *namespace* Codes: CQ码生成函数](/api/namespaces.html#codes)
:::

在 Ion.js 中，所有执行“发送消息”动作的函数都接受不定量的参数。它们除了是字符串，还可以是CQ码。

导入CQ码生成函数并生成一个图片CQ码：
```js {2}
import { Codes } from '@ionjs/core'
Codes.Image('/path/to/file') // => { type: 'image', data: { url: 'path/to/file' } }
```

### 转换
通常，你会用到两个转换函数，它们来自命名空间 `Utils`：
``` js {3,5}
import { Utils } from '@ionjs/core'
// 字符串消息转为数组
Utils.stringToArray('&amp;message[CQ:image,url=https://example.com/test.jpg]')
// 数组消息转为字符串
Utils.arrayToString([
    { type: 'text', data: { text: '&message' } },
    { type: 'image', data: { url: 'https://example.com/test.jpg' } },
])
```
