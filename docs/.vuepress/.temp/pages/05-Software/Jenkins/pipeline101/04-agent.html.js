export const data = JSON.parse("{\"key\":\"v-0894d88c\",\"path\":\"/05-Software/Jenkins/pipeline101/04-agent.html\",\"title\":\"4. Agents and Distributing Builds\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"jenkins 101\",\"tag\":[\"cicd\",\"jenkins\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/05-Software/Jenkins/pipeline101/04-agent.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"4. Agents and Distributing Builds\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"jenkins 101\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"cicd\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"jenkins\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"4. Agents and Distributing Builds\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"4.1 Adding an SSH build agent to Jenkins\",\"slug\":\"_4-1-adding-an-ssh-build-agent-to-jenkins\",\"link\":\"#_4-1-adding-an-ssh-build-agent-to-jenkins\",\"children\":[]},{\"level\":2,\"title\":\"4.2 Using Docker images for agents\",\"slug\":\"_4-2-using-docker-images-for-agents\",\"link\":\"#_4-2-using-docker-images-for-agents\",\"children\":[]},{\"level\":2,\"title\":\"4.3 Configuring specific agents\",\"slug\":\"_4-3-configuring-specific-agents\",\"link\":\"#_4-3-configuring-specific-agents\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":2.31,\"words\":693},\"filePathRelative\":\"05-Software/Jenkins/pipeline101/04-agent.md\",\"excerpt\":\"<h1> 4. Agents and Distributing Builds</h1>\\n<p>빌드를 수행하기 위한 Worker로 다중 Jenkins를 컨트롤 할 수 있습니다. 이때 명령을 수행하는 Jenkins는 <code>Master</code>, 빌드를 수행하는 Jenkins는 <code>Worker</code>로 구분합니다. 여기서는 Worker의 연결을 원격 호스트의 Jenkins를 SSH를 통해 연결하는 방식과 컨테이너로 구성된 Jenkins를 연결하는 과정을 확인 합니다.</p>\\n<p>Master-Slave 방식, 또는 Master-Agent 방식으로 표현합니다.</p>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
