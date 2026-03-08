# docmoa

## Contributing [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/docmoa/docs)

docmoa (https://docmoa.github.io) 소스페이지 입니다.

## Change Log

### 2026-03-08
- vuepress 2.0.0-rc.26, vuepress-theme-hope 2.0.0-rc.103, @vuepress 플러그인 rc.124, Node >=20.6.0
- 홈 최근글 링크: 경로 표시 시 URL 디코딩(%20 등) 적용
- 홈 features: Kubernetes 아이콘(brands:kubernetes), details 문구 보강, Etc. details 추가

### 2025-12-29
- 네비/아이콘 개선 (메뉴 구조·아이콘)

### 2025-12-28
- footnote 활성화 (테마/마크다운 설정)

### 2025-12-10
- markdown/math 옵션 (테마 설정)

### 2025-12-06
- package upgrade

### 2025-11-22
- build 메모리 설정 (NODE_OPTIONS)

### 2025-07-11
- vuepress upgrade
  - 2.0.0-rc.24
- vuepress-theme-hope upgrade
  - 2.0.0-rc.94
- vuepress-plugin-use-pages upgrade
  - 1.0.5
- vuepress-plugin-slimsearch 추가
- vuepress-plugin-md-enhance 추가
- vuepress-plugin-search-pro 제거
- vuepress-plugin-search 제거
- vuepress-plugin-search-pro 제거
- vuepress-plugin-search-pro 제거
- vuepress-plugin-chartjs 추가

### 2024-06-27
- Node.js require version > 20.5.x
- vuepress upgrade
  - 2.0.0-rc.14
- vuepress-theme-hope upgrade
  - 2.0.0-rc.50

### 2024-02-15
- vuepress upgrade
  - 2.0.0-rc.7
- vuepress-theme-hope
  - 2.0.0-rc.23

### 2023-09-18
- vuepress upgrade
  - 2.0.0-beta.67
- vuepress-theme-hope
  - 2.0.0-beta.237

### 2022-11-03
- `package.json` package update
  - "vue": "^2.7.13"
  - "vue-server-renderer": "^2.7.13
  - "vuepress": "^1.9.7"

### 2022-09-24
- `vuepress-plugin-chart` 추가
- Chart 가이드 추가

### 2021-12-30
- Overview page(README) 항목에 각 카테고리별 최신글 표기
- RecentArticlesContents.vue 에서 vue created에서 `window` 참조를 빌드시 가져오지 못하는 현상
  - 로그 : ReferenceError: window is not defined
  - 해결 : created()를 mounted()로 변경

### 2021-12-24
- Main page 최신 등록 글에서 How to 제외
- Main page 최신 등록 글에서 Software 추가

### 2021-12-23
- Bug fix
  - 첫 페이지의 최신 글 보기 정렬 내림차순으로 변경
- Category
  - Software 항목 추가
    - Jenkins
    - Tomcat

### 2021-09-26
- Bug fix
  - Sidebar
    - 한글, 특수문자, 공백 등의 URI 변환을 위해 sidebar생성시 `encodeURI` 적용
- Package
  - Vuepress algolia 패키지 제거