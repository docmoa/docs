export const data = JSON.parse("{\"key\":\"v-701287d4\",\"path\":\"/04-HashiCorp/07-Nomad/05-SampleJob/redis.html\",\"title\":\"redis\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"Nomad Sample\",\"tag\":[\"Nomad\",\"Sample\",\"Job\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/04-HashiCorp/07-Nomad/05-SampleJob/redis.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"redis\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"Nomad Sample\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Nomad\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Sample\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"Job\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"redis\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[],\"git\":{},\"readingTime\":{\"minutes\":0.85,\"words\":255},\"filePathRelative\":\"04-HashiCorp/07-Nomad/05-SampleJob/redis.md\",\"excerpt\":\"<h1> redis</h1>\\n<ul>\\n<li>추가내용: redis는 data dir, cluster info dir(클러스터 시) 이 두개의 dir가 필요하여 volume을 추가로 붙여줘야한다.\\n<ul>\\n<li>data dir을 변경이 번거로움(docker build를 다시 해야함) 그래서 클러스터 시에는 docker build, nomad volume으로 나눔과 같은 방법이 있음</li>\\n<li>cluster-enabled : 클러스터로 사용합니다. (cluster volume으로 빼둬야됨)</li>\\n<li>cluster-config-file : 노드별로 클러스터 노드 정보를 conf 파일에 저장합니다.</li>\\n<li>cluster-node-timeout : 노드간 통신이 되지 않아 timeout 되는 시간을 설정합니다.</li>\\n</ul>\\n</li>\\n</ul>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
