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
const { nav, sidebar } = getConfig({ maxLevel: 5 });
// sidebar.find((item) => item.text = String(item.text).replace(/(\d+)\./, ''))

const spaceToURI = function(sidebarObj) {
  if (sidebarObj.hasOwnProperty("children")) {
    for (var i = 0; i < sidebarObj.children.length; i++) {
      obj = sidebarObj.children[i];
      const type = typeof obj
    //   console.log(obj);
    //   console.log(type);
      switch (type) {
        case "string":
          sidebarObj.children[i] = encodeURI(obj);
        //   console.log(sidebarObj.children[i]);
          break;
        case "object":
        //   console.log(obj);
        //   console.log(obj.constructor);
          if (obj.constructor == Object) {
            spaceToURI(obj);
          }
          if (obj.constructor == Array) {
            for (var i = 0; i < obj.length; i++) {
            //   console.log(obj[i]);
              obj[i] = encodeURI(obj[i]);
            //   console.log(obj[i]);
            }
          }
          break;
      }
    }
  }

  return sidebarObj;
};

for (let i = 0; i < sidebar.length; i++) {
  sidebar[i] = spaceToURI(sidebar[i]);
  console.log(JSON.stringify(sidebar[i]));
}

module.exports = {
  base: "/",
  title: "docmoa", // 사이트 타이틀
  description: "그림같이 써라. 그러면 기억 속에 머물 것이다. - 조지프 퓰리처",
  dest: "docs/.vuepress/dist",
  themeConfig: {
    logo: "/image/docmoa-144.png", // 로고 이미지
    nav: [
      { text: "How To", link: "/00-Howto/" },
      {
        text: "Infra",
        items: [
          { text: "Infrastructure", link: "/01-Infrastructure/" },
          { text: "Private-Platform", link: "/02-Private Platform/" },
          { text: "Public-Cloud", link: "/03-Public Cloud/" },
        ],
      },
      { text: "Software", link: "/05-Software/" },
      { text: "HashiCorp", link: "/04-HashiCorp/" },
      { text: "Etc.", link: "/06-etc/" },
      {
        text: "MORE",
        items: [
          { text: "About", link: "/99-about/01-About.html" },
          { text: "Thank you", link: "/99-about/02-Thanks.html" },
          { text: "Go Contribute", link: "https://github.com/docmoa/docs" },
        ],
      },
      { text: "#Tags", link: "/98-Tags.html" },
    ],
    sidebar: sidebar,
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
    // ['link', { rel: 'icon', href: '/image/docmoa-144.png'}],
    ["link", { rel: "icon", href: "/favicon.ico" }],
    ["link", { rel: "manifest", href: "/manifest.json" }],
    //   ['meta', {name: "google-site-verification", content: "sHfBWIoCUOYFXJ3b0ulN8jp9jpD8SEW5Wpxvlk-UABA"}],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    ['meta', { name: 'msapplication-TileImage', content: '/image/docmoa-144.png' }],
  ],
  markdown: {
    // lineNumbers: true,
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
    // "@vuepress/search": {},
    flexsearch: {},
    "@vuepress/pwa": {
      serviceWorker: true,
      updatePopup: true,
    },
    "vuepress-plugin-mermaidjs": {},
    "vuepress-plugin-smooth-scroll": {},
    container: {
      type: "vue",
      before: '<pre class="vue-container"><code>',
      after: "</code></pre>",
    },
    sitemap: {
      hostname: "https://docmoa.github.io",
      // outFile: "sitemap.xml",
    },
    "@vuepress/google-analytics": {
      ga: "UA-204926029-1",
    },
    "@vuepress/last-updated": {},
    // "vuepress-plugin-code-copy": {
    //   align: "bottom",
    //   color: "#ffffff",
    // },
    "@mr-hope/copy-code": {
      showInMobile: true,
    }, // https://vuepress-theme-hope.github.io/copy-code/config/
    "vuepress-plugin-contributors": {
      showAvatar: true,
      showCount: false,
      avatarSize: 32,
      defaultAvatar: "/image/not-found.png",
      avatarProvider: "github",
      userProfileUrlProvider: "github",
      baseDir: "docs",
    },
    "vuepress-plugin-element-tabs": {},
    "vuepress-plugin-tags": {
      type: "default",
      selector: ".page .content__default h1",
    },
    // "live": {}, // https://github.com/vue-styleguidist/vuepress-plugin-live
    "md-enhance": { // https://vuepress-theme-hope.github.io/md-enhance/guide/presentation/
      presentation: true,
      mark: true,
      tasklist: true,
      demo: true,
      ineNumbers: true,
    },
    // "vuepress-plugin-right-anchor": {},
    autometa: {
      enable: true, // enables/disables everything - control per page using frontmatter
      image: true, // regular meta image used by search engines
      twitter: true, // twitter card
      og: true, // open graph: facebook, pinterest, google+
      schema: true, // schema.org for google
      site: {
        name: "docmoa",
      },
      canonical_base: 'https://docmoa.github.io',
      description_sources: [
        "frontmatter",
        "excerpt",
        /^((?:(?!^#)(?!^\-|\+)(?!^[0-9]+\.)(?!^!\[.*?\]\((.*?)\))(?!^\[\[.*?\]\])(?!^\{\{.*?\}\})[^\n]|\n(?! *\n))+)(?:\n *)+\n/gim,
        /<p(?:.*?)>(.*?)<\/p>/i,
      ],
      image_sources: [
        "frontmatter",
        /!\[.*?\]\((.*?)\)/i, // markdown image regex
        /<img.*?src=['"](.*?)['"]/i, // html image regex
      ],
    },
  },
  extend: "@vuepress/theme-default",
};
