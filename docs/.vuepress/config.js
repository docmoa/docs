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
    title: "qnote", // 사이트 타이틀
    description: "혼자서는 불가능",
    themeConfig: {
        logo: "/image/shortcuts-quick-open.png", // 로고 이미지
        nav: [
            { text: "Tag", link: "/tag/" },
            { text: "Infra", link: "/Infra/" },
            { text: "Private Platform", link: "/PrivatePlatform/" },
            { text: "Public Cloud", link: "/PublicCloud/" },
            { text: "HashiCorp", link: "/HashiCorp/" },
            { text: "etc", link: "/etc/" },
            { text: "How To", link: "/Howto/" },
            {
                text: "Info",
                items: [
                    { text: "Repository", link: "https://github.com/qnote/page" },
                ]
            }
        ],
        sidebar: createSidebar(),
        lastUpdated: "Last Updated",
        smoothScroll: true,
    },
    // head: [
    //   ['meta', {name: "google-site-verification", content: "sHfBWIoCUOYFXJ3b0ulN8jp9jpD8SEW5Wpxvlk-UABA"}],
    // ],
    markdown: {
        extendMarkdown: (md) => {
            md.use(require("markdown-it-plantuml"));
            md.use(require("markdown-it-underline"));
            md.use(require("markdown-it-task-lists"));
        },
    },
    plugins: [["@vuepress/back-to-top"], ["@vuepress/last-updated"]],
};
