// Mermaid 아이콘 팩 등록
// 아이콘 팩은 https://icones.js.org 에서 찾을 수 있습니다
// 사용 예: service myService(material:computer)[Computer]
// 
// 참고: https://mermaid.js.org/config/icons.html

// VuePress-theme-hope가 Mermaid를 로드한 후에 아이콘 팩을 등록
if (typeof window !== 'undefined') {
  // 여러 시점에서 시도하여 Mermaid가 로드된 후 확실히 등록
  const initMermaidIcons = () => {
    // window.mermaid 또는 전역 mermaid 객체 확인
    const mermaidInstance = (window as any).mermaid;
    
    if (mermaidInstance && typeof mermaidInstance.registerIconPacks === 'function') {
      try {
        // Material Icons - 하드웨어 관련 아이콘이 풍부함
        // Carbon Icons - IBM 스타일 아이콘 (z/OS와 어울림)
        mermaidInstance.registerIconPacks([
          {
            name: 'material',
            loader: () =>
              fetch('https://unpkg.com/@iconify-json/material-icons@1/icons.json')
                .then((res) => res.json()),
          },
          {
            name: 'carbon',
            loader: () =>
              fetch('https://unpkg.com/@iconify-json/carbon@1/icons.json')
                .then((res) => res.json()),
          },
        ]);
        console.log('Mermaid icon packs registered successfully');
      } catch (error) {
        console.warn('Mermaid icon pack registration failed:', error);
      }
    } else {
      // Mermaid가 아직 로드되지 않았으면 잠시 후 재시도
      setTimeout(initMermaidIcons, 200);
    }
  };
  
  // DOMContentLoaded와 load 이벤트 모두에서 시도
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMermaidIcons);
  } else {
    initMermaidIcons();
  }
  
  window.addEventListener('load', initMermaidIcons);
}

