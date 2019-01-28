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

## 会话 / session
依照上下文，可能指：
- 在满足一定条件时触发的，触发后可以与用户持续交互的行为。
- `ionjs.useSession(...)(...)` 中的参数。运行它将产生一个会话。

## （会话）上下文 / ctx
视情况指两个之一：
- CQHTTP 的上报消息；
- 传进会话的对象，即 `ISessionContext`。

## 条件判断器 / when
即 `class When` 以及所有派生类（以及它们的实例）。

若指的是实例，则它通常会被作为 `ionjs.useSession(...)` 的第一个参数。这将给 Ion.js 提供判断消息是否应该触发一个会话的依据，并可能向传入会话的上下文的 `init` 对象增加一些解析后的信息。

## 中间件 / middleware
指消息在传入会话前经过的一系列异步函数。这些函数通过 `useMiddleware(...)` 注册，对上下文进行适当的处理，并可以控制下一个被注册的中间件的执行。