# 深入会话

## 会话选项
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

## 消息流
::: tip 参见
- [API: *function* useSession: 注册会话](/api/functions.html#usesession)
- [API: *interface* ISessionContext: 会话上下文](/api/interfaces.html#isessioncontext)
- [API: *class* MessageStream: 会话消息流](/api/classes.html#messagestream)
:::

通过 `useSession()` 注册的会话所获得的上下文（下称 `ctx`）提供了可以异步获取消息的 `ctx.get()` 方法。
::: warning 注意
通过 `ctx.get()` 方法获得的是原本上报对象的副本，因此你在修改它时，其它会话的 `get()` 获得的消息不受影响。
:::
在内部，Ion.js 使用 `MessageStream` 消息流向会话传递消息。因此，你可以通过 `ctx.stream` 来访问该会话的原始消息流。

- `ctx.stream.get()` 几乎等效于 `ctx.get()`，但你获得的是**对象原件**，因此**对它的修改会影响到其它访问同一对象的会话**。
- `ctx.stream.waste()` 用于将现在流中残留的消息以及之后流入的消息全部忽略，而 `ctx.stream.keep()` 用于停止这种行为。
- `ctx.stream.free()` 用于你已经不需要获取消息，并且希望其它会话能够启动的情况下。当前流将被中止并删除。

::: warning 注意
事实上，`ctx.stream.waste()` 与 `ctx.stream.keep()` 是 `ctx.stream.resume()` 和 `ctx.stream.pause()` 的同义词。
:::
