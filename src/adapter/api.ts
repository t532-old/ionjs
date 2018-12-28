export const CQHTTP_API = {
    send: {
        group: {
            api: 'send_group_msg',
            params: ['group_id'],
        },
        private: {
            api: 'send_private_msg',
            params: ['user_id'],
        },
        discuss: {
            api: 'send_discuss_msg',
            params: ['discuss_id'],
        },
    },
    'delete': {
        api: 'delete_msg',
        params: ['message_id'],
    },
    sendLike: {
        api: 'send_like',
        params: ['user_id'],
    },
    kick: {
        api: 'set_group_kick',
        params: ['group_id', 'user_id'],
    },
    ban: {
        member: {
            api: 'set_group_ban',
            params: ['group_id', 'user_id'],
        },
        anonymous: {
            api: 'set_group_anonymous_ban',
            params: ['group_id', 'anonymous'],
        }
    },
    unban: {
        api: 'set_group_ban',
        params: ['group_id', 'user_id'],
    },
    wholeBan: {
        api: 'set_group_whole_ban',
        params: ['group_id'],
    },
    wholeUnban: {
        api: 'set_group_whole_ban',
        params: ['group_id'],
    },
    setAdmin: {
        api: 'set_group_admin',
        params: ['group_id', 'user_id'],
    },
    unsetAdmin: {
        api: 'set_group_admin',
        params: ['group_id', 'user_id'],
    },
    enableAnonymous: {
        api: 'set_group_anonymous',
        params: ['group_id'],
    },
    disableAnonymous: {
        api: 'set_group_anonymous',
        params: ['group_id'],
    },
    setCard: {
        api: 'set_group_card',
        params: ['group_id', 'user_id'],
    },
    deleteCard: {
        api: 'set_group_card',
        params: ['group_id', 'user_id'],
    },
    setSpecialTitle: {
        api: 'set_group_special_title',
        params: ['group_id', 'user_id'],
    },
    deleteSpecialTitle: {
        api: 'set_group_special_title',
        params: ['group_id', 'user_id'],
    },
    leave: {
        group: {
            api: 'set_group_leave',
            params: ['group_id'],
        },
        discuss: {
            api: 'set_discuss_leave',
            params: ['discuss_id'],
        },
    },
    solveRequest: {
        group: {
            api: 'set_group_add_request',
            params: ['flag'],
        },
        friend: {
            api: 'set_friend_add_request',
            params: ['flag'],
        }
    },
    getSelfInfo: { api: 'get_login_info' },
    getInfo: {
        member: {
            api: 'get_group_member_info',
            params: ['group_id', 'user_id'],
        },
        stranger: {
            api: 'get_stranger_info',
            params: ['user_id'],
        }
    },
    getGroupList: { api: 'get_group_list' },
    getMemberList: {
        api: 'get_group_member_list',
        params: ['group_id'],
    },
    getCredentials: { api: 'get_credentials' },
    getRecord: { api: 'get_record' },
    getPluginStatus: { api: 'get_status' },
    getPluginVersionInfo: { api: 'get_version_info' },
    restart: { api: 'set_restart' },
    restartPlugin: { api: 'set_restart_plugin' },
    cleanDataDir: { api: 'clean_data_dir' },
    cleanPluginLog: { api: 'clean_plugin_log' },
}