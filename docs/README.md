---
home: true
icon: home
title: docmoa
heroImage: /logo.png
heroText: docmoa
tagline: "그림같이 써라.<br>그러면 기억 속에 머물 것이다."
actions:
  - text: 🚀 시작하기
    link: /00-Howto/index.html
    type: primary
  - text: ⏰ 최신글
    link: "https://docmoa.github.io/timeline/"
    type: primary    
  - text: " RSS"
    link: "https://docmoa.github.io/rss.xml"
    icon: rss

features:
  - title: Infrastructure
    details: Linux / Container
    link: /01-Infrastructure/
  - title: Private Platform
    details: VSphere
    link: /02-PrivatePlatform/
  - title: Public Cloud
    details: Alibaba / Naver Cloud
    link: /03-PublicCloud/
  - title: HashiCorp
    details: Packer / Vagrant / Terraform / Consul / Boundary / Vault / Nomad / Waypoint
    link: /04-HashiCorp/
  - title: Kubernetes
    details: Kubernetes Infra
    link: /07-Kubernetes/
  - title: Software
    details: Jenkins / Tomcat
    link: /05-Software/
  - title: Etc.
    link: /06-etc/
#   - title: How to
#     details: 활용 방법 안내

copyright: false
footer: CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.

---
---

### [최신글 🔗](/timeline/)

<script>
import { defineComponent } from 'vue'
import { usePages } from '@temp/root'  // pages.js is default filename

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
    <!-- <span v-if="page.localizedDate">
      [ 최초 작성일 {{ page.localizedDate }} ]
    </span> -->
  </li>
</ul>

---

### Start contributing to `docmoa`

::: tip Run info
Minimum NodeJS version : `v20.5.x`
:::

::: code-tabs
@tab npm

```bash {2,5-6,9}
# git clone
git clone https://github.com/docmoa/docs.git
# npm install
cd docs
npm install
# start VuePress writing
npm run dev
```

@tab yarn

```bash {2,5-6,9}
# git clone
git clone https://github.com/docmoa/docs.git
# npm install
cd docs
yarn install
# start VuePress writing
yarn vuepress dev
```

:::
