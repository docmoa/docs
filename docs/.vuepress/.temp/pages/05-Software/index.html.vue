<template><div><h1 id="software" tabindex="-1"><a class="header-anchor" href="#software" aria-hidden="true">#</a> Software</h1>
<h2 id="recent-pages" tabindex="-1"><a class="header-anchor" href="#recent-pages" aria-hidden="true">#</a> Recent pages</h2>
<ul>
  <li
    v-for="page in pages"
    :key="page.key"
  >
    <RouterLink :to="page.path">{{ page.title }}</RouterLink>
    <span v-if="page.frontmatter.date">
      [ {{ (new Date(page.frontmatter.date)).toLocaleString() }} ]
    </span>
  </li>
</ul>
<h2 id="jenkins" tabindex="-1"><a class="header-anchor" href="#jenkins" aria-hidden="true">#</a> Jenkins</h2>
<ul>
<li>젠킨스는 소프트웨어 개발 시 지속적 통합 서비스를 제공하는 툴이다.</li>
</ul>
<h2 id="tomcat" tabindex="-1"><a class="header-anchor" href="#tomcat" aria-hidden="true">#</a> Tomcat</h2>
<ul>
<li>아파치 톰캣은 아파치 소프트웨어 재단에서 개발한 서블릿 컨테이너만 있는 웹 애플리케이션 서버이다.</li>
</ul>
</div></template>

<script>
import { defineComponent } from 'vue'
import { usePages } from '@temp/software'  // pages.js is default filename

export default defineComponent({
  setup() {
    const pages = usePages()
    console.log(pages)
    return { pages }
  },
})
</script>
