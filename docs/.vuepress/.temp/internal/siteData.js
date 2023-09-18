export const siteData = JSON.parse("{\"base\":\"/\",\"lang\":\"en-US\",\"title\":\"\",\"description\":\"\",\"head\":[[\"link\",{\"rel\":\"stylesheet\",\"href\":\"https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap\"}],[\"link\",{\"rel\":\"manifest\",\"href\":\"/manifest.webmanifest\",\"crossorigin\":\"use-credentials\"}],[\"meta\",{\"name\":\"theme-color\",\"content\":\"#46bd87\"}],[\"meta\",{\"name\":\"viewport\",\"content\":\"width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover\"}],[\"link\",{\"rel\":\"alternate\",\"type\":\"application/rss+xml\",\"href\":\"https://vuepress-theme-hope-docs-demo.netlify.app/rss.xml\",\"title\":\"docmoa RSS Feed\"}]],\"locales\":{\"/\":{\"lang\":\"ko-KR\",\"title\":\"docmoa\",\"description\":\"A docs for docmoa\"}}}")

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept()
  if (__VUE_HMR_RUNTIME__.updateSiteData) {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  }
}

if (import.meta.hot) {
  import.meta.hot.accept(({ siteData }) => {
    __VUE_HMR_RUNTIME__.updateSiteData(siteData)
  })
}
