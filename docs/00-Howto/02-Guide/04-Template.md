---

meta:
  - name: description
    content: 문서 기본 템플릿
tags: ["how", "docmoa"]

---

# Template

docmoa에 문서 템플릿을 설명합니다.

::: danger 주의
기본 템플릿 가이드를 잘 지켜주세요. 함께 만드는 문서 모음이므로, 기본적인 형식이 필요합니다.
:::

## 최소 Template

```md {1,2,6,7}
---
meta:
  - name: description
    content: description은 여러개를 넣을 수 있습니다. yaml 형식입니다.
  - name: description2
    content: description은 여러개를 넣을 수 있습니다. yaml 형식입니다.
author : ""
tags: ["linux", "ssh"]
---

# h1 제목 = Title 입니다.
내용은 마크다운 형식으로 작성합니다.

## h2 제목

```

- Frontmatter(서문) : Frontmatter는 `---` 로 구분되는 내용입니다. 자세한 내용은 [공식 가이드](https://vuepress.vuejs.org/guide/frontmatter.html)를 참고하세요. 여기서 주로 사용하는 내용은 다음과 같습니다.
  - title : 생략되면 `h1`으로 지정되는(`#`) 제목이 기본으로 적용됩니다.
  - meta : html 구성시 `meta` 에 추가 기입되는 정보입니다. 검색 엔진에 활용됩니다.
  - author : 작성자를 표기합니다.
  - tags : 해당 문서에 태깅을 지정합니다. 다중으로 적용 가능하며, 적용된 태그의 목록은 [Tags](/98-tags)에서 확인할 수 있습니다.
- `# 제목` : `Frontmatter`에서 `title`을 명시하지 않는 것이 문서 작성에 복잡함을 줄여줄 것으로 예상되어 둘 중에 `h1` 스타일의 제목을 넣는 것을 권장합니다.
