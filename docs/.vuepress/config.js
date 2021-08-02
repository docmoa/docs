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
const { nav, sidebar } = getConfig({maxLevel: 4});
sidebar.find((item) => item.text = String(item.text).replace(/(\d+)\./, ''))

console.log(sidebar)

module.exports = {
    base: "/",
    title: "docmoa", // 사이트 타이틀
    description: "혼자서는 불가능",
    dest: "docs/.vuepress/dist",
    themeConfig: {
        logo: "/image/shortcuts-quick-open.png", // 로고 이미지
        nav: [
            { text: "Infrastructure", link: "/01.Infra/" },
            { text: "Private-Platform", link: "/02.PrivatePlatform/" },
            { text: "Public-Cloud", link: "/03.PublicCloud/" },
            { text: "HashiCorp", link: "/04.HashiCorp/" },
            { text: "Etc.", link: "/05.etc/" },
            { text: "How To", link: "/00.Howto/" },
            { text: "About", link: "/99.about/" },
            { text: "#Tags", link: "/98.tag/" }
        ],
        sidebar,
        lastUpdated: "Last Updated",
        smoothScroll: true,
        nextLinks: true,
        repo: 'docmoa/page',
        repoLabel: 'Go Contribute',
        docsRepo: 'docmoa/page',
        docsDir: 'docs',
        docsBranch: 'main',
    },
    // head: [
    //   ['meta', {name: "google-site-verification", content: "sHfBWIoCUOYFXJ3b0ulN8jp9jpD8SEW5Wpxvlk-UABA"}],
    // ],
    markdown: {
        lineNumbers: true,
        extendMarkdown: (md) => {
            md.use(require("markdown-it-plantuml"));
            md.use(require("markdown-it-underline"));
            md.use(require("markdown-it-task-lists"));
        },
    },
    plugins: {
        "@vuepress/back-to-top": {},
        "@vuepress/nprogress": {},
        "sitemap": {
            hostname: "https://docmoa.github.io/"
        },
        "@vuepress/last-updated": {},
        "vuepress-plugin-code-copy": {
            align: "bottom",
            color: "#ffffff"
        }
    },
    extend: '@vuepress/theme-default'
};
