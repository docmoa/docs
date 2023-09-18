export const data = JSON.parse("{\"key\":\"v-bf6ccbda\",\"path\":\"/04-HashiCorp/04-Consul/04-TroubleShooting/Consul%20Install.html\",\"title\":\"Consul yum install issue\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Identifying consul split-brain\",\"tag\":[\"Consul\",\"install\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/04-Consul/04-TroubleShooting/Consul%20Install.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Consul yum install issue\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Identifying consul split-brain\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Consul\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"install\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Consul yum install issue\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"Consul 시작시 오류로그\",\"slug\":\"consul-시작시-오류로그\",\"link\":\"#consul-시작시-오류로그\",\"children\":[]},{\"level\":2,\"title\":\"원인 및 해결방안\",\"slug\":\"원인-및-해결방안\",\"link\":\"#원인-및-해결방안\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.22,\"words\":67},\"filePathRelative\":\"04-HashiCorp/04-Consul/04-TroubleShooting/Consul Install.md\",\"excerpt\":\"<h1> Consul yum install issue</h1>\\n<p>AmazonLinux 환경에서 하기와 같은 명령어로 consul 설치 후 systemd 를 통한 Consul 시작시 오류 발생</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-ext=\\\"sh\\\"><pre class=\\\"language-bash\\\"><code><span class=\\\"token function\\\">sudo</span> yum-config-manager --add-repo https://rpm.releases.hashicorp.com/AmazonLinux/hashicorp.repo\\n<span class=\\\"token function\\\">sudo</span> yum <span class=\\\"token parameter variable\\\">-y</span> <span class=\\\"token function\\\">install</span> consul\\n</code></pre><div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
