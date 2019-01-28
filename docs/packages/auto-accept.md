# @ionjs/auto-accept

## 安装
通过 `npm` 安装：
```bash
npm install --save @ionjs/auto-accept
```

## 导入并注册
```js
import * as ionjs from '@ionjs/core'
import { init, load } from '@ionjs/auto-accept'
init({
    ... // 配置内容见 #配置
})
load(ionjs)
```

## 配置
在 `init(...)` 中，我们传入一个配置对象：
```ts
{
    friend?: boolean
    groupAdd?: boolean
    groupInvite?: boolean
    userBlacklist?: number[] | ((id: number) => boolean)
    groupBlacklist?: number[] | ((id: number) => boolean)
}
```

- `friend` 指定是否自动同意好友请求；
- `groupAdd` 指定是否自动同意他人加群请求；
- `groupInvite` 指定是否自动同意邀请 Bot 入群的请求；
- `userBlacklist` 可以是：
    - 一个数组，包含需要过滤的 QQ 号；
    - 一个函数，接受一个 QQ 号并返回 boolean，true 为应被过滤
- `groupBlacklist` 是针对群号的 `userBlacklist`。

## API

### *function* init
根据配置初始化模块。
```ts
/**
 * Initialize this module with configuration.
 * @param config The configuration.
 *  friend: auto accept friend requests
 *  groupAdd: auto accept group add requests
 *  groupInvite: auto accept group invitations
 *  userBlacklist: a list of qqids, or a function that determines whether a qqid is in blacklist
 *  groupBlacklist: same as userBlacklist, but for group ids
 */
function init(config?: {
    friend?: boolean
    groupAdd?: boolean
    groupInvite?: boolean
    userBlacklist?: number[] | ((id: number) => boolean)
    groupBlacklist?: number[] | ((id: number) => boolean)
}): void
```

### *function* load
向 Ion.js 注册模块。
```ts
/**
 * Load this module.
 * @param ionjs The object you get by `import * as ionjs from '@ionjs/core'`.
 */
function load({ useSession, when }: {
    useSession: typeof ionjs.useSession
    when: typeof ionjs.when
}): void
```