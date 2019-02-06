import { receiver, sender } from '@ionjs/core'

const GROUP_GREETING = [
    '欢迎新同学 {name}！[CQ:face,id=63][CQ:face,id=63][CQ:face,id=63]',
    '[CQ:face,id=99]欢迎新成员～',
    '欢迎 {name}👏👏～',
    '[CQ:at,qq={user_id}] 欢迎欢迎👏',
]

receiver.on('notice/group_increase', async ctx => {
    if (![201865589, 672076603].includes(ctx.group_id)) return
    try {
        const info = await sender.to(ctx).getInfo(true),
              name = info.data.card || info.data.nickname || '新成员'
        await sender.to(ctx).send(GROUP_GREETING[Math.floor(Math.random() * GROUP_GREETING.length)].replace('{name}', name))
    } catch { }
})

receiver.on('request/group', async ctx => {
    if (ctx.group_id === 672076603)
        await sender.to(ctx).solveRequest(true)
})

