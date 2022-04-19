# docmoa

## Contributing [![contributions welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/docmoa/docs)

docmoa (https://docmoa.github.io) 소스페이지 입니다.

## Change Log

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