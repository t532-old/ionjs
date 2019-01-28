# 使用中间件
::: tip 参见
- [API: *function* useMiddleware: 注册中间件](/api/functions.html#usemiddleware)
:::

如果你之前使用过 [koa](https://koajs.com) 或类似的中间件系统，你应该已经对中间件的概念很熟悉了。

## 注册
在 Ion.js 中，我们通过函数 `useMiddleware` 来注册中间件：
```js
import { useMiddleware } from '@ionjs/core'
useMiddleware(async (ctx, next) => {
    ...
    await next()
})
```

它只接受一个函数（可以为异步）。
- 这个函数的第一个参数（`ctx`）是 `TExtensibleMessage`，即经上一个中间件处理后的 CQHTTP 上报消息。
- 第二个参数（`next`）则是一个异步函数，只有调用它，下一个中间件才能得以执行。

::: warning 注意
Ion.js 默认注册了一个中间件，它负责将信息传入会话管理器。因此，你注册的最后一个中间件若想使会话正确执行，也应该调用 `await next()`。
:::

## 消息预处理
通过中间件，我们可以对上报的消息进行统一的预处理：
```js
useMiddleware(async (ctx, next) => {
    ctx.modified = true
    await next()
})
```

## 过滤消息
或者，我们也可以进行消息过滤。下面这个例子只放行包含 `'hello'` 的消息：
```js
useMiddleware(async (ctx, next) => {
    if (ctx.message.indexOf('hello') >= 0) await next()
    else return
})
```

## 中间件超时
Ion.js 默认在中间件处理超过 10s 后中止对这条信息的处理并记录一条 warning。你可以在 `ionjs.init()` 中更改这个超时（单位为 ms）：
```js
ionjs.init({
    ...,
    timeout: 20000,
})