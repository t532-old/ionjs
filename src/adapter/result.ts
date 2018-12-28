export interface IBase {
    status: 'ok'|'async'|'failed'
    retcode: number
    data?: object
}
export interface INone extends IBase {
    data: null
}
export interface ISend extends IBase {
    data: { message_id: number }
}
export interface ISelfInfo extends IBase {
    data: {
        user_id: number,
        nickname: string,
    }
}
export interface IStrangerInfo extends IBase {
    data: {
        user_id: number,
        nickname: string,
        sex: string,
        age: number,
    }
}
export interface IMemberInfo extends IBase {
    data: {
        user_id: number,
        nickname: string,
        sex: string,
        age: number,
        card: string,
        area: string,
        join_time: number,
        last_sent_time: number,
        level: string,
        role: 'owner'|'admin'|'member',
        unfriendly: boolean,
        title: string,
        title_expire_time: number,
        card_changeable: boolean,
    }
}
export interface IGroupList extends IBase {
    data: {
        group_id: number,
        group_name: string,
    }[]
}
export interface IMemberInfoList extends IBase {
    data: IMemberInfo[]
}
export interface ICredentials extends IBase {
    data: {
        cookies: string,
        csrf_token: number,
    }
}
export interface IRecord extends IBase {
    data: { file: string }
}
export interface IPluginStatus extends IBase {
    data: {
        app_initialized: boolean,
        app_enabled: boolean,
        plugins_good: boolean,
        app_good: boolean,
        online: boolean,
        good: boolean,
    }
}
export interface IPluginVersionInfo extends IBase {
    data: {
        coolq_directory: string,
        coolq_edition: 'air'|'pro',
        plugin_version: string,
        plugin_build_number: number,
        plugin_build_configuration: string,
    }
}