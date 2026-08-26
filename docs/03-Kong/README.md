---

tag: ["Kong"]
toc:
  levels: 0

---

# Kong

Kong은 API·AI·이벤트·서비스 메시를 아우르는 **API 인프라 플랫폼**입니다.  
온프레미스 Gateway와 클라우드 제어면(Konnect)을 함께 다루며, 플러그인으로 인증·트래픽·보안·관측을 확장합니다.

공식 개발자 문서: [developer.konghq.com](https://developer.konghq.com/)

## Recent pages

<script>
import { defineComponent } from 'vue'
import { usePages } from '@temp/kong'

export default defineComponent({
  setup() {
    const pages = usePages()
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

## 솔루션 소개

### Kong Gateway
> API 트래픽을 라우팅·보호·관찰하는 데이터 플레인. OSS와 Enterprise를 지원합니다.
- 문서: [Gateway](https://developer.konghq.com/gateway/)
- 주요 개념: Service / Route / Consumer / Plugin, Hybrid(CP+DP), DB-less

### Kong Konnect
> 클라우드 제어면으로 Gateway·서비스·포털·분석을 통합 운영합니다.
- 문서: [Konnect](https://developer.konghq.com/konnect/)
- 주요 개념: Control Plane, Data Plane, Dev Portal, Analytics

### AI Gateway
> LLM·에이전트 트래픽에 대한 프록시, 가드레일, 멀티 프로바이더 라우팅을 제공합니다.
- 문서: [AI Gateway](https://developer.konghq.com/ai/)
- 관련 플러그인: AI Proxy / AI Proxy Advanced, Prompt Guard 등

### Event Gateway
> Kafka 등 이벤트 스트림에 대한 리스너·정책·라우팅을 게이트웨이에서 다룹니다.
- 문서: [Event Gateway](https://developer.konghq.com/event-gateway/)

### Kong Mesh / Service Mesh
> 서비스 간 mTLS·트래픽 정책·관측을 위한 메시 계층입니다.
- 문서: [Mesh](https://developer.konghq.com/mesh/)

### Ingress / Kubernetes
> Kubernetes에서 Kong을 Ingress·Gateway API로 운영합니다.
- 문서: [Kong Ingress Controller](https://developer.konghq.com/kubernetes-ingress-controller/)
- 관련: Gateway Operator, Helm charts

## Developer 페이지 안내

작업을 시작할 때 아래 순서를 권장합니다.

| 목적 | 바로가기 |
|------|----------|
| 제품·개념 전체 | [Developer Hub](https://developer.konghq.com/) |
| 플러그인 카탈로그 | [Plugin Hub](https://developer.konghq.com/plugins/) |
| Admin / Konnect API | [API Reference](https://developer.konghq.com/api/) |
| Gateway 설정·배포 | [Gateway how-to](https://developer.konghq.com/gateway/how-to/) |
| 커스텀 플러그인 (Lua / Go 등) | [Custom plugins](https://developer.konghq.com/custom-plugins/) |
| decK (선언적 설정) | [decK](https://developer.konghq.com/deck/) |

::: tip
Plugin Hub에서 프로토콜(HTTP/TCP 등)·토폴로지(Hybrid, DB-less, Konnect) 지원 여부를 먼저 확인하면, 데모·PoC 구성을 빠르게 좁힐 수 있습니다.
:::

이 섹션의 글은 Gateway·AI·커스텀 플러그인 실습과 운영 메모를 모읍니다. 최신 글은 위 Recent pages에서 확인하세요.
