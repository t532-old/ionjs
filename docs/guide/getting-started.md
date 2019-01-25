# 起步
欢迎使用 Ion.js！这份指南将一一介绍 Ion.js 的使用方法。

## 准备
Ion.js 基于酷Q和 CQHTTP，因此你需要先安装它们。
- [酷Q：https://cqp.cc](https://cqhttp.cc)
- [CQHTTP（CoolQ HTTP API）：https://cqhttp.cc](https://cqhttp.cc)

## 安装
创建一个新项目：
```bash
npm init
```

在你的项目下键入以下命令来安装 Ion.js：
```bash
npm install --save @ionjs/core
```

同时还可以安装一系列可选 package（见[@ionjs package 列表](/packages/index.md)），如：
```bash
npm install --save @ionjs/user-levels # 层级权限管理（MongoDB）
npm install --save @ionjs/user-groups # 用户组权限管理（MongoDB）
npm install --save @ionjs/auto-accept # 自动同意加群/拉群/好友请求
# ...
```

## 编写
在你的 bot 项目下创建入口文件 `index.js` 并导入 Ion.js：
```js
const ionjs = require('@ionjs/core')
```

初始化：
```js
ionjs.init({
    receivePort: 8080, // ionjs 将监听的端口，i.e. CQHTTP 配置中的 post_url 的端口
    sendURL: 'http://localhost:5700', // CQHTTP API 所在的 URL
    operators: [YOUR_QQ_ID, ...], // 添加 Bot 管理者
    self: BOT_QQ_ID, // Bot 自身的 QQ 号
})
```

接着，我们使用 `useSession()` 来让 Bot 可以对特定的消息做出反应：
```js
ionjs.useSession(ionjs.when.contain('你好')) (
    async function greet(ctx) {
        await ctx.reply('你好呀!')
    }
)
```

最后，启动你的 Bot 并在 Shell 中运行：
```js
ionjs.start()
```
```bash
node .
```

恭喜你！你已经完成了你的第一个 Ion.js Bot 应用。向 Bot 发送包含字符串 `你好` 的消息，Bot 将回复 `你好呀！`。