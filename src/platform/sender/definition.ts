import { ICQCode } from '../cqcode'

export interface IBaseResult {
    status: 'ok'|'async'|'failed'
    retcode: number
    data?: object
}
export interface INoneResult extends IBaseResult {
    data: null
}
export interface ISendResult extends IBaseResult {
    data: { message_id: number }
}
export interface ISelfInfoResult extends IBaseResult {
    data: {
        user_id: number,
        nickname: string,
    }
}
export interface IInfoResult extends IBaseResult {
    data: {
        user_id: number,
        nickname: string,
        sex: 'male'|'female'|'unknown',
        age: number,
        card?: string,
        area?: string,
        join_time?: number,
        last_sent_time?: number,
        level?: string,
        role?: 'owner'|'admin'|'member',
        unfriendly?: boolean,
        title?: string,
        title_expire_time?: number,
        card_changeable?: boolean,
    }
}
export interface IGroupListResult extends IBaseResult {
    data: {
        group_id: number,
        group_name: string,
    }[]
}
export interface IMemberInfoListResult extends IBaseResult {
    data: IInfoResult[]
}
export interface ICredentialsResult extends IBaseResult {
    data: {
        cookies: string,
        csrf_token: number,
    }
}
export interface IRecordResult extends IBaseResult {
    data: { file: string }
}
export interface IPluginStatusResult extends IBaseResult {
    data: {
        app_initialized: boolean,
        app_enabled: boolean,
        plugins_good: boolean,
        app_good: boolean,
        online: boolean,
        good: boolean,
    }
}
export interface IPluginVersionInfoResult extends IBaseResult {
    data: {
        coolq_directory: string,
        coolq_edition: 'air'|'pro',
        plugin_version: string,
        plugin_build_number: number,
        plugin_build_configuration: string,
    }
}