import { useSession, when, useModuleMetadata, useRegistrationMetadata } from '@ionjs/core'

const REPORT = [
    '你查询了{city}的天气',
    '{city}的天气是……',
]

useModuleMetadata({
    name: '@ionjs/example/modules/weather',
    author: 'ionjs-dev',
    version: '0.1.0',
    description: '天气',
    registrations: ['天气', ' 生活指数'],
    license: 'MIT',
})

useRegistrationMetadata({
    name: '天气',
    module: '@ionjs/example/modules/weather',
    usage: `
天气功能使用帮助

天气  [城市名称]
`.trim()
})

useSession(when.command(['weather', '天气', '天气预报'], '<city>', {
    prompts: '你要查询哪个城市的天气呢？'
})) (
    async function weather(ctx) {
        const { city } = ctx.init.command.arguments
        await ctx.reply(REPORT[Math.floor(Math.random() * REPORT.length)].replace('{city}', city))
    }
)

useSession(when.contain('天气', '雨', '雪', '晴', '阴')) (
    async function weather(ctx) {
        if (ctx.init.raw.message.indexOf('?') < 0 && ctx.init.raw.message.indexOf('？') < 0) return
        else ctx.forward('weather')
    }
)

useRegistrationMetadata({
    name: '生活指数',
    module: '@ionjs/example/modules/weather',
    usage: `
生活指数功能使用帮助

生活指数
`.trim()
})

useSession(when.command(['suggestion', '生活指数', '生活建议', '生活提示'])) (
    async function suggestion(ctx) {
        await ctx.reply('suggestion')
    }
)