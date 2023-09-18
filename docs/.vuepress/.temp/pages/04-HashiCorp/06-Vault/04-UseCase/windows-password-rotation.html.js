export const data = JSON.parse("{\"key\":\"v-8a659d6c\",\"path\":\"/04-HashiCorp/06-Vault/04-UseCase/windows-password-rotation.html\",\"title\":\"Windows Password rotation\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Vault를 활용하여 Windows Password 저장\",\"tag\":[\"vault\",\"windows\",\"nomad\",\"password\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/06-Vault/04-UseCase/windows-password-rotation.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Windows Password rotation\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Vault를 활용하여 Windows Password 저장\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"vault\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"windows\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"nomad\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"password\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Windows Password rotation\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":2.12,\"words\":636},\"filePathRelative\":\"04-HashiCorp/06-Vault/04-UseCase/windows-password-rotation.md\",\"excerpt\":\"<h1> Windows Password rotation</h1>\\n<blockquote>\\n<p><a href=\\\"https://scarolan.github.io/painless-password-rotation/#37\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://scarolan.github.io/painless-password-rotation/#37</a></p>\\n</blockquote>\\n<p>Kv 추가</p>\\n<div class=\\\"language-bash line-numbers-mode\\\" data-ext=\\\"sh\\\"><pre class=\\\"language-bash\\\"><code>$ vault secrets <span class=\\\"token builtin class-name\\\">enable</span> <span class=\\\"token parameter variable\\\">-version</span><span class=\\\"token operator\\\">=</span><span class=\\\"token number\\\">2</span> <span class=\\\"token parameter variable\\\">-path</span><span class=\\\"token operator\\\">=</span>systemcreds/ kv\\n</code></pre><div class=\\\"line-numbers\\\" aria-hidden=\\\"true\\\"><div class=\\\"line-number\\\"></div></div></div>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
