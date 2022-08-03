---
home: true
actionText: Getting Start →
actionLink: /00-Howto/
# features:
#   - title: Infrastructure
#     details: Linux / (대기중)
#   - title: Private Platform
#     details: (대기중)
#   - title: Public Cloud
#     details: Alibaba / (대기중)
#   - title: HashiCorp
#     details: Packer / Vagrant / Terraform / Consul / Boundary / Vault / Nomad / Waypoint
#   - title: 기타
#     details: (대기중)
#   - title: How to
#     details: 활용 방법 안내
footer: CC BY-NC-ND 4.0 Licensed | ⓒ 2021-present docmoa™ contributers all rights reserved.
rightAnchor:
  disableGlobalUI: true
---

<RecentArticlesHome/>

---

### Start contributing to `docmoa`

> Tested NodeJS : v12, v14

<code-group>
<code-block title="NPM">
```bash {2,5-6,9}
# git clone
git clone https://github.com/docmoa/docs.git
# npm install
cd docs
npm install
# start VuePress writing
npm run dev
```
</code-block>

<code-block title="YARN">
```bash {2,5-6,9}
# git clone
git clone https://github.com/docmoa/docs.git
# npm install
cd docs
yarn install
# start VuePress writing
yarn vuepress dev
```
</code-block>
</code-group>
