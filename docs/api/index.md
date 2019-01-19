# API 列表
这里列举了所有导出的命名空间、类、接口、对象、函数、类型别名。

所有下面列出的项目都遵循格式`<导出名字>: <描述>`。它们都可以通过以下方式导入：
```js
const { name } = require('@ionjs/core')
// Or ES6 Import
import { name } from '@ionjs/core'
```

## 命名空间 (*namespace*)
::: tip 命名格式
- PascalCased
:::
- [Codes: CQ码生成函数](namespaces.html#codes)
- [Utils: CQ码工具函数](namespaces.html#utils)

## 工具函数 (tool *function*)
::: tip 命名格式
- camelCased
:::
- [contextTypeOf: CQHTTP上报类型代码](tool-functions.html#contexttypeof)
- [escapeArgument: 转义命令参数](tool-functions.html#escapeargument)
- [unionIdOf: 发信人所在群号或讨论组号或QQ号](tool-functions.html#unionidof)

## 对象 (*object*)
::: tip 命名格式
- camelCased
:::
- [receiver: 上报接收端默认实例](objects.html#receiver)
- [sender: 消息发送端默认实例](objects.html#sender)
- [when: 条件判断器默认实例](objects.html#when)

## 函数 (*function*)
::: tip 命名格式
- camelCased
:::
- [createSessionManager: 根据会话标识符生成器创建会话管理器](functions.html#createsessionmanager)
- [init: 加载配置](functions.html#init)
- [runMiddleware: 将给定的上下文传入中间件管理器](functions.html#runmiddlewares)
- [runSession: 将给定的上下文传入会话管理器](functions.html#runsession)
- [start: 接收端开始监听](functions.html#start)
- [useMiddleware: 注册中间件](functions.html#usemiddleware)
- [useSession: 注册会话](functions.html#usesession)

## 类型别名 (*type*)
::: tip 命名格式
- 以大写字母 `T` 开头
- PascalCased
:::
- [TCommandProcessor: 命令处理器](types.html#tcommandprocessor)
- [TMiddleware: 中间件](types.html#tmiddleware)
- [TParser: 条件判断器解析组件](types.html#tparser)
- [TSessionFn: 会话](types.html#tsessionfn)
- [TSessionMatcher: 会话条件判断函数](types.html#tsessionmatcher)
- [TValidator: 条件判断器判断组件](types.html#tvalidator)

## 类 (*class*)
::: tip 命名格式
- PascalCased
:::
- [BotWhen: 针对QQ机器人特化的条件判断器](classes.html#botwhen)
- [Command: 命令](classes.html#command)
- [CommandParseError: 命令解析错误](classes.html#commandparseerror)
- [ConcurrentSessionManager: 一对多会话管理器](classes.html#concurrentsessionmanager)
- [MessageStream: 会话消息流](classes.html#messagestream)
- [MessageStreamError: 会话消息流错误](classes.html#messagestreamerror)
- [MiddlewareManager: 中间件管理器](classes.html#middlewaremanager)
- [Receiver: CQHTTP上报接收端](classes.html#receiver)
- [Sender: CQHTTP消息发送端](classes.html#sender)
- [SenderError: CQHTTP消息发送错误](classes.html#sendererror)
- [SessionManager: 会话管理器抽象基类](classes.html#sessionmanager)
- [SingleSessionManager: 一对一会话管理器](classes.html#singlesessionmanager)
- [When: 条件判断器基类](classes.html#when)

## 接口 (*interface*)
::: tip 命名格式
- 以大写字母 `I` 开头
- PascalCased
:::
- [IBaseResult: CQHTTP响应](interfaces.html#ibaseresult)
- [ICommandArguments: 命令解析结果(实参)](interfaces.html#icommandarguments)
- [ICommandParameters: 命令参数描述(形参)](interfaces.html#icommandparameters)
- [ICQCode: CQ码](interfaces.html#icqcode)
- [ICredentialsResult: CQHTTP凭据响应](interfaces.html#icredentialsresult)
- [IGroupListResult: CQHTTP群组列表响应](interfaces.html#igrouplistresult)
- [IMemberInfoResult: CQHTTP群组成员信息响应](interfaces.html#imemberinforesult)
- [INoneResult: CQHTTP无附加信息响应](interfaces.html#inoneresult)
- [IPluginStatusResult: CQHTTP插件状态响应](interfaces.html#ipluginstatusresult)
- [IPluginVersionInfoResult: CQHTTP插件版本信息响应](interfaces.html#ipluginversioninforesult)
- [IRecordResult: CQHTTP语音转换响应](interfaces.html#irecordresult)
- [ISelfInfoResult: CQHTTP登录号信息响应](interfaces.html#iselfinforesult)
- [ISendResult: CQHTTP发信响应](interfaces.html#isendresult)
- [IStrangerInfoResult: CQHTTP用户信息响应](interfaces.html#istrangerinforesult)