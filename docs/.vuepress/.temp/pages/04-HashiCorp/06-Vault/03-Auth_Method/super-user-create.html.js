export const data = JSON.parse("{\"key\":\"v-c4e99eb8\",\"path\":\"/04-HashiCorp/06-Vault/03-Auth_Method/super-user-create.html\",\"title\":\"Vault SuperUser 생성\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Vault Super user 만들기\",\"author\":\"이규석\",\"tag\":[\"vault auth\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/06-Vault/03-Auth_Method/super-user-create.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Vault SuperUser 생성\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Vault Super user 만들기\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:author\",\"content\":\"이규석\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"vault auth\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Vault SuperUser 생성\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[{\\\"@type\\\":\\\"Person\\\",\\\"name\\\":\\\"이규석\\\"}]}\"]]},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.49,\"words\":147},\"filePathRelative\":\"04-HashiCorp/06-Vault/03-Auth_Method/super-user-create.md\",\"excerpt\":\"<h1> Vault SuperUser 생성</h1>\\n<div class=\\\"hint-container danger\\\">\\n<p class=\\\"hint-container-title\\\">주의</p>\\n<p>해당 방법은 username/password 방식의 Admin권한의 사용자를 생성하나,<br>\\n보안상 실 구성에는 권장하지 않습니다.</p>\\n</div>\\n<ol>\\n<li>userpass 활성화</li>\\n</ol>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-ext=\\\"sh\\\"><pre class=\\\"language-bash\\\"><code>vault auth <span class=\\\"token builtin class-name\\\">enable</span> userpass\\n</code></pre><div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\"><div class=\\\"line-number\\\"></div></div></div>\",\"copyright\":{\"author\":\"이규석\",\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
