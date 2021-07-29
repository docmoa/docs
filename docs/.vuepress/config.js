// config.js
const routes = [
    "Tag",
    "Infra",
    "PrivatePlatform",
    "PublicCloud",
    "HashiCorp",
    "etc",
    "Howto"
];

const createSidebar = () => {
    const sidebar = {};
    for (const route of routes) {
        Object.assign(sidebar, require("../" + route));
    }
    return sidebar;
};

module.exports = {
    base: "/",
    title: "docmoa", // 사이트 타이틀
    description: "혼자서는 불가능",
    dest: "docs/.vuepress/dist",
    themeConfig: {
        logo: "/image/shortcuts-quick-open.png", // 로고 이미지
        nav: [
            { text: "Infrastructure", link: "/Infra/" },
            { text: "Private-Platform", link: "/PrivatePlatform/" },
            { text: "Public-Cloud", link: "/PublicCloud/" },
            { text: "HashiCorp", link: "/HashiCorp/" },
            { text: "Etc.", link: "/etc/" },
            { text: "How To", link: "/Howto/" },
            {
                text: "Info",
                items: [
                    { text: "About", link: "/about/" },
                    { text: "Repository", link: "https://github.com/docmoa/page" },
                ]
            },
            { text: "#Tags", link: "/tag/" }
        ],
        sidebar: createSidebar(),
        lastUpdated: "Last Updated",
        smoothScroll: true,
        nextLinks: true,
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
        "@vuepress/last-updated": {
            dateOptions:{
                hour12: false
            }
        },
        "sitemap": {
            hostname: "https://docmoa.github.io/"
        }
    },
    extend: '@vuepress/theme-default'
};
