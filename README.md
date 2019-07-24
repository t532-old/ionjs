<!-- Header design from [oh-my-fish](https://github.com/oh-my-fish/oh-my-fish). Distributed under MIT Public License. -->
<img src="https://raw.githubusercontent.com/ionjs-dev/ionjs/master/docs/.vuepress/public/static/logo.png" align="left" width="192px" height="192px"/>
<img align="left" width="0" height="192px" hspace="10"/>

> Yet another QQ bot framework based on CQHTTP & CoolQ & TypeScript.

[![GitHub](https://img.shields.io/github/license/ionjs-dev/ionjs.svg)](https://github.com/ionjs-dev/ionjs/blob/master/LICENSE)
[![Docs](https://img.shields.io/badge/docs-ion.js.org-yellow.svg)](https://ion.js.org)
[![Build status](https://ci.appveyor.com/api/projects/status/hngl103v209a313f?svg=true)](https://ci.appveyor.com/project/trustgit/ionjs)
[![codecov](https://codecov.io/gh/ionjs-dev/ionjs/branch/master/graph/badge.svg)](https://codecov.io/gh/ionjs-dev/ionjs)
[![CodeFactor](https://www.codefactor.io/repository/github/ionjs-dev/ionjs/badge/master)](https://www.codefactor.io/repository/github/ionjs-dev/ionjs/overview/master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ionjs-dev/ionjs.svg)](https://lgtm.com/projects/g/ionjs-dev/ionjs/context:javascript)
[![npm (scoped)](https://img.shields.io/npm/v/@ionj/s.svg)](https://npmjs.org/package/@ionj/s)
[![install size](https://packagephobia.now.sh/badge?p=@ionj/s)](https://packagephobia.now.sh/result?p=@ionj/s)

**Ion.js** 提供了从收发消息、流程控制到内容解析、会话管理的一系列工具，让你能够便捷地使用 TypeScript 开发完整的 QQ Bot 应用。

<br>
<br>

> - **支持创建与用户持续交互的会话**，提供开发者友好的异步 I/O API；
> - **拥抱现代 JavaScript**，使用 ES2017；
> - **有一系列实用工具**，包括元数据注册、CQ码预处理等；
> - **提供更强大的消息解析**，包括具名参数、引号转义、默认值等；
> - **支持真正的中间件**，数据传至下游、控制传回上游；
> - **框架各部分互相独立**，提供最高的自由度。

## 安装
Ion.js 的 npm 包名是 `@ionj/s`。😜
```sh
npm install @ionj/s
```

## 介绍
你可以通过几个简单的例子来初步了解 Ion.js 的结构。要深入了解，见[文档](https://ion.js.org)。

### 初始化
各个部分的初始化是分离的；你可以分别初始化*接收端*、*发送端*和*应用*：
```js
import { init as initReceiver } from '@ionj/s/app/receiver'
import { init as initSender } from '@ionj/s/app/sender'
import { start } from '@ionj/s'

initReceiver({ port: 8080 }) // 初始化接收端（Webhook）
initSender({ url: 'http://localhost:5700' }) // 初始化发送端

start() // 初始化应用
```

### 创建会话
Ion.js 的核心思想即是基于会话。它的理念是，开发者应该能够在任何时间便捷地获取和发送消息，并且在此期间自由地管理状态。

通过检测消息是否符合条件，Ion.js 可以决定什么时候创建会话。实现一个 Ping 功能很简单：
```js
import { useSession } from '@ionj/s/app/session'
import { MessageTransform } from '@ionj/s/transform/message'

useSession(
    new MessageTransform()
    .matchesRegex(/ping/i) // matchesRegex 将消息与正则表达式匹配
) (
    async function (ctx) {
        await ctx.reply('Pong!')
        // 执行到结尾后，会话自动退出
    }
)
```
这段代码体现了两个 Ion.js 组件：`useSession` 和 `MessageTransform`。

通过 `useSession(condition)(behavior)` 函数，我们可以指定创建会话的逻辑：
- 在一条消息满足 `condition` 时，创建一个会话，执行 `behavior` 作为它的行为。
- 而 `behavior` 就是一个异步函数，它可以通过传入的 `ctx` 对象来发送/获取消息，或者执行其他高级操作。

这段代码中，`MessageTransform` 是一个 `Transform` 类。
Ion.js 中 `Transform` 用于快速创建用于 `useSession` 的检测条件。它包含了两层含义：
- 检测一条消息是否符合一个条件，如果不符合则不启动会话；
- 将消息预处理，这样开发者获取的消息已经附加了有用的额外信息。

### 获取消息
Ion.js 在提供便利的同时也有极大的自由度，允许你随时获取消息，或者更改会话的设定。

以下代码实现了复读功能，即，如果出现三条相同的消息，Bot 也会发送这条消息：
```js
import { useSession } from '@ionj/s/app/session'
import { always } from '@ionj/s/transform/util'

const REPEAT_COUNT = 3
useSession(
    always, // always 是特殊的 Transform；它放行一切消息
    { identifier: 'group', concurrent: true } // 以群为单位接收消息，而非以用户为单位
) (
    async function (ctx) {
        const { message: initMessage } = await ctx.get() // 通过 ctx.get() 来获取一条消息
        let repeatCount = 1
        while (true) {
            const { message } = await ctx.get() // 还可以获取后续的更多条消息！
            if (message !== initMessage) return
            repeatCount++
            if (repeatCount === REPEAT_COUNT) {
                await ctx.reply(initMessage)
                return // 退出会话，等待下一轮复读
            }
        }
    }
)
```

`ctx.get()` 提供了持续获取消息的接口，这使得程序流可以不被打断，开发者得以写出更加简短、优美的代码逻辑。

## 贡献
- 如果本项目对你有帮助，请点一颗 Star。
- 如遇到任何问题，且确定问题来源不是你的代码，请第一时间提出 issue 以便我们修复。
- 欢迎 Pull Requests。
