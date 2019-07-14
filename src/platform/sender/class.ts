import { post } from 'httpie'
import { URL } from 'url'
import { CQHTTP_API } from './api'
import { ICQCodeArray } from '../cqcode'
import * as Result from './definition'
import { IMessage } from '../receiver'
import { toArray } from '../cqcode/util'

export class SenderError extends Error {
    readonly post: { [x: string]: any }
    readonly url: string
    readonly retcode: number
    constructor(post: { [x: string]: any }, url: string, retcode: number) {
        super(`Error when trying to send to ${url}, retcode: ${retcode}`)
        this.post = post
        this.url = url
        this.retcode = retcode
    }
}

export class Sender {
    private _context: IMessage
    private readonly _sendURL: string
    private readonly _token?: string
    public constructor(sendURL: string, token?: string) {
        this._sendURL = sendURL
        this._token = token
    }
    public static from(last: Sender) { return new Sender(last._sendURL, last._token) }
    public to(context) {
        const next = Sender.from(this)
        next._context = context
        return next
    }
    public send(message: ICQCodeArray | string): Promise<Result.ISendResult> {
        if (typeof message === 'string') message = toArray(message)
        if (this._context.message_type) return this._post(CQHTTP_API.send[this._context.message_type], { message })
        else if (this._context.group_id) return this._post(CQHTTP_API.send.group, { message })
        else if (this._context.discuss_id) return this._post(CQHTTP_API.send.discuss, { message })
        else return this._post(CQHTTP_API.send.private, { message })
    }
    public delete(message_id: number): Promise<Result.INoneResult> { return this._post(CQHTTP_API.delete, { message_id }) }
    public sendLike(times: number): Promise<Result.INoneResult> { return this._post(CQHTTP_API.sendLike, { times }) }
    public kick(reject_add_request: boolean = false): Promise<Result.INoneResult> { return this._post(CQHTTP_API.kick, { reject_add_request }) }
    public ban(duration: number = 30 * 60): Promise<Result.INoneResult> {
        if (this._context.anonymous) return this._post(CQHTTP_API.ban.anonymous, { duration })
        else return this._post(CQHTTP_API.ban.member, { duration })
    }
    public unban(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.unban, { duration: 0 }) }
    public wholeBan(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.wholeBan, { enable: true }) }
    public wholeUnban(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.wholeUnban, { enable: false }) }
    public setAdmin(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setAdmin, { enable: true }) }
    public unsetAdmin(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.unsetAdmin, { enable: false }) }
    public enableAnonymous(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.enableAnonymous, { enable: true }) }
    public disableAnonymous(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.disableAnonymous, { enable: false }) }
    public setCard(card: string = ''): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setCard, { card }) }
    public deleteCard(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.deleteCard, { card: '' }) }
    public setSpecialTitle(title: string = ''): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setSpecialTitle, { title }) }
    public deleteSpecialTitle(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setSpecialTitle, { title: '' }) }
    public leave(is_dismiss: boolean = false): Promise<Result.INoneResult> {
        if (this._context.group_id) return this._post(CQHTTP_API.leave.group, { is_dismiss })
        else return this._post(CQHTTP_API.leave.discuss, { is_dismiss })
    }
    public solveRequest(approve: boolean = true, remarkOrReason: string = ''): Promise<Result.INoneResult> { return this._post(CQHTTP_API.solveRequest[this._context.request_type], { approve, remark: remarkOrReason }) }
    public getSelfInfo(): Promise<Result.ISelfInfoResult> { return this._post(CQHTTP_API.getSelfInfo) }
    public getInfo(no_cache: boolean = false): Promise<Result.IInfoResult> {
        if (this._context.group_id) return this._post(CQHTTP_API.getInfo.member, { no_cache })
        else return this._post(CQHTTP_API.getInfo.stranger, { no_cache })
    }
    public getGroupList(no_cache: boolean = false): Promise<Result.IGroupListResult> { return this._post(CQHTTP_API.getGroupList, { no_cache }) }
    public getMemberList(): Promise<Result.IMemberInfoListResult> { return this._post(CQHTTP_API.getMemberList) }
    public getCredentials(): Promise<Result.ICredentialsResult> { return this._post(CQHTTP_API.getCredentials)}
    public getRecord(): Promise<Result.IRecordResult> { return this._post(CQHTTP_API.getRecord, {}) }
    public getPluginStatus(): Promise<Result.IPluginStatusResult> { return this._post(CQHTTP_API.getPluginStatus) }
    public getPluginVersionInfo(): Promise<Result.IPluginVersionInfoResult> { return this._post(CQHTTP_API.getPluginVersionInfo) }
    public restart(clean_log: boolean = true, clean_cache: boolean = true, clean_event: boolean = true): Promise<Result.INoneResult> { return this._post(CQHTTP_API.restart, { clean_log, clean_cache, clean_event }) }
    public restartPlugin(delay: number = 0): Promise<Result.INoneResult> { return this._post(CQHTTP_API.restartPlugin, { delay }) }
    public cleanDataDir(data_dir: string): Promise<Result.INoneResult> { return this._post(CQHTTP_API.cleanDataDir, { data_dir }) }
    public cleanPluginLog(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.cleanPluginLog) }
    private async _post({ api, params = [] }: { api: string, params?: string[] }, args: { [x: string]: any } = {}) {
        const url = new URL(api, this._sendURL).toString()
        for (const param of params)
            if (!(param in args))
                args[param] = this._context[param]
        const result = (await post(url, { body: args, headers: this._token ? { 'Authorization': `Token ${this._token}` } : {} })).data
        if (result.status === 'failed') throw new SenderError(args, url, result.retcode)
        else return result
    }
}
