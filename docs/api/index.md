# API 列表
这里列举了所有导出的命名空间、类、接口、对象、函数、类型别名。

所有下面列出的项目都遵循格式`<导出名字>: <描述>`。它们都可以通过以下方式导入：
```js
const { name } = require('@ionjs/core')
// Or ES6 Import
import { name } from '@ionjs/core'
```

在 API 的详细说明中，每个标题旁都会有一个<Badge text="像这样的" /> Badge，点击它可以去到定义这个 API 的源文件。

API 的描述是 TypeScript 自动生成的 `.d.ts`，如果不了解 TypeScript，请阅读 [TypeScript 文档](https://www.typescriptlang.org)。

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
- [sessionCount: 会话计数](objects.html#sessioncount) <Badge text="0.5.0+" />
- [when: 条件判断器默认实例](objects.html#when)

## 函数 (*function*)
::: tip 命名格式
- camelCased
:::
- [createSessionManager: 根据会话标识符生成器创建会话管理器](functions.html#createsessionmanager)
- [getAllModuleMetadata: 获取模块元信息列表](functions.html#getmodulemetadata) <Badge text="0.6.0+" />
- [getAllRegistrationMetadata: 获取模块注册元信息列表](functions.html#getmodulemetadata) <Badge text="0.6.0+" />
- [getModuleMetadata: 获取模块元信息](functions.html#getmodulemetadata) <Badge text="0.6.0+" />
- [getRegistrationMetadata: 获取单注册元信息](functions.html#getregistrationmetadata) <Badge text="0.6.0+" />
- [init: 加载配置](functions.html#init)
- [runMiddleware: 将给定的上下文传入中间件管理器](functions.html#runmiddlewares)
- [runSession: 将给定的上下文传入会话管理器](functions.html#runsession)
- [start: 接收端开始监听](functions.html#start)
- [useMiddleware: 注册中间件](functions.html#usemiddleware)
- [useModuleMetadata: 注册模块元信息](functions.html#usemodulemetadata) <Badge text="0.6.0+" />
- [useRegistrationMetadata: 注册单注册元信息](functions.html#useregistrationmetadata) <Badge text="0.6.0+" />
- [useSession: 注册会话](functions.html#usesession)

## 类型别名 (*type*)
::: tip 命名格式
- 以大写字母 `T` 开头
- PascalCased
:::
- [TCommandProcessor: 命令处理器](types.html#tcommandprocessor) <Badge text="0.3.0-" type="error" />
- [TExtensibleMessage: 扩展后消息](types.html#textensiblemessage)
- [TMiddleware: 中间件](types.html#tmiddleware)
- [TParser: 条件判断器解析组件](types.html#tparser)
- [TSessionFn: 会话](types.html#tsessionfn)
- [TSessionMatcher: 会话条件判断函数](types.html#tsessionmatcher)
- [TValidator: 条件判断器判断组件](types.html#tvalidator)
- [TValidatorCallback: 条件判断器判断回调](types.html#tvalidatorcallback)

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
- [SessionStore: 会话管理器抽象基类](classes.html#sessionstore)
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
- [IInfoResult: CQHTTP用户信息响应](interfaces.html#iinforesult) <Badge text="0.2.0+" />
- [IMemberInfoResult: CQHTTP群成员信息响应](interfaces.html#imemberinforesult) <Badge text="0.2.0-" type="error" />
- [IMessage: CQHTTP上报消息](interfaces.html#imessage) <Badge text="0.2.0+" />
- [IModuleMetadata: 模块元信息](interfaces.html#imodulemetadata) <Badge text="0.6.0+" />
- [INoneResult: CQHTTP无附加信息响应](interfaces.html#inoneresult)
- [IPluginStatusResult: CQHTTP插件状态响应](interfaces.html#ipluginstatusresult)
- [IPluginVersionInfoResult: CQHTTP插件版本信息响应](interfaces.html#ipluginversioninforesult)
- [IRecordResult: CQHTTP语音转换响应](interfaces.html#irecordresult)
- [IRegistrationMetadata: 单注册元信息](interfaces.html#iregistrationmetadata) <Badge text="0.6.0+" />
- [ISelfInfoResult: CQHTTP登录号信息响应](interfaces.html#iselfinforesult)
- [ISendResult: CQHTTP发信响应](interfaces.html#isendresult)
- [ISessionContext: Ion.js 扩展会话上下文](interfaces.html#isessioncontext)
- [IStrangerInfoResult: CQHTTP用户信息响应](interfaces.html#istrangerinforesult) <Badge text="0.2.0-" type="error" />