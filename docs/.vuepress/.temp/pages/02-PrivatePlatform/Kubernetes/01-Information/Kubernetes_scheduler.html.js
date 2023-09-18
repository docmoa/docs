export const data = JSON.parse("{\"key\":\"v-74642274\",\"path\":\"/02-PrivatePlatform/Kubernetes/01-Information/Kubernetes_scheduler.html\",\"title\":\"kubernetes 스케쥴러 알고리즘\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"kubernetes_scheduler\",\"tag\":[\"kubernetes\",\"scheduler\",\"알고리즘\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/02-PrivatePlatform/Kubernetes/01-Information/Kubernetes_scheduler.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"kubernetes 스케쥴러 알고리즘\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"kubernetes_scheduler\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"kubernetes\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"scheduler\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"알고리즘\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"kubernetes 스케쥴러 알고리즘\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"노드 필터링\",\"slug\":\"노드-필터링\",\"link\":\"#노드-필터링\",\"children\":[]},{\"level\":2,\"title\":\"노드 순위 지정\",\"slug\":\"노드-순위-지정\",\"link\":\"#노드-순위-지정\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.65,\"words\":196},\"filePathRelative\":\"02-PrivatePlatform/Kubernetes/01-Information/Kubernetes_scheduler.md\",\"excerpt\":\"<h1> kubernetes 스케쥴러 알고리즘</h1>\\n<ul>\\n<li>원본: <a href=\\\"https://github.com/kubernetes/community/blob/master/contributors/devel/sig-scheduling/scheduler_algorithm.md\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">https://github.com/kubernetes/community/blob/master/contributors/devel/sig-scheduling/scheduler_algorithm.md</a></li>\\n<li>예약되지 않은 각 포드에 대해 Kubernetes 스케줄러는 규칙 집합에 따라 클러스터에서 노드를 찾으려고합니다. Kubernetes 스케줄러에 대한 일반적인 소개는 <a href=\\\"http://scheduler.md\\\" target=\\\"_blank\\\" rel=\\\"noopener noreferrer\\\">scheduler.md</a> 에서 찾을 수 있습니다 . 이 문서에서는 포드의 노드를 선택하는 방법에 대한 알고리즘을 설명합니다. 포드의 대상 노드를 선택하기 전에 두 단계가 있습니다. 첫 번째 단계는 모든 노드를 필터링하고 두 번째 단계는 나머지 노드의 순위를 매겨 포드에 가장 적합한 것을 찾는 것입니다.</li>\\n</ul>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
