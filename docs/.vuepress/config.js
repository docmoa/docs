// config.js
// const routes = [
//     "Tag",
//     "Infra",
//     "PrivatePlatform",
//     "PublicCloud",
//     "HashiCorp",
//     "etc",
//     "Howto"
// ];

// const createSidebar = () => {
//     const sidebar = {};
//     for (const route of routes) {
//         Object.assign(sidebar, require("../" + route));
//     }
//     return sidebar;
// };
const getConfig = require("vuepress-bar");
const { nav, sidebar } = getConfig({maxLevel: 5});
// sidebar.find((item) => item.text = String(item.text).replace(/(\d+)\./, ''))

console.log(sidebar)

module.exports = {
    base: "/",
    title: "docmoa", // 사이트 타이틀
    description: "혼자서는 불가능",
    dest: "docs/.vuepress/dist",
    themeConfig: {
        logo: "/image/docmoa-144.png", // 로고 이미지
        nav: [
            { text: "Infrastructure", link: "/01-Infrastructure/" },
            { text: "Private-Platform", link: "/02-PrivatePlatform/" },
            { text: "Public-Cloud", link: "/03-PublicCloud/" },
            { text: "HashiCorp", link: "/04-HashiCorp/" },
            { text: "Etc.", link: "/05-etc/" },
            { text: "How To", link: "/00-Howto/" },
            {
                text: "MORE",
                items: [
                    { text: "About", link: "/99-about/01-About.html" },
                    { text: "Thank you", link: "/99-about/02-Thanks.html" },
                    { text: "Go Contribute", link: "http://github.com/docmoa/page" },
                ]
            },
            { text: "#Tags", link: "/98-Tags.html" }
        ],
        sidebar,
        lastUpdated: "Last Updated",
        smoothScroll: true,
        nextLinks: true,
        // repo: 'docmoa/page',
        // repoLabel: 'Go Contribute',
        // docsRepo: 'docmoa/page',
        // docsDir: 'docs',
        // docsBranch: 'main',
    },
    head: [
        ['link', { rel: 'icon', href: '/image/docmoa-144.png'}],
        ['link', { rel: 'manifest', href: '/manifest.json'}],
    //   ['meta', {name: "google-site-verification", content: "sHfBWIoCUOYFXJ3b0ulN8jp9jpD8SEW5Wpxvlk-UABA"}],
    ],
    markdown: {
        lineNumbers: true,
        extractHeaders: [],
        extendMarkdown: (md) => {
            md.use(require("markdown-it-plantuml"));
            md.use(require("markdown-it-underline"));
            md.use(require("markdown-it-task-lists"));
        },
    },
    plugins: {
        "@vuepress/back-to-top": {},
        "@vuepress/nprogress": {},
        "@vuepress/search": {},
        "@vuepress/pwa": {
            serviceWorker: true,
            updatePopup: true,
        },
        "mermaidjs": {},
        "container": {
            type: 'vue',
            before: '<pre class="vue-container"><code>',
            after: '</code></pre>'
        },
        "sitemap": {
            hostname: "https://docmoa.github.io/"
        },
        "@vuepress/last-updated": {},
        "vuepress-plugin-code-copy": {
            align: "bottom",
            color: "#ffffff"
        },
        "vuepress-plugin-contributors": {
            defaultAvatar: "/image/not-found.png"
        },
        "vuepress-plugin-element-tabs": {},
        "vuepress-plugin-tags": {
            type: "rainbow",
            selector: ".page .content__default h1"
        },
        // "vuepress-plugin-right-anchor": {},
        "autometa_options": {
            enable : true, // enables/disables everything - control per page using frontmatter
            image  : true, // regular meta image used by search engines
            twitter: true, // twitter card
            og     : true, // open graph: facebook, pinterest, google+
            schema : true, // schema.org for google
            site: {
                name   : 'docmoa',
            },
            description_sources: [
                'frontmatter',
                'excerpt',
                /^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/img,
                /<p(?:.*?)>(.*?)<\/p>/i,
            ],
            image_sources: [
                'frontmatter',
                /!\[.*?\]\((.*?)\)/i,        // markdown image regex
                /<img.*?src=['"](.*?)['"]/i, // html image regex
            ],
        }
    },
    extend: '@vuepress/theme-default'
};
