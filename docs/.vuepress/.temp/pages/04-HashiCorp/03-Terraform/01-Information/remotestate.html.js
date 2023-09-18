export const data = JSON.parse("{\"key\":\"v-0bd2e792\",\"path\":\"/04-HashiCorp/03-Terraform/01-Information/remotestate.html\",\"title\":\"Remote State\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Terraform Features\",\"tag\":[\"terraform\",\"IaC\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/03-Terraform/01-Information/remotestate.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Remote State\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Terraform Features\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"terraform\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"IaC\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Remote State\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"terraform_remote_state datasource\",\"slug\":\"terraform-remote-state-datasource\",\"link\":\"#terraform-remote-state-datasource\",\"children\":[]},{\"level\":2,\"title\":\"마치며\",\"slug\":\"마치며\",\"link\":\"#마치며\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.6,\"words\":179},\"filePathRelative\":\"04-HashiCorp/03-Terraform/01-Information/remotestate.md\",\"excerpt\":\"<h1> Remote State</h1>\\n<p>Terraform을 수행하고나면 실행되고난 뒤의 상태가 저장됩니다. 로컬에서 OSS로 실행 했을 때의 <code>terraform.tfstate</code> 파일이 그것 입니다. 서로 다른 팀이 각자의 워크스페이스에서 작업하고 난뒤 각 상태 공유하면 변경된 내역에 따라 다음 작업을 이어갈 수 있습니다. Terraform은  Terraform Cloud, HashiCorp Consul, Amazon S3, Alibaba Cloud OSS 등에 상태 저장을 지원합니다.</p>\\n<iframe width=\\\"560\\\" height=\\\"315\\\" src=\\\"https://www.youtube.com/embed/4b7IZAXzha8\\\" frameborder=\\\"0\\\" allow=\\\"accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture\\\" allowfullscreen=\\\"\\\"></iframe>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
