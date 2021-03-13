/** @type {import('@docusaurus/types').DocusaurusConfig} */
module.exports = {
    title: 'liscio-undici',
    tagline: 'Documentation for liscio-undici',
    url: 'https://lxghtless.github.io',
    baseUrl: process.env.DOCS_ENV === 'local' ? '/' : '/liscio-undici/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/favicon.ico',
    organizationName: 'lxghtless', // Usually your GitHub org/user name.
    projectName: 'liscio-undici', // Usually your repo name.
    themeConfig: {
        navbar: {
            title: 'liscio-undici',
            logo: {
                alt: 'liscio-undici',
                src: 'img/logo.svg'
            },
            items: [
                {
                    to: 'docs/',
                    activeBasePath: 'docs',
                    label: 'Docs',
                    position: 'left'
                },
                {
                    href: 'https://github.com/lxghtless/liscio-undici',
                    label: 'GitHub',
                    position: 'right'
                }
            ]
        },
        footer: {
            style: 'dark',
            links: [
                {
                    title: 'Docs',
                    items: [
                        {
                            label: 'Install',
                            to: 'docs/'
                        }
                    ]
                },
                {
                    title: 'Community',
                    items: [
                        {
                            label: 'Twitter',
                            href: 'https://twitter.com/lxghtless'
                        }
                    ]
                },
                {
                    title: 'More',
                    items: [
                        {
                            label: 'GitHub',
                            href: 'https://github.com/lxghtless/liscio-undici'
                        }
                    ]
                }
            ],
            copyright: `Copyright © ${new Date().getFullYear()} lxghtless`
        }
    },
    presets: [
        [
            '@docusaurus/preset-classic',
            {
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/lxghtless/liscio-undici/edit/main/site/'
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css')
                }
            }
        ]
    ]
}
