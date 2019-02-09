# 欢迎
欢迎来到 Ion.js 教程！在这个教程里，我们将通过编写一个真实的 QQ Bot 来学习 Ion.js。

::: tip 前置知识
本文档假定你知道如何使用 JavaScript（包括 ES6/7 的新语法）、[Node.js](https://nodejs.org)、[npm](https://npmjs.com)，并且拥有一定的自主理解能力。
:::

## 预先准备
Ion.js 的这些依赖项需要你手动安装：

- CoolQ（[网站](https://cqp.cc)）用来发送 QQ 信息；
- CoolQ HTTP API（CQHTTP）（[网站](https://cqhttp.cc)）用来实现本框架与 CoolQ 的交互。

你应该需要对 CQHTTP 进行一些配置，确保 [CQHTTP 作为 HTTP 服务器](https://cqhttp.cc/docs/4.7/#/CommunicationMethods?id=%E6%8F%92%E4%BB%B6%E4%BD%9C%E4%B8%BA-http-%E6%9C%8D%E5%8A%A1%E7%AB%AF)。

然后，创建一个项目并通过 npm 安装本框架：
```bash
# 创建目录和入口文件
mkdir my-awesome-bot
cd my-awesome-bot
touch index.js
# 初始化项目
npm init
# 安装 Ion.js
npm install --save @ionjs/core
```

## 导入
指南中所有的示例代码都假定在开头添加了这一段：
```js
import * as ionjs from '@ionjs/core'
for (const i in ionjs)
    global[i] = ionjs[i]
```

在实际使用中，你可以依照需要来导入部分对象：
```js
import { sender, receiver } from '@ionjs/core'
// sender, receiver 全局可用
```

或使用命名空间导入：
```js
import * as ionjs from '@ionjs/core'
// 使用 ionjs.<name>
```

若使用 CommonJS 导入，则可以使用这两种之一：
```js
const { sender, receiver } = require('@ionjs/core') // 部分导入
const ionjs = require('@ionjs/core') // 命名空间导入
```

## 参见
每个标题下都会提供像这样的*参见*，你可以访问它们以获得关于该标题下所介绍内容的更详细信息：

::: tip 参见
- 前置知识 *是你需要预先了解的内容*
    - ...到其他页面的链接
- 拓展阅读 *在了解后可以有更好的使用体验*
    - ...到其他页面的链接
- API 定义 *提供了更严谨的定义*
    - ...到其他页面的链接
:::