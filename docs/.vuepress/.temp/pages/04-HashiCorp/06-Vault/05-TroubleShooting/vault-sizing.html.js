export const data = JSON.parse("{\"key\":\"v-10d0996d\",\"path\":\"/04-HashiCorp/06-Vault/05-TroubleShooting/vault-sizing.html\",\"title\":\"Vault MariaDB5.5 Dynamic Secret\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"MariaDB5.5버전에서 Dynamic Secret  구성을 위한 credential생성시 에러\",\"tag\":[\"vault\",\"MiriaDB\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/06-Vault/05-TroubleShooting/vault-sizing.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Vault MariaDB5.5 Dynamic Secret\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"MariaDB5.5버전에서 Dynamic Secret  구성을 위한 credential생성시 에러\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"vault\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"MiriaDB\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Vault MariaDB5.5 Dynamic Secret\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.39,\"words\":116},\"filePathRelative\":\"04-HashiCorp/06-Vault/05-TroubleShooting/vault-sizing.md\",\"excerpt\":\"<h1> Vault MariaDB5.5 Dynamic Secret</h1>\\n<ul>\\n<li>\\n<p>현상 : $vault read mysql/creds/my-role 입력시 오류</p>\\n</li>\\n<li>\\n<p>오류 내용 :</p>\\n</li>\\n</ul>\\n<div class=\\\"language-text line-numbers-mode\\\" data-ext=\\\"text\\\"><pre class=\\\"language-text\\\"><code>Error reading mysql/creds/my-role: Error making API request.\\nURL: GET http://127.0.0.1:8200/v1/mysql/creds/my-role\\nCode: 500. Errors:\\n\\n* 1 error occurred:\\n      * Error 1470: String 'v-root-my-role-87BP93fheiaHKGelc' is too long for user name (should be no longer than 16)\\n</code></pre><div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\"><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div><div class=\\\"line-number\\\"></div></div></div>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
