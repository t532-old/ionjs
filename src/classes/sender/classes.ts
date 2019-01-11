import axios from 'axios'
import Debug from 'debug'
import { URL } from 'url'
import { ok as assert } from 'assert'
import { CQHTTP_API } from './api'
import { Codes, ICQCode } from '@/classes/cqcode'
import * as Result from './definitions'

const debug = Debug('ionjs:sender'), 
      debugVerbose = Debug('verbose-ionjs:sender'), 
      debugExVerbose = Debug('ex-verbose-ionjs:sender')

export class SenderError extends Error {
    readonly post: any
    readonly url: string
    readonly retcode: number
    constructor(post: any, url: string, retcode: number) {
        super(`Error when trying to send to ${url}, retcode: ${retcode}`)
        this.post = post
        this.url = url
        this.retcode = retcode
    }
}

export class Sender {
    private readonly _context: any
    private readonly _sendURL: string
    private readonly _token?: string
    constructor(sendURL: string, token?: string, context: any = {}) {
        debugVerbose('init')
        debugExVerbose(`set ${sendURL}(Token ${token || null}) %o`, context)
        this._sendURL = sendURL
        this._token = token
        this._context = context
    }
    to(context) {
        const next = new Sender(this._sendURL, this._token, context)
        return next
    }
    private async _post({ api, params = [] }: { api: string, params?: string[] }, args?: any) {
        const url = new URL(api, this._sendURL).toString()
        for (const param of params)
            if (!(param in args)) 
                args[param] = this._context[param]
        debug('post %s %o', url, args)
        const result = (await axios.post(url, args, { headers: this._token ? { 'Authorization': `Token ${this._token}` } : {} })).data
        if (result.status === 'failed') throw new SenderError(args, url, result.retcode)
        else return result
    }
    private _checkContext(...keys: string[]) {
        for (const key of keys)
            assert(this._context[key])
   }
    send(...mixedMessage: (string|ICQCode)[]): Promise<Result.ISendResult> {
        this._checkContext('message_type')
        const message = []
        for (const i of mixedMessage) {
            if (typeof i === 'string') message.push(Codes.Text(i))
            else message.push(i)
        }
        return this._post(CQHTTP_API.send[this._context.message_type], { message })
    }
    'delete'(message_id: number): Promise<Result.INoneResult> { return this._post(CQHTTP_API.delete, { message_id }) }
    sendLike(times: number): Promise<Result.INoneResult> { return this._post(CQHTTP_API.sendLike, { times }) }
    kick(reject_add_request: boolean = false): Promise<Result.INoneResult> { return this._post(CQHTTP_API.kick, { reject_add_request }) }
    ban(duration: number = 30 * 60): Promise<Result.INoneResult> { 
        if (this._context.anonymous) return this._post(CQHTTP_API.ban.anonymous, duration)
        else return this._post(CQHTTP_API.ban.member, { duration })
    }
    unban(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.unban, { duration: 0 }) }
    wholeBan(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.wholeBan, { enable: true }) }
    wholeUnban(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.wholeUnban, { enable: false }) }
    setAdmin(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setAdmin, { enable: true }) }
    unsetAdmin(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.unsetAdmin, { enable: false }) }
    enableAnonymous(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.enableAnonymous, { enable: true }) }
    disableAnonymous(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.disableAnonymous, { enable: false }) }
    setCard(card: string = ''): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setCard, { card }) }
    deleteCard(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.deleteCard, { card: '' }) }
    setSpecialTitle(title: string = ''): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setSpecialTitle, { title }) }
    deleteSpecialTitle(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.setSpecialTitle, { title: '' }) }
    leave(is_dismiss: boolean = false): Promise<Result.INoneResult> { 
        this._checkContext('message_type')
        return this._post(CQHTTP_API.leave[this._context.message_type], { is_dismiss })
    }
    solveRequest(approve: boolean = true, remarkOrReason: string = ''): Promise<Result.INoneResult> {
        this._checkContext('request_type')
        return this._post(CQHTTP_API.solveRequest[this._context.request_type], { approve, remark: remarkOrReason })
    }
    getSelfInfo(): Promise<Result.ISelfInfoResult> { return this._post(CQHTTP_API.getSelfInfo) }
    getInfo(no_cache: boolean = false): Promise<Result.IStrangerInfoResult|Result.IMemberInfoResult> {
        if (this._context.group_id) return this._post(CQHTTP_API.getInfo.member, { no_cache })
        else return this._post(CQHTTP_API.getInfo.stranger, { no_cache })
    }
    getGroupList(no_cache: boolean = false): Promise<Result.IGroupListResult> { return this._post(CQHTTP_API.getGroupList, { no_cache }) }
    getMemberList(): Promise<Result.IMemberInfoListResult> { return this._post(CQHTTP_API.getMemberList, { }) }
    getCredentials(): Promise<Result.ICredentialsResult> { return this._post(CQHTTP_API.getCredentials, { })}
    getRecord(): Promise<Result.IRecordResult> { return this._post(CQHTTP_API.getRecord, {}) }
    getPluginStatus(): Promise<Result.IPluginStatusResult> { return this._post(CQHTTP_API.getPluginStatus, { }) }
    getPluginVersionInfo(): Promise<Result.IPluginVersionInfoResult> { return this._post(CQHTTP_API.getPluginVersionInfo, { }) }
    restart(clean_log: boolean = true, clean_cache: boolean = true, clean_event: boolean = true): Promise<Result.INoneResult> { return this._post(CQHTTP_API.restart, { clean_log, clean_cache, clean_event }) }
    restartPlugin(delay: number = 0): Promise<Result.INoneResult> { return this._post(CQHTTP_API.restartPlugin, { delay }) }
    cleanDataDir(data_dir: string): Promise<Result.INoneResult> { return this._post(CQHTTP_API.cleanDataDir, { data_dir }) }
    cleanPluginLog(): Promise<Result.INoneResult> { return this._post(CQHTTP_API.cleanPluginLog, { }) } 
}