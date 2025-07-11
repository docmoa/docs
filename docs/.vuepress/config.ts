import { defineUserConfig } from "vuepress";
// import { searchPlugin } from "@vuepress/plugin-search";
import { viteBundler } from '@vuepress/bundler-vite'
import { usePagesPlugin } from 'vuepress-plugin-use-pages'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { getDirname, path } from "@vuepress/utils";
import sidebarEnhancer from './plugins/sidebarEnhancer.cjs';
import { markdownChartPlugin } from '@vuepress/plugin-markdown-chart';

import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  head: [
    ['link', { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap' }],
    ['link', { rel: 'icon', href: '/logo.png' }]
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

  theme: theme,

  bundler: viteBundler({
    viteOptions: {},
    vuePluginOptions: {},
  }),

  alias: {    
    "@TagLinks": path.resolve(__dirname, "components/TagLinks.vue"),
    "@TagList": path.resolve(__dirname, "components/TagList.vue"),
  },

  plugins: [
    sidebarEnhancer,
    
    googleAnalyticsPlugin({
      id: 'UA-204926029-1',
    }),

    markdownChartPlugin({
      chartjs: true, // Chart.js 지원 활성화
    }),

    // searchPlugin({
    //   locales: {
    //     "/": {
    //       placeholder: "Search",
    //     },
    //   },
    //   maxSuggestions: 15,
    //   isSearchable: (page) => page.path !== "/" || page.title !== "Overview",
    // }),
  ],

  // Enable it with pwa
  shouldPrefetch: false,
});