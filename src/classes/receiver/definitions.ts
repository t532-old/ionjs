import { IPluginStatusResult, IInfoResult } from '../sender'
import { ICQCode } from '../cqcode'

// Fix type definiton of koa-bodyparser
declare module 'koa' {
    interface Request {
        body: any
        rawBody: string
    }
}

/** CQHTTP Message */
export interface IMessage {
    post_type?: 'message'|'notice'|'request'|'meta_event'
    message_type?: 'private'|'group'|'discuss'
    sub_type?: 'friend'|'group'|'discuss'|'other'|'normal'|'anonymous'|'notice'|'approve'|'invite'|'add'|'enable'|'disable'
    message_id?: number
    user_id?: number
    message?: any
    raw_message?: string
    font?: number
    sender?: IInfoResult
    group_id?: number
    anonymous?: {
        id: number,
        name: string,
        flag: string,
    }
    discuss_id?: number
    notice_type?: 'group_upload'|'group_admin'|'group_increase'|'friend_add'
    file?: {
        id: string,
        name: string,
        size: number,
        busid: number,
    }
    operator_id?: number
    request_type?: 'friend'|'group'
    comment?: string
    flag?: string
    meta_event_type?: 'lifecycle'|'heartbeat'
    status?: IPluginStatusResult
}