# 术语表

## 酷Q / CoolQ
本项目依赖的 QQ 机器人软件，网站 [https://cqp.cc](https://cqp.cc)。

## CQHTTP / CoolQ HTTP API
本项目依赖的酷Q插件，网站 [https://cqhttp.cc](https://cqhttp.cc)。

## Bot
意为生成并向 IM 软件（本文档中主要指 QQ）发送消息的程序。

## Ion.js / ionjs
依照上下文，可能指：
- github organization `ionjs-dev`；
- 本框架，即 npm package `@ionjs/core`；
- `import * as ionjs from '@ionjs/core'` 所导入的对象。

## 用户
指与 Bot 在 IM 中对话的账号。

## session
依照上下文，可能指：
- 在满足一定条件时触发的，触发后可以与用户持续交互的行为。
- 通过 `ionjs.useSession(...)(...)` 注册的 session 模板，在特定情况下被触发。

## ctx / context
指传入会话的，用于与用户交互的 `ISessionContext` 对象。

*有时候，也会偶尔指代 CQHTTP 上报对象。*

## middleware
指消息在传入会话前经过的一系列异步函数。这些函数通过 `useMiddleware(...)` 注册，对上下文进行适当的处理，并可以控制下一个被注册的中间件的执行。