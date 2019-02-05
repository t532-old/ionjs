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
    options: string[]
    /** The specified arguments */
    arguments: {
        [param: string]: string
    }
    /** Rest unparsed items */
    rest: string[]
}
```

## ICommandParameters [<Badge text="classes/command/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/command/definitions.ts)
对命令 `Command` 的参数描述，即形参。

```ts {2}
/** A list of delcared parameters */
interface ICommandParameters {
    /** The keys are the aliases and the values are param names  */
    aliases: Map<string, string>
    /** The keys are param names and the values are default values */
    defaults: Map<string, string>
    /** An array of ordered params */
    ordered: string[]
    /** An array of required params */
    required: string[]
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

## IInfoResult [<Badge text="0.2.0+" /> <Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
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

## IMemberInfoResult [<Badge text="0.2.0-" type="error" /> <Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_group_member_info` API 的响应数据。

```ts {1}
interface IMemberInfoResult extends IBaseResult {
    data: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
        card: string
        area: string
        join_time: number
        last_sent_time: number
        level: string
        role: 'owner' | 'admin' | 'member'
        unfriendly: boolean
        title: string
        title_expire_time: number
        card_changeable: boolean
    }
}
```

## IMessage [<Badge text="0.2.0+" /> <Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
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

## IModuleMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
模块的元信息。

```ts {1}
interface IModuleMetadata {
    name: string
    author?: string
    version?: string
    license?: string
    description?: string
    registrations?: string[]
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

## IRegistrationMetadata [<Badge text="0.6.0+" /> <Badge text="instances/metadata" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/metadata.ts)
单次注册的元信息。

```ts {1}
interface IRegistrationMetadata {
    name: string
    module: string
    usage?: string
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

## ISessionContext [<Badge text="instances/sessions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/instances/sessions.ts)
传入使用 `useSession` 注册的会话中的上下文。

```ts {2,4,8,10,12,14,16,18,20}
/** Contexts that'll be passed into essions */
interface ISessionContext {
    /** The first context */
    init: {
        [x in keyof Partial<Pick<BotWhen, 'raw' | 'command' | 'contain'>>]: any
    }
    /** Sender bound to this.init.raw */
    sender: Sender
    /** Stream of messages */
    stream: MessageStream<TExtensibleMessage>
    /** Get a copy of the next message from this.stream */
    get(condition?: (ctx: IMessage) => boolean): Promise<TExtensibleMessage>
    /** Reply to user */
    reply(...message: (string | ICQCode)[]): Promise<ISendResult>
    /** Question user and get an answer */
    question(...prompt: (string | ICQCode)[]): Promise<TExtensibleMessage>
    /** Forward to other sessions */
    forward(...message: (string | ICQCode)[]): Promise<void>
    /** Reset the stream deletion timeout */
    timeout: number
}
```

## IStrangerInfoResult [<Badge text="0.2.0-" type="error" /> <Badge text="classes/receiver/definitions" />](https://github.com/ionjs-dev/ionjs/tree/master/src/classes/receiver/definitions.ts)
CQHTTP `/get_stranger_info` API 的响应数据。

```ts {1}
interface IStrangerInfoResult extends IBaseResult {
    data: {
        user_id: number
        nickname: string
        sex: 'male' | 'female' | 'unknown'
        age: number
    }
}
```