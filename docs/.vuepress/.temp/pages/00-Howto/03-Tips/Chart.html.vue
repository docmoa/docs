<template><div><h1 id="chart" tabindex="-1"><a class="header-anchor" href="#chart" aria-hidden="true">#</a> Chart</h1>
<p>문서 작성시 차트를 추가하는 방법을 안내합니다.</p>
<ul>
<li><a href="https://theme-hope.vuejs.press/guide/markdown/chart.html" target="_blank" rel="noopener noreferrer">공식 문서<ExternalLinkIcon/></a></li>
</ul>
<p>차트 구성 방식은 <a href="https://www.chartjs.org/docs/latest/" target="_blank" rel="noopener noreferrer">ChartJS<ExternalLinkIcon/></a>를 따릅니다.</p>
<h2 id="기본-사용법-bar" tabindex="-1"><a class="header-anchor" href="#기본-사용법-bar" aria-hidden="true">#</a> 기본 사용법 - Bar</h2>
<ChartJS id="chart-19" config="eJx9UstOwzAQvPcrLAspVESoTkihcOIhOCEQFwSoBycxIaplV44Dqqr8O7uO2ya04ZJ4d2Znd6RZjwihdrUU9JLQlBsaYiPnlkMDQagkT4WsoP6gLyKnIaFPhqtC4OtNSKl/8PVghFD4uJG1g55rs5SCzlHRa1bCOp1WeCONqx9X5L40lSV3Lc3dsZ3DGRaFhM1CEockCQkUsVcGTsqzRWF0rfJbLbVBuocANEXKj6MEhmYwzmIYnZxG4+2GHoUlwJme/UeJJvC5mA5QzlFk5m4dWpSAPJsCGsVAPkhhCdhkE+TgSsfxlI5rbXJhDjvuGf6r37N6GPQm98CuvT2wa2wP7FkadPNa5vYL3DDXbubwa1wk9dKWWmF6fCqrjEuxq6Gz6hSY6jJbdPF2iyhKdW3fhdEAWVOL3ZkAg6bEMGEkP2uV4c7jbw6JHq+JEbY2igRHATkhrgn/YBFckWZjx187uMxjTesOzY2a0S+eGcjH" title="A%20bar%20chart" type="json"></ChartJS><details class="hint-container details"><summary>CODE</summary>
<div class="language-markdown line-numbers-mode" data-ext="md"><pre v-pre class="language-markdown"><code>::: chart A bar chart

<span class="token code"><span class="token punctuation">```</span><span class="token code-language">json</span>
<span class="token code-block language-json">{
  "type": "bar",
  "data": {
    "labels": ["Red", "Orange", "Yellow", "Green", "Blue", "Purple"],
    "datasets": [{
      "label": "My First Dataset",
      "data": [12, 19, 3, 5, 2, 3],
      "backgroundColor": [
        "rgba(255, 99, 132, 0.2)",
        "rgba(255, 159, 64, 0.2)",
        "rgba(255, 205, 86, 0.2)",
        "rgba(75, 192, 192, 0.2)",
        "rgba(54, 162, 235, 0.2)",
        "rgba(153, 102, 255, 0.2)"
      ],
      "borderColor": [
        "rgb(255, 99, 132)",
        "rgb(255, 159, 64)",
        "rgb(255, 205, 86)",
        "rgb(75, 192, 192)",
        "rgb(54, 162, 235)",
        "rgb(153, 102, 255)"
      ],
      "borderWidth": 1
    }]
  },
  "options": {
    "scales": {
      "y": {
        "ticks": {
          "beginAtZero": true,
          "callback": "function(value){ return '$' + value + 'k'; }"
        },
        "beginAtZero": true
      }
    }
  }
}</span>
<span class="token punctuation">```</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></details>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>:::

## 기본 사용법 - Bubble

::: chart A Bubble Chart

```json
{
  "type": "bubble",
  "data": {
    "datasets": [
      {
        "label": "First Dataset",
        "data": [
          { "x": 20, "y": 30, "r": 15 },
          { "x": 40, "y": 10, "r": 10 }
        ],
        "backgroundColor": "rgb(255, 99, 132)"
      }
    ]
  }
}
```

:::

::: details CODE
~~~md
::: chart A Bubble Chart

```json
{
  "type": "bubble",
  "data": {
    "datasets": [
      {
        "label": "First Dataset",
        "data": [
          { "x": 20, "y": 30, "r": 15 },
          { "x": 40, "y": 10, "r": 10 }
        ],
        "backgroundColor": "rgb(255, 99, 132)"
      }
    ]
  }
}
```

:::
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>:::</p>
</div></template>


