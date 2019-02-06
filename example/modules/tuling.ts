import { useSession, when, useModuleMetadata, useRegistrationMetadata } from '@ionjs/core'

useModuleMetadata({
    name: '@ionjs/example/modules/tuling',
    author: 'ionjs-dev',
    version: '0.1.0',
    description: '智能聊天',
    registrations: ['智能聊天'],
    license: 'MIT',
})

useRegistrationMetadata({
    name: '智能聊天',
    module: '@ionjs/example/modules/tuling',
    usage: `
智能聊天功能使用帮助

直接跟我聊天即可～
`.trim()
})

useSession(when.command(['tuling', '聊天', '对话'], '--one-time')) (
    async function tuling(ctx) {
        await ctx.reply('我已经准备好啦，来跟我聊天吧~')
        const oneTime = ctx.init.command.options.includes('--one-time')
        do {
            const msg = await ctx.get()
            if (await when.contain('结束', '拜拜', '再见').validate(msg)) {
                await ctx.reply('拜拜啦，你忙吧，下次想聊天随时找我哦~')
                return
            }
            // call tuling api
            ctx.reply(`你说了：${msg.message}`)
        } while (!oneTime)
    }
)