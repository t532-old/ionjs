import { useSession, when } from '@ionjs/core'

useSession(when.ever(), { identifier: 'group', concurrent: true }) (
    async function repeat(ctx) {
        let last = ctx.init.raw
        while (true) {
            const next = await ctx.get()
            if (next.message === last.message && next.user_id !== last.user_id) {
                await ctx.reply(last.message)
                return
            } else last = next
        }
    }
)