---
home: true
icon: home
title: docmoa
heroImage: /logo.png
heroText: docmoa
tagline: "그림같이 써라.<br>그러면 기억 속에 머물 것이다."
actions:
  - text: 🚀 Getting Start
    link: /00-Howto/index.html
    type: primary
  - text: ⏰ Timeline
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
    details: Kubernetes / OpenShift / VSphere
    link: /02-PrivatePlatform/
  - title: Public Cloud
    details: Alibaba / Naver Cloud
    link: /03-PublicCloud/
  - title: HashiCorp
    details: Packer / Vagrant / Terraform / Consul / Boundary / Vault / Nomad / Waypoint
    link: /04-HashiCorp/
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

<!-- <script>
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


---

### Start contributing to `docmoa`

> Tested NodeJS : v18

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
