export const data = JSON.parse("{\"key\":\"v-15e53ccb\",\"path\":\"/02-PrivatePlatform/\",\"title\":\"Private Platform\",\"lang\":\"ko-KR\",\"frontmatter\":{\"tag\":[\"Platform\"],\"headerDepth\":0,\"description\":\"Private Platform Recent pages {{ page.title }} [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/02-PrivatePlatform/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Private Platform\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Private Platform Recent pages {{ page.title }} [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Platform\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Private Platform\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"Recent pages\",\"slug\":\"recent-pages\",\"link\":\"#recent-pages\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.2,\"words\":59},\"filePathRelative\":\"02-PrivatePlatform/README.md\",\"excerpt\":\"<h1> Private Platform</h1>\\n<h2> Recent pages</h2>\\n<ul>\\n  <li v-for=\\\"page in pages\\\" :key=\\\"page.key\\\">\\n    <a :to=\\\"page.path\\\" href=\\\"undefined\\\" target=\\\"blank\\\">{{ page.title }}</a>\\n    <span v-if=\\\"page.frontmatter.date\\\">\\n      [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\\n    </span>\\n  </li>\\n</ul>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"},\"autoDesc\":true}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updatePageData) {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ data }) => {
    __VUE_HMR_RUNTIME__.updatePageData(data)
  })
}
