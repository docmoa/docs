export const data = JSON.parse("{\"key\":\"v-80f4344c\",\"path\":\"/04-HashiCorp/08-Updates/98-2023/2023-03.html\",\"title\":\"2023년 3월\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"2023년 3월 Update\",\"tag\":[\"Hashicorp\",\"Update\",\"Mar\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/08-Updates/98-2023/2023-03.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"2023년 3월\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"2023년 3월 Update\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Hashicorp\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Update\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Mar\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"2023년 3월\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"Product 소개\",\"slug\":\"product-소개\",\"link\":\"#product-소개\",\"children\":[]},{\"level\":2,\"title\":\"Product Update\",\"slug\":\"product-update\",\"link\":\"#product-update\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":1.23,\"words\":370},\"filePathRelative\":\"04-HashiCorp/08-Updates/98-2023/2023-03.md\",\"excerpt\":\"<h1> 2023년 3월</h1>\\n<h2> Product 소개</h2>\\n<ul>\\n<li>\\n<p>Writing Terraform for unsupported resources</p>\\n<ul>\\n<li><a href=\\\"https://www.hashicorp.com/blog/writing-terraform-for-unsupported-resources\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">Hashicorp Blog</a></li>\\n<li>Terraform 과 대상 환경 간 연동을 위해 Provider 를 활용할 때 대상 환경이 API 을 통해서는 지원하는 기능이지만 Provider 에는 구현되어 있지 않아 사용할 수 없는 기능이 종종 있습니다 (예: Vault Provider 기반 Vault 운영 시 Unseal 기능 사용 불가). Terracurl 을 통해 API 을 통해서만 지원되는 기능들을 Terraform Code 로 구성하여 하나의 Resource 로 관리할 수 있습니다.</li>\\n</ul>\\n</li>\\n</ul>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
