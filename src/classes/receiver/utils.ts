export function contextTypeOf(ctx: any) {
    const events: string[] = ['post', ctx.post_type, `${ctx.post_type}/${ctx.message_type || ctx.request_type || ctx.notice_type || ctx.meta_event_type}`]
    if (ctx.sub_type) events.push(`${ctx.post_type}/${ctx.message_type || ctx.request_type || ctx.notice_type || ctx.meta_event_type}/${ctx.sub_type}`)
    return events
}