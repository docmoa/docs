<template><div><!-- <script>
import { defineComponent } from 'vue'
import { usePages as infrastructure } from '@temp/infrastructure'  // pages.js is default filename
import { usePages as privateplatform } from '@temp/privateplatform'  // pages.js is default filename
import { usePages as publiccloud } from '@temp/publiccloud'  // pages.js is default filename
import { usePages as hashicorp } from '@temp/hashicorp'  // pages.js is default filename
import { usePages as software } from '@temp/software'  // pages.js is default filename
import { usePages as etc } from '@temp/etcpage'  // pages.js is default filename

export default defineComponent({
  setup() {
    const contents= ['01-Infrastructure', '02-PrivatePlatform', '03-Public%20Cloud', '04-HashiCorp', '05-Software', '06-etc']
    const pages = {}
    pages['01-Infrastructure'] = infrastructure;
    pages['02-PrivatePlatform'] = privateplatform;
    pages['03-PublicCloud'] = publiccloud;
    pages['04-HashiCorp'] = hashicorp;
    pages['05-Software'] = software;
    pages['06-etc'] = etc;
    console.log(pages)
    return { contents, pages }
  },
})
</script>

<div>
  <div v-for="content in contents" v-bind:key="content.id">
    <a :href="`/${content}/`" class="vp-link vp-features-item link" role="navigation">{{ content.split('-')[1].replace("%20"," ") }}
      <h3 class="vp-feature-title"></h3>
      <p></p>
    </a>

  </div>
</div> -->
<hr>
<h3 id="start-contributing-to-docmoa" tabindex="-1"><a class="header-anchor" href="#start-contributing-to-docmoa" aria-hidden="true">#</a> Start contributing to <code v-pre>docmoa</code></h3>
<blockquote>
<p>Tested NodeJS : v18</p>
</blockquote>
<CodeTabs id="10" :data='[{"id":"npm"},{"id":"yarn"}]'>
<template #title0="{ value, isActive }">npm</template>
<template #title1="{ value, isActive }">yarn</template>
<template #tab0="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># git clone</span>
<span class="token function">git</span> clone https://github.com/docmoa/docs.git
<span class="token comment"># npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">npm</span> <span class="token function">install</span>
<span class="token comment"># start VuePress writing</span>
<span class="token function">npm</span> run dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
<template #tab1="{ value, isActive }">
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre bash="" class="language-bash"><code><span class="token comment"># git clone</span>
<span class="token function">git</span> clone https://github.com/docmoa/docs.git
<span class="token comment"># npm install</span>
<span class="token builtin class-name">cd</span> docs
<span class="token function">yarn</span> <span class="token function">install</span>
<span class="token comment"># start VuePress writing</span>
<span class="token function">yarn</span> vuepress dev
</code></pre><div class="highlight-lines"><br><div class="highlight-line">&nbsp;</div><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></template>
</CodeTabs>
</div></template>


