# 接口

## IBaseResult [<Badge text="classessender/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/sender/definitions.ts)
CQHTTP API 调用的响应数据。

```ts {1}
interface IBaseResult {
    status: 'ok' | 'async' | 'failed'
    retcode: number
    data?: object
}
```

## ICommandArguments [<Badge text="classes/command/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/definitions.ts)
命令 `Command` 的 `parse()` 方法的解析结果，即实参。

```ts {2}
/** A list of given arguments */
interface ICommandArguments {
    /** The specified options */
    options: any[]
    /** The specified arguments */
    arguments: {
        [param: string]: any
    }
    /** Rest unparsed items */
    rest: any[]
}
```

## ICommandParameters [<Badge text="classes/command/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/definitions.ts)
对命令 `Command` 的参数描述，即形参。

```ts {2}
/** A list of delcared parameters */
interface ICommandParameters {
    /** The keys are the aliases and the values are param names  */
    aliases: {
        [param: string]: string
    }
    /** The keys are param names and the values are default values */
    defaults: {
        [param: string]: string
    }
    /** An array of ordered params */
    ordered: string[]
    /** An array of required params */
    required: string[]
    /** Description of parameters */
    description: {
        [param: string]: string
    }
}
```

## ICQCode [<Badge text="classes/cqcode/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/cqcode/definitions.ts)
CQHTTP 数组消息格式中的CQ码。

```ts {1}
interface ICQCode {
    type: string
    data: {
        [x: string]: any
    }
}

```

## ICredentialsResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_credentials` API 的响应数据。

```ts {1}
interface ICredentialsResult extends IBaseResult {
    data: {
        cookies: string
        csrf_token: number
    }
}
```

## IGroupListResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_group_list` API 的响应数据。

```ts {1}
interface IGroupListResult extends IBaseResult {
    data: {
        group_id: number
        group_name: string
    }[]
}
```

## IInfoResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_stranger_info` 或 `/get_group_member_info` API 的响应数据。

```ts {1}
interface IInfoResult extends IBaseResult {
    data: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
        card?: string
        area?: string
        join_time?: number
        last_sent_time?: number
        level?: string
        role?: 'owner' | 'admin' | 'member'
        unfriendly?: boolean
        title?: string
        title_expire_time?: number
        card_changeable?: boolean
    }
}
```

## IMessage [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP 的上报消息。

```ts {1}
interface IMessage {
    post_type?: 'message' | 'notice' | 'request' | 'meta_event'
    message_type?: 'private' | 'group' | 'discuss'
    sub_type?: 'friend' | 'group' | 'discuss' | 'other' | 'normal' | 'anonymous' | 'notice' | 'approve' | 'invite' | 'add' | 'enable' | 'disable'
    message_id?: number
    user_id?: number
    message?: any
    raw_message?: string
    font?: number
    sender?: IInfoResult
    group_id?: number
    anonymous?: {
        id: number
        name: string
        flag: string
    }
    discuss_id?: number
    notice_type?: 'group_upload' | 'group_admin' | 'group_increase' | 'friend_add'
    file?: {
        id: string
        name: string
        size: number
        busid: number
    }
    operator_id?: number
    request_type?: 'friend' | 'group'
    comment?: string
    flag?: string
    meta_event_type?: 'lifecycle' | 'heartbeat'
    status?: IPluginStatusResult
}
```

## INoneResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP 无附加响应信息的 API 的响应数据。

```ts {1}
interface INoneResult extends IBaseResult {
    data: null
}
```

## IPluginStatusResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_plugin_status` API 的响应数据。

```ts {1}
interface IPluginStatusResult extends IBaseResult {
    data: {
        app_initialized: boolean
        app_enabled: boolean
        plugins_good: boolean
        app_good: boolean
        online: boolean
        good: boolean
    }
}
```

## IPluginVersionInfoResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_plugin_version_info` API 的响应数据。

```ts {1}
interface IPluginVersionInfoResult extends IBaseResult {
    data: {
        coolq_directory: string
        coolq_edition: 'air' | 'pro'
        plugin_version: string
        plugin_build_number: number
        plugin_build_configuration: string
    }
}

```

## IRecordResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_record` API 的响应数据。

```ts {1}
interface IRecordResult extends IBaseResult {
    data: {
        file: string
    }
}
```

## ISelfInfoResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_login_info` API 的响应数据。

```ts {1}
interface ISelfInfoResult extends IBaseResult {
    data: {
        user_id: number
        nickname: string
    }
}
```

## ISendResult [<Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/send_*_message` API 的响应数据。

```ts {1}
interface ISendResult extends IBaseResult {
    data: {
        message_id: number
    }
}
```