import { hopeTheme } from "vuepress-theme-hope";
import { koNavbar } from "./navbar/index.js";
import { koSidebar } from "./sidebar/index.js";

export default hopeTheme({
  hostname: "https://docmoa.github.io",

  iconAssets: "iconfont",

  logo: "/logo.png",
  repo: "docmoa/docs",
  docsDir: "docs",

  // darkmode: "disable",
  print: true,
  fullscreen: true,
  backToTop: true,
  contributors: true,
  lastUpdated: true,

  colorMode: 'light',
  colorModeSwitch: true,

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

  plugins: {

    components: {
      // components you want
      components: [
        "CodePen",
        "PDF",
        "Share",
        "SiteInfo",
        "YouTube",
      ],
    },

    copyright: {
      license: "CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.",
    },

    feed: {
      rss: true,
    },
    
    copyCode: {},

    comment: false,

    blog: {
      filter: (page) => page.frontmatter.title != "Overview",
    },

    git: true,

    prismjs: {
      light: "material-oceanic",
      dark: "material-oceanic"
    },

    // all features are enabled for demo, only preserve features you need here
    mdEnhance: {
      align: true,
      attrs: true,
      chart: true,
      codetabs: true,      
      demo: true,
      echarts: true,
      figure: true,
      flowchart: true,
      gfm: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      katex: true,
      mark: true,
      mermaid: true,
      playground: {
        presets: ["ts", "vue"],
      },
      presentation: true,
      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                  content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
      vuePlayground: true,
    },

    sitemap: true,
    // uncomment these if you want a pwa
    pwa: {
      favicon: "/favicon.ico",
      cacheHTML: false,
      cachePic: false,
      appendBase: true,
      apple: {
        icon: "/assets/icon/apple-icon-152.png",
        statusBarColor: "black",
      },
      msTile: {
        image: "/assets/icon/ms-icon-144.png",
        color: "#ffffff",
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
