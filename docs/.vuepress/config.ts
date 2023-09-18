import { defineUserConfig } from "vuepress";
import { searchPlugin } from "@vuepress/plugin-search";
import { usePagesPlugin } from 'vuepress-plugin-use-pages'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { getDirname, path } from "@vuepress/utils";
import sidebarEnhancer from './plugins/sidebarEnhancer.cjs';

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap' }]
  ],

  locales: {
    "/": {
      lang: "ko-KR",
      title: "docmoa",
      description: "A docs for docmoa",
    },
    // "/en/": {
    //   lang: "en-US",
    //   title: "Docs Demo",
    //   description: "A docs demo for vuepress-theme-hope",
    // },
  },

  theme,

  alias: {    
    "@TagLinks": path.resolve(__dirname, "components/TagLinks.vue"),
    "@TagList": path.resolve(__dirname, "components/TagList.vue"),
  },

  plugins: [
    sidebarEnhancer,
    
    googleAnalyticsPlugin({
      id: 'UA-204926029-1',
    }),

    searchPlugin({
      locales: {
        "/": {
          placeholder: "Search",
        },
      },
      maxSuggestions: 15,
      isSearchable: (page) => page.path !== "/" || page.title !== "Overview",
    }),
    usePagesPlugin({
      startsWith: '/01-Infrastructure/',
      file: 'infrastructure.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
    usePagesPlugin({
      startsWith: '/02-PrivatePlatform/',
      file: 'privateplatform.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
    usePagesPlugin({
      startsWith: '/03-PublicCloud/',
      file: 'publiccloud.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
    usePagesPlugin({
      startsWith: '/04-HashiCorp/',
      file: 'hashicorp.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
    usePagesPlugin({
      startsWith: '/05-Software/',
      file: 'software.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
    usePagesPlugin({
      startsWith: '/06-etc/',
      file: 'etcpage.js',
      sort: (a, b) => b.data.frontmatter.date - a.data.frontmatter.date,
      filter: (page) => page.data.title != 'Overview',
      limit: 10,
    }),
  ],

  // Enable it with pwa
  // shouldPrefetch: false,
});