import { useSession, when, getAllModuleMetadata, getRegistrationMetadata } from '@ionjs/core'

useSession(when.command(['usage', '使用帮助', '帮助', '使用方法'], '[topic]')) (
    async function usage(ctx) {
        const mmd = getAllModuleMetadata()
        const { topic } = ctx.init.command.arguments
        if (!topic)
            await ctx.reply(`我现在支持的功能有：\n\n${mmd.map(i => `${i.name}: { ${i.registrations.join(', ')} }`).join('\n')}`)
        else {
            const rmd = mmd.filter(i => i.registrations.includes(topic)).map(i => getRegistrationMetadata(i.name, topic))
            if (rmd.length) await ctx.reply(rmd.map(i => i.usage).join('\n===\n'))
        }
    }
)
