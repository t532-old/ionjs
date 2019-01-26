# 使用命令
::: tip 参见
- [指南: 使用会话#命令](using-sessions.html#命令)
- [API: *class* BotWhen: 针对QQ机器人特化的条件判断器](/api/classes.html#botwhen)
:::

Ion.js 提供了强大、稳定的命令声明与解析。你可以在[注册会话](using-sessions.html)时，对 `when` 调用 `command()`方法（i.e. `when.command(...)`）来声明这个会话对应的命令。
```js {2}
import { when } from '@ionjs/core'
when.command('命令名', '参数列表', { ... /* 附加选项 */ })
```

## 命令名与前缀
::: tip 参见
- [API: *function* init: 加载配置](/api/functions.html#init)
:::

在 `ionjs.init()` 中，你可以指定 `prefixes` 字段为一个数组，则在注册命令时，会自动将这些前缀添加到命令前。

同时，在 `when.command()` 中，你可以将命令名（i.e. 第一个参数）指定为一个数组，则它们都会被注册为命令。

如若你不想使用全局前缀，你可以将 `when.command()` 的第三个参数的 prop `withPrefixes` 改为 `false`。

## 参数列表
`when.command()` 的第二个参数是一个字符串，用以表明这个命令的参数列表。字符串中各个参数声明由空格分割。

::: warning 注意
如果你要在一个参数中包含空格，请用任意一种引号括起；如果你在参数中包含了引号，请使用 `\` 转义。

用户输入命令的时候，这条规则同样有效。
:::

### 必须与可选
每个参数名周围必须由两种限定符的一种包裹：
- `<...>` 意为必选参数；如果用户未填写，将请求用户填写。
- `[...]` 意为可选参数；如果未填写则为 `undefined`。

::: tip 提示
下面例子均使用 `<...>` 限定符，但你可以将它们替换为 `[...]`。
:::

### 参数名
下面参数示例中的 name 即为参数名：
```
<name>
```
用户键入命令时，可以直接按顺序给出参数，也可以使用 `<键>=<值>` 形式，如 `name=RichardChienWuDi`。

### 不排序参数
下面参数示例是一个不排序参数，我们使用参数名前的一个 `?` 来标识：
```
<?name>
```
对于不排序参数，只能使用 `<键>=<值>` 形式。

### 别名
下面参数示例包含别名，由参数名后的 `(...)` 指定：
```
<name(#)>
```
对于指定的别名的参数，可以通过 `<别名><值>` 的形式指定，如 `#CoxxsWudi` 等价于 `name=CoxxsWudi`。

### 默认值
下面的实例包含默认值，如果用户没有指定这个参数的值，它将被默认值代替。
```
<name>=defaultValue
```

### 选项
如果你填入了一个不符合参数格式的参数，它自动成为一个选项（布尔开关）：
```
--i-am-an-option
```
用户可以通过在命令里包含这段字符串来触发这个选项。

## 附加选项
`when.command()` 的第三个参数是一个对象（下称 `options`），包含可选的附加选项。

### 不使用全局前缀
将 `options.withPrefixes` 改为 `false` 以不使用全局前缀。

### 命令参数类型转换
你可以通过指定 `options.types` 每个命令参数应该转换为什么CQ码类型：
```js
{
    ...,
    types: {
        arg1: 'rawstring', // 转义后的字符串
        arg2: 'string', // 转义前的字符串
        arg3: 'any', // 数组
        arg4: 'image', // 只包含某一类 CQ 码的数组
                       // 可以指定 [CQ:*] 中的任意类型
        ...,
    },
    ...,
}
```

### 命令参数询问
当用户未填写必填参数时，你可以通过指定 `options.prompts` 来尝试让用户再次发送参数：
```js
// 通用询问
{
    ...,
    prompts: 'Please enter the argument {}', // {} 将被替换为参数名称
    ...,
}
// 分别指定
{
    ...,
    prompts: {
        $default: 'Please enter the argument {}', // {} 将被替换为参数名称
        arg1: 'FATAL: Please enter the arguemnt arg1',
        ...
    },
    ...,
}
```

### 参数验证
你也可以通过指定 `options.validators` 为参数指定验证函数：
```js
{
    ...,
    validators: {
        arg1: arg => arg.startsWith('hello'),
        arg2: arg => arg.split(',').length > 1,
        ...
    }
}
```

## 读取结果
::: tip 参见
- [API: *interface* ICommandArguments: 命令解析结果(实参)](/api/interfaces.html#icommandarguments)
:::

转换的结果将被存储在会话上下文的 `init.command` （i.e. `ctx.init.command`）内，符合接口 `ICommandArguments`。

### 正常参数
用户提供的所有能在参数列表中找到对应参数名的参数都被存储在 `ctx.init.command.arguments` 内。
::: tip 示例
- `ctx.init.command.arguments['name']` 代表了用户提供的 `name` 参数。
:::

### 选项
如果用户触发了选项，那么这个选项的文本将被存储在 `ctx.init.command.options` 数组内。

### 余下参数
如果用户提供的参数有多余，那么多余的参数将被存储在 `ctx.init.command.rest` 数组内。