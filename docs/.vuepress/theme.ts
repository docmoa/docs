import { hopeTheme } from "vuepress-theme-hope";
import { koNavbar } from "./navbar/index.js";
import { koSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://docmoa.github.io",

  // https://fontawesome.com/search?o=r&m=free
  // iconAssets: "fontawesome-with-brands",

  logo: "/logo.png",
  repo: "docmoa/docs",
  docsDir: "docs",

  // darkmode: "disable",
  print: true,
  fullscreen: true,
  // backToTop: true,
  contributors: true,
  lastUpdated: true,

  // colorMode: 'light',
  // colorModeSwitch: true,

  hotReload: true,

  locales: {
    "/": {
      // navbar
      navbar: koNavbar,

      sidebar: koSidebar,

      footer: "CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.",

      displayFooter: true,

      metaLocales: {
        editLink: "Edit this page on GitHub",
      },
    },
  },

  markdown: {
    figure: true,
    imgLazyload: true,
    imgSize: true,
    math: true,
    codeTabs: true,
    tabs: true,
    gfm: true,
    component: true,
    vPre: true,
    include: true,
    align: true,
    attrs: true,
    mark: true,
    sup: true,
    sub: true,
    chartjs: true,
    echarts: true,
    flowchart: true,
    mermaid: true,
    plantuml: true,
    demo: true,
    vuePlayground: true,
    playground: { presets: ["ts", "vue"] },
    highlighter: {
      type: "prismjs",
      themes: {
        light: "one-light",
        dark: "material-oceanic"
      },
      lineNumbers: 10,
      collapsedLines: 20,
      notationDiff: true,
      notationFocus: true,
      notationHighlight: true,
      notationWordHighlight: true,
    },
  },

  plugins: {
    icon: {
      assets: "fontawesome-with-brands",
    },

    components: {
      // components you want
      components: [
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "Badge",
        "VidStack",
        "VPCard"
      ],
    },

    readingTime: {
      wordPerMinute: 60
    },

    slimsearch: {
      locales: {
        "/": {
          placeholder: "Search",
        },
      },
    },

    copyright: {
      author: "All contributers",
      license: "CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.",
    },
    
    copyCode: {},

    comment: false,

    blog: {
      filter: (page) => page.frontmatter.title != "Overview",
    },

    git: true,

    sitemap: true,

    // search: {
    //   locales: {
    //     "/": {
    //       placeholder: "Search",
    //     },
    //   },
    //   maxSuggestions: 5,
    //   isSearchable: (page) => page.path !== "/" || page.title !== "Overview",
    // },
    
    feed: {
      rss: true,
      icon: "rss",
      rssOutputFilename: "rss.xml",
      devServer: true,
      devHostname: "http://localhost:8080"
    },

    // uncomment these if you want a pwa
    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: false,
      cacheImage: false,
      appendBase: true,
      maxSize: 1024 * 20,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      manifest: {
        icons: [
          {
            src: "/assets/icon/chrome-mask-512.png",
            sizes: "512x512",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-mask-192.png",
            sizes: "192x192",
            purpose: "maskable",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "/assets/icon/chrome-192.png",
            sizes: "192x192",
            type: "image/png",
          },
        ],
        shortcuts: [
          // {
          //   name: "Demo",
          //   short_name: "Demo",
          //   url: "/demo/",
          //   icons: [
          //     {
          //       src: "/assets/icon/guide-maskable.png",
          //       sizes: "192x192",
          //       purpose: "maskable",
          //       type: "image/png",
          //     },
          //   ],
          // },
        ],
      },
    },
  },
});
