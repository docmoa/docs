export const data = JSON.parse("{\"key\":\"v-591cd25b\",\"path\":\"/06-etc/nodejs/node-sass.html\",\"title\":\"node-sass와 sass로의 전환\",\"lang\":\"ko-KR\",\"frontmatter\":{\"description\":\"node-sass 오류와 sass로의 전환\",\"tag\":[\"arm\",\"nodejs\"],\"head\":[[\"meta\",{\"property\":\"og:url\",\"content\":\"https://vuepress-theme-hope-docs-demo.netlify.app/06-etc/nodejs/node-sass.html\"}],[\"meta\",{\"property\":\"og:site_name\",\"content\":\"docmoa\"}],[\"meta\",{\"property\":\"og:title\",\"content\":\"node-sass와 sass로의 전환\"}],[\"meta\",{\"property\":\"og:description\",\"content\":\"node-sass 오류와 sass로의 전환\"}],[\"meta\",{\"property\":\"og:type\",\"content\":\"article\"}],[\"meta\",{\"property\":\"og:locale\",\"content\":\"ko-KR\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"arm\"}],[\"meta\",{\"property\":\"article:tag\",\"content\":\"nodejs\"}],[\"script\",{\"type\":\"application/ld+json\"},\"{\\\"@context\\\":\\\"https://schema.org\\\",\\\"@type\\\":\\\"Article\\\",\\\"headline\\\":\\\"node-sass와 sass로의 전환\\\",\\\"image\\\":[\\\"\\\"],\\\"dateModified\\\":null,\\\"author\\\":[]}\"]]},\"headers\":[{\"level\":2,\"title\":\"node-sass란?\",\"slug\":\"node-sass란\",\"link\":\"#node-sass란\",\"children\":[]},{\"level\":2,\"title\":\"node-sass와 Nodejs 버전별 호환성\",\"slug\":\"node-sass와-nodejs-버전별-호환성\",\"link\":\"#node-sass와-nodejs-버전별-호환성\",\"children\":[]},{\"level\":2,\"title\":\"Dart Sass 로의 전환\",\"slug\":\"dart-sass-로의-전환\",\"link\":\"#dart-sass-로의-전환\",\"children\":[]}],\"git\":{},\"readingTime\":{\"minutes\":0.39,\"words\":118},\"filePathRelative\":\"06-etc/nodejs/node-sass.md\",\"excerpt\":\"<h1> node-sass와 sass로의 전환</h1>\\n<p>aarch64에서 vuepress 실행을 위해 테스트를 하던 도중 node-gyp와 node-sass에 대한 오류를 맞이하게 되었다.</p>\\n<p>node-sass의 경우 arm환경에 대한 빌드 릴리즈가 없는 관계로 <code>npm install</code>을 실행하면 다시 빌드를 하게되는데, 이때 node-sass를 빌드하는 과정에서 빌드 실패가 발생함</p>\\n<h2> node-sass란?</h2>\\n<p>node환경에서 sass는 css 코드로 변환해주는 스타일 전처리언어이다. c/c++로 되어있는 구성요소로 인해 빠른 빌드 속도를 제공한다.</p>\",\"copyright\":{\"license\":\"CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.\"}}")

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
