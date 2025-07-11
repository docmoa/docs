import { defineUserConfig } from "vuepress";
// import { searchPlugin } from "@vuepress/plugin-search";
import { viteBundler } from '@vuepress/bundler-vite'
import { usePagesPlugin } from 'vuepress-plugin-use-pages'
import { googleAnalyticsPlugin } from '@vuepress/plugin-google-analytics'
import { getDirname, path } from "@vuepress/utils";
import sidebarEnhancer from './plugins/sidebarEnhancer.cjs';

import theme from "./theme.js";

// 공통 filter 함수
const commonFilter = (page) => {
  const isRootDirPage = (
    page.path !== '/' &&
    page.path.endsWith('/') &&
    (
      !page.filePathRelative ||
      page.filePathRelative === "" ||
      page.filePathRelative === undefined
    )
  );

  // 폴더 루트(README.md가 없는 경우)도 제외
  const isDirOnly = (
    page.path !== '/' &&
    page.path.endsWith('/') &&
    (
      !page.frontmatter ||
      !page.frontmatter.title
    )
  );

  return (
    (page.data.title !== 'docmoa') &&
    page.title !== "" &&
    page.filePathRelative !== "" &&
    !(page.path.endsWith('index.html') || page.path === '/') &&
    !isRootDirPage &&
    !isDirOnly
  );
};

// 공통 sort 함수
const commonSort = (a, b) =>
  (b.data.git?.updatedTime ?? 0) - (a.data.git?.updatedTime ?? 0);

// 반복되는 설정을 배열로 관리
const usePagesConfigs = [
  { startsWith: '/', file: 'root.js' },
  { startsWith: '/01-Infrastructure/', file: 'infrastructure.js' },
  { startsWith: '/02-PrivatePlatform/', file: 'privateplatform.js' },
  { startsWith: '/03-PublicCloud/', file: 'publiccloud.js' },
  { startsWith: '/04-HashiCorp/', file: 'hashicorp.js' },
  { startsWith: '/07-Kubernetes/', file: 'kubernetes.js' },
  { startsWith: '/05-Software/', file: 'software.js' },
  { startsWith: '/06-etc/', file: 'etcpage.js' },
];

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

    ...usePagesConfigs.map(cfg =>
      usePagesPlugin({
        ...cfg,
        sort: commonSort,
        filter: commonFilter,
        limit: 15,
      })
    ),

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