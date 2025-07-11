---
tag: ["Software"]
toc:
  levels: 0
---

# Software

## Recent pages

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

## Jenkins
- 젠킨스는 소프트웨어 개발 시 지속적 통합 서비스를 제공하는 툴이다.

## Tomcat
- 아파치 톰캣은 아파치 소프트웨어 재단에서 개발한 서블릿 컨테이너만 있는 웹 애플리케이션 서버이다. 

