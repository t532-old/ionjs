import { IMessage } from './definition'

export function contextTypeOf(ctx: IMessage) {
    const events: string[] = ['post', ctx.post_type, `${ctx.post_type}/${ctx.message_type || ctx.request_type || ctx.notice_type || ctx.meta_event_type}`]
    if (ctx.sub_type)
        events.push(`${ctx.post_type}/${ctx.message_type || ctx.request_type || ctx.notice_type || ctx.meta_event_type}/${ctx.sub_type}`)
    return events
}

export function unionIdOf(ctx: IMessage): number {
    if (ctx.message_type)
        return ctx[`${ctx.message_type === 'private' ? 'user' : ctx.message_type}_id`]
    else 
        return ctx.discuss_id || ctx.group_id || ctx.user_id
}
