<template><div><h1 id="private-platform" tabindex="-1"><a class="header-anchor" href="#private-platform" aria-hidden="true">#</a> Private Platform</h1>
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
</ul></div></template>

<script>
import { defineComponent } from 'vue'
import { usePages } from '@temp/privateplatform'  // pages.js is default filename

export default defineComponent({
  setup() {
    const pages = usePages()
    console.log(pages)
    return { pages }
  },
})
</script>
