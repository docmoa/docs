export const data = JSON.parse("{\"key\":\"v-6eb5d53d\",\"path\":\"/04-HashiCorp/07-Nomad/05-SampleJob/tomcat.html\",\"title\":\"Tomcat\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Nomad + Consul Sample\",\"tag\":[\"Nomad\",\"Consul\",\"Sample\",\"Job\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/07-Nomad/05-SampleJob/tomcat.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"Tomcat\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Nomad + Consul Sample\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Nomad\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Consul\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Sample\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Job\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"Tomcat\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"nginx\",\"slug\":\"nginx\",\"link\":\"#nginx\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":1.22,\"words\":365},\"filePathRelative\":\"04-HashiCorp/07-Nomad/05-SampleJob/tomcat.md\",\"excerpt\":\"<h1> Tomcat</h1>\\n<ul>\\n<li>tomcat 다운로드\\n<ul>\\n<li>다운로드 받지않고 호스트에 미리 설치해 놓는 방식이 더 가벼워보임 --&gt; 아마도 Packer, Terraform의 조합이면 가능</li>\\n<li>다운로드 받게 구성하면 컨테이너처럼 Nomad가 배포할 때마다 다운받아서 구성 가능</li>\\n</ul>\\n</li>\\n<li>Template - server.xml\\n<ul>\\n<li>server.xml 기본 구성에서 port가 선언되는 자리를 java option에서 받을 수 있도록 변경</li>\\n<li>Template 구성도 가능하고 미리 구성한 xml을 다운로드 받게 하는것도 괜찮아 보임</li>\\n</ul>\\n</li>\\n<li>Consul과 함께 구성된 경우 Nginx같은 LB 구성 Job 에서 backend를 동적으로 구성 가능</li>\\n</ul>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
