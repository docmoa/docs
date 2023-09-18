export const data = JSON.parse("{\"key\":\"v-97ffe92e\",\"path\":\"/06-etc/\",\"title\":\"Etc.\",\"lang\":\"ko-KR\",\"frontmatter\":{\"tag\":[\"Etc\"],\"headerDepth\":0,\"description\":\"Etc. Recent pages {{ page.title }} [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\",\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/06-etc/\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Etc.\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Etc. Recent pages {{ page.title }} [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Etc\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Etc.\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"Recent pages\",\"slug\":\"recent-pages\",\"link\":\"#recent-pages\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.19,\"words\":58},\"filePathRelative\":\"06-etc/README.md\",\"excerpt\":\"<h1> Etc.</h1>\\n<h2> Recent pages</h2>\\n<ul>\\n  <li v-for=\\\"page in pages\\\" :key=\\\"page.key\\\">\\n    <a :to=\\\"page.path\\\" href=\\\"undefined\\\" target=\\\"blank\\\">{{ page.title }}</a>\\n    <span v-if=\\\"page.frontmatter.date\\\">\\n      [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]\\n    </span>\\n  </li>\\n</ul>\\n\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"},\"autoDesc\":true}")

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
