export const data = JSON.parse("{\"key\":\"v-9ac15b26\",\"path\":\"/04-HashiCorp/07-Nomad/02-Config/Nomad-Ui-Token.html\",\"title\":\"Nomad UI Token\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Nomad ACL\",\"tag\":[\"Nomad\",\"ACL\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/07-Nomad/02-Config/Nomad-Ui-Token.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Nomad UI Token\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Nomad ACL\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:image\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"name\":\"twitter:card\",\"content\":\"summary_large_image\"}],[\"meta\",{\"name\":\"twitter:image:alt\",\"content\":\"Nomad UI Token\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Nomad\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"ACL\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Nomad UI Token\\\",\\\"image\\\":[\\\"https://vuepress-theme-hope-docs-demo.netlify.app/\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"Nomad cli\",\"slug\":\"nomad-cli\",\"link\":\"#nomad-cli\",\"children\":[]},{\"level\":2,\"title\":\"Nomad UI\",\"slug\":\"nomad-ui\",\"link\":\"#nomad-ui\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.4,\"words\":121},\"filePathRelative\":\"04-HashiCorp/07-Nomad/02-Config/Nomad-Ui-Token.md\",\"excerpt\":\"<h1> Nomad UI Token</h1>\\n<div class=\\\"hint-container tip\\\">\\n<p class=\\\"hint-container-title\\\">팁</p>\\n<p>해당 Token의 policy는 특정인이 원하여 만들었으며, 더 다양한 제약과 허용을 할 수 있습니다. 해당 policy는 아래와 같은 제약과 허용을 합니다.</p>\\n<ol>\\n<li>UI에서 exec(job에 접근) 제한</li>\\n<li>그 외에 job, node, volume, server등의 모든 화면 읽어오기</li>\\n</ol>\\n</div>\\n<h2> Nomad cli</h2>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
