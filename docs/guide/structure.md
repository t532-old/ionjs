# 关于指南
本文档是一份介绍了 Ion.js **主要功能**及**推荐使用方法**的指南。

这份文档将由简单的概念逐渐深入，旨在让开发者阅读完毕后可以使用 Ion.js 开发基础的 QQ Bot。

## 语法
这份指南仅使用 ECMAScript 标准的语法（即，不使用 ESNext 语法），但 ES6 *import* 导入语句在 Node.js 下无法直接运行。

如果你想要你的代码在 Node.js 下直接运行，则可如此转换 `import` （每行一一对应）：
```js
// ES6 import
import * as ionjs from 'ionjs' // 全部导入
import { init, useSession, when, start } from 'ionjs' // 部分导入
import { useMiddleware as use } from 'ionjs' // 别名导入

// CommonJS(Node.js) require
const ionjs = require('ionjs') // 全部导入
const { init, useSession, when, start } = require('ionjs') // 部分导入
const { useMiddleware: use } = require('ionjs') // 别名导入
```

## 参见
每个标题下都会提供像这样的*参见*，你可以访问它们以获得关于该标题下所介绍内容的更详细信息：

::: tip 参见
- ...到其他页面的链接
:::

如果无法理解参见页面的内容，也没有关系，因为它们通常讲述的是比指南中更复杂的概念。