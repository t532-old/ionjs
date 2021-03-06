module.exports = {
    title: 'Ion.js',
    description: 'Yet another QQ bot framework based on CQHTTP &amp; CoolQ.',
    base: '/',
    head: [
        ['link', { rel: 'icon', href: `/static/logo.png` }],
    ],
    themeConfig: {
        repo: 'ionjs-dev/ionjs',
        docsDir: 'docs',
        editLinks: true,
        editLinkText: '在 GitHub 上编辑此页',
        lastUpdated: '上次更新',
        nav: [
            { text: '指南', link: '/guide/' },
            { text: 'API', link: '/api/' },
            { text: '术语表', link: '/glossary.html' },
        ],
        sidebarDepth: 2,
        sidebar: {
            '/guide/': [{
                title: '指南',
                collapsable: false,
                children: [
                    '',
                    'getting-started',
                    'structure',
                    'what-happened',
                    'using-sessions',
                    'using-middlewares',
                    'using-commands',
                    'using-sender-receiver',
                    'more-about-sessions'
                ],
            }],
            '/api/': [{
                title: 'API',
                collapsable: false,
                children: [
                    '',
                    'namespaces',
                    'tool-functions',
                    'objects',
                    'functions',
                    'types',
                    'classes',
                    'interfaces',
                ],
            }],
        }
    },
}
