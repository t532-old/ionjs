# Ion.js Package: auto-accept
为 Ion.js 提供自动同意请求功能。

## 使用
详细信息见**[文档](https://ion.js.org/packages/auto-accept.html)**。

### 安装
```bash
npm install --save @ionjs/auto-accept
```

### 导入并加载
```js
import * as ionjs from '@ionjs/core'
import { init, load } from '@ionjs/auto-accept'
init({
    friend: true,
    groupAdd: true,
    groupInvite: true,
})
load(ionjs)
```
