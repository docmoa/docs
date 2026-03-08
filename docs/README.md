---
home: true
icon: home
title: docmoa
heroImage: /logo.png
heroText: docmoa
tagline: "그림같이 써라.<br>그러면 기억 속에 머물 것이다.<br><small>by 조지프 퓰리처</small>"

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
    details: Linux, Container, z/OS, Quantum
    link: /01-Infrastructure/
    icon: server
  - title: Private Platform
    details: vSphere, Private Cloud
    link: /02-PrivatePlatform/
    icon: building
  - title: Public Cloud
    details: Alibaba Cloud, Naver Cloud
    link: /03-PublicCloud/
    icon: cloud
  - title: HashiCorp
    details: Packer, Vagrant, Terraform, Consul, Boundary, Vault, Nomad, Waypoint
    link: /04-HashiCorp/
    icon: layer-group
  - title: Kubernetes
    details: OpenShift, EKS, Kops, Rancher Desktop
    link: /07-Kubernetes/
    icon: dharmachakra
  - title: Software
    details: MongoDB, Jenkins, Tomcat, Keycloak, Node.js
    link: /05-Software/
    icon: compact-disc
  - title: Etc.
    details: Book Memo, Class, Information, Mac
    link: /06-etc/
    icon: mug-hot
#   - title: How to
#     details: 활용 방법 안내

copyright: false
footer: CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.

---
---

### [최근 등록/수정된 글 🔗](/timeline/)

<script>
import { defineComponent, computed } from 'vue'
import { usePages } from '@temp/root'  // pages.js is default filename

export default defineComponent({
  setup() {
    const pages = usePages();

    // 디버그를 위해 pages의 내용을 콘솔에 출력
    console.log('Pages:', pages);

    const safeDecode = (str) => {
      try {
        return decodeURIComponent(str);
      } catch {
        return str;
      }
    };

    const formatPath = (path) => {
      const parts = path.split('/').filter(part => part); // 빈 문자열 요소 제거
      parts.pop(); // 마지막 부분 (파일명) 제거
      return parts.map(p => safeDecode(p)).join(' > ');
    };

    const filteredPages = computed(() => {
      return pages.filter(page => page.title !== 'docmoa');
    });

    return { filteredPages, formatPath };
  }
});
</script>

<ul>
  <li
    v-for="page in filteredPages"
    :key="page.key"
  >
    <RouterLink :to="page.path">{{ formatPath(page.path) }} > {{ page.title }}</RouterLink> 
    <!-- <span v-if="page.localizedDate">
      [ 최초 작성일 {{ page.localizedDate }} ]
    </span> -->
  </li>
</ul>

---

### Start contributing to `docmoa`

::: important Run info
Minimum tested NodeJS version : `v20.19.x`
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
