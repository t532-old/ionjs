import * as ionjs from '@ionjs/core'

let friend: boolean = true,
    groupAdd: boolean = true,
    groupInvite: boolean = true,
    userBlacklist: (id: number) => boolean = () => false,
    groupBlacklist: (id: number) => boolean = () => false

/**
 * Initialize this module with configuration.
 * @param config The configuration.
 *  friend: auto accept friend requests
 *  groupAdd: auto accept group add requests
 *  groupInvite: auto accept group invitations
 *  userBlacklist: a list of qqids, or a function that determines whether a qqid is in blacklist
 *  groupBlacklist: same as userBlacklist, but for group ids
 */
export function init(config: {
    friend?: boolean,
    groupAdd?: boolean,
    groupInvite?: boolean,
    userBlacklist?: number[]|((id: number) => boolean),
    groupBlacklist?: number[]|((id: number) => boolean),
} = {
    friend: true,
    groupAdd: true,
    groupInvite: true,
    userBlacklist: [],
    groupBlacklist: []
}) {
    ({ friend, groupAdd, groupInvite } = config)
    if (config.userBlacklist instanceof Array)
        userBlacklist = id => (config.userBlacklist as number[]).includes(id)
    else userBlacklist = config.userBlacklist
    if (config.groupBlacklist instanceof Array)
        groupBlacklist = id => (config.groupBlacklist as number[]).includes(id)
    else groupBlacklist = config.groupBlacklist
}

/**
 * Load this module.
 * @param ionjs The object you get by `import * as ionjs from '@ionjs/core'`.
 */
export function load({ useSession, when }: {
    useSession: typeof ionjs.useSession
    when: typeof ionjs.when
}) {
    useSession(when.type('request/friend')) (
        async function ({ init: { raw }, sender }) {
            await sender.solveRequest(friend && !userBlacklist(raw.user_id))
        }
    ) 
    useSession(when.type('request/group/add')) (
        async function ({ init: { raw }, sender }) {
            await sender.solveRequest(groupAdd && !userBlacklist(raw.user_id) && !groupBlacklist(raw.group_id))
        }
    ) 
    useSession(when.type('request/group/invite')) (
        async function ({ init: { raw }, sender }) {
            await sender.solveRequest(groupInvite && !userBlacklist(raw.user_id) && !groupBlacklist(raw.group_id))
        }
    ) 
}