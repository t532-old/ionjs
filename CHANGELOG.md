# Changelog

## Unrealeased
- [Remove] 移除一切附属 package 并停止开发附属 package

## 0.4.0
- [Change] 将处理队列的超时在 `init({...})` 中更名为 `middlewareTimeout`
- [Change] 增加会话的默认超时，在 `init({...})` 中为 `sessionTimeout`，并可在 `ISessionContext#timeout` 中使用 setter 重置

## 0.3.1
- [Add] 增加了一些 logger
- [Security] 增加了若干对用户代码的 error `catch`es

## 0.3.0
- [Add] 增加部分文档
- [Change] 重构了 `CommandParseError`，增加了 prop `args`, `notGiven`
- [Remove] 移除了 `Command#parse()` 的第二个参数并改为同步函数
- [Change] 重构了 `BotWhen#command()`
- [Add] 开始开发附属 package：`auto-accept`

## 0.2.0
- [Add] 增加部分文档
- [Change] 将 `IStrangeInfoResult`, `IMemberInfoResult` 合并为 `IInfoResult`
- [Change] 将 `SessionStore` 改为泛型类
- [Add] 向 `When` 类添加 `TValidatorCallback` 作为 `TValidator` 的回调
- [Change] 将 `MiddlewareManager` 改为泛型类
- [Add] 增加接口 `IMessage` 用以表示 CQHTTP 上报消息，`TExtensibleMessage` 用以表示包含其他 props 的 `IMessage`

## 0.1.3
- [Security] 增加处理队列的超时时间

## 0.1.2
- [Add] 增加部分文档
- [Add] 导出实用函数 `unionIdOf()`
- [Fix] 修复 `default` 会话管理器错误的会话标识符
- [Fix] 修复 `Utils` 中 `filterType()` 的 bug
- [Security] 使用 Promise-based 处理队列来保证会话处理的稳定性

## 0.1.0, 0.1.1
- [Add] 迁移 `ionjs-dev/adapter-cqhttp` => `classes/receiver`, `classes/sender`, `classes/cqcode`
- [Add] 迁移 `ionjs-dev/flow` => `classes/session`
- [Add] 迁移 `ionjs-dev/command` => `classes/command`
- [Add] 迁移 `ionjs-dev/chan/middleware` => `classes/middleware`
- [Fix] `Sender#to()` 方法现在返回一个新的实例
- [Remove] 删除了 `SessionManager#removeBehavior()`
- [Change] 更改了 debug loggers 中的类名和模块名，微调级别
- [Add] 增加了 `Command` 类的 typings
- [Add] 增加了 `CommandParseError` 类作为 `Command#parse()` 抛出的错误类型
- [Add] 增加了 `Command#parse()` 的第二个参数作为参数处理器
- [Change] 将 `Command#parse()` 改为异步函数
- [Fix] 使用与 koa 相同的正确的中间件实现
- [Add] 增加类型别名 `TMiddleware`
- [Change] `SessionManager` 改为 `SessionStore` 抽象基类
- [Change] `SessionStore#addBehavior(IBehavior)` 改为 `SessionStore#use(...any)`，`SessionStore#push(any)` 改为 `SessionStore#run(any)`
- [Add] 增加类型别名 `TSessionFn, TMatcher`
- [Change] `ConcurrentSessionManager#use` 参数列表改为 `(TSessionFn, TMatcher)`
- [Change] `SingleSessionManager#use` 参数列表改为 `(TSessionFn, TMatcher)`
- [Add] 增加了默认中间件管理器实例
- [Add] 增加了导出函数 `init()`, `start()`, `useMiddleware()`, `useSession()()`, `runMiddleware()`, `runSession`
- [Add] 为 `split()` 增加了自定义分隔符与界定符
- [Add] 增加接口 `ICQCode`
- [Change] 将 Sender 请求结果接口加上统一后缀 `Result`
- [Add] 增加 `When` 类，用来生成判断条件以及解析上报对象
- [Add] 增加 `When` 实例的默认导出
- [Add] 增加默认会话管理器实例
- [Add] 增加会话上下文接口 `ISessionContext`
- [Add] 增加导出实用函数 `contextTypeOf()`
- [Security] 预防了 `*SessionManager` 可能的内存泄露
- [Change] 将 package 重命名为 `@ionjs/core`
