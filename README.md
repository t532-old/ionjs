# Ion.js
> Yet another QQ bot framework based on CQHTTP &amp; CoolQ.

## 介绍
Ion.js 是一个用 TypeScript 写就，在 Node.js 环境下运行，基于 [CQHTTP](https://github.com/richardchien/coolq-http-api) 和 [酷Q](https://cqp.cc) 的 QQ 机器人框架。

Ion.js 提供两类消息处理器：中间件和会话。接收到的消息将经过中间件依次处理，并最终分发给会话。得益于 JavaScript 的异步 I/O 与对消息流的封装，开发者可以便捷地创建与用户持续交互的会话；同时，Ion.js 提供了一系列实用工具（甚至一个用以声明命令的 DSL），以更加方便地描述、书写消息处理器。

Ion.js 使用 koa 来与 CQHTTP 通信，同时使用了 Node.js 原生的 `stream.PassThrough` 简单流来构造持续的消息流。

需要注意的是，Ion.js 仍使用的是传统的 HTTP 通信方式，且不内置对会话状态的长期存储（即仅有内存存储）；Ion.js 要求 Node.js 环境支持 ES2017，CQHTTP 插件在版本 4 以上且**使用数组上报方式**。

### 与 [nodebot](https://github.com/trustgit/nodebot) 对比
与 nodebot 相比，Ion.js：
- **是可引入的 CommonJS 模块**，因此无需遵循特定的路径结构；
- **有一系列实用工具**，包括获取消息时的条件判断与CQ码的处理等；
- **支持真正的中间件**，而非遍历执行一组函数；
- **提供更强大的命令声明与解析**，包括具名参数、引号解析、默认值等；
- **支持创建与用户持续交互的会话**，而非仅接收一条信息；
- **npm 包 gzip 后尺寸为 nodebot 的 1/2**；由于 nodebot 无法通过 npm 直接获取，这个尺寸差距仍是保守的。

## 文档
> WIP
>
> Future Home: https://ion.js.org

## 贡献
- 如果本项目对你有帮助，请点一颗 Star。
- 如遇到任何问题，且确定问题来源不是你的代码，请第一时间提出 issue 以便 Ion.js 修复。
- 欢迎 Pull Requests。