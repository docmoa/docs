<template><div><h1 id="variables" tabindex="-1"><a class="header-anchor" href="#variables" aria-hidden="true">#</a> Variables</h1>
<p>Terraform은 코드로 인프라를 관리하기위한 그 '코드'의 핵심 요소인 변수처리를 다양하게 지원합니다.</p>
<iframe width="560" height="315" src="https://www.youtube.com/embed/uBr0DGUqUR4" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
<p>Terraform에서는 다양한 변수와 작성된 변수를 관리하기 위한 메커니즘을 제공합니다. 가장 기본이되는 기능 중 하나이며 오픈소스와 엔터프라이즈 모두에서 사용가능합니다.</p>
<hr>
<table>
<thead>
<tr>
<th>유형</th>
<th>지원여부</th>
</tr>
</thead>
<tbody>
<tr>
<td>Terraform OSS (Open Source Software)</td>
<td>✔︎</td>
</tr>
<tr>
<td>Terraform Cloud</td>
<td>✔︎</td>
</tr>
<tr>
<td>Terraform Cloud for Business</td>
<td>✔︎</td>
</tr>
<tr>
<td>Terraform Enterprise</td>
<td>✔︎</td>
</tr>
</tbody>
</table>
<hr>
<p>코드에서 변수를 사용할 수 없다면 매번 다른 값이 필요할 때마다 하드코딩된 코드 한벌씩을 만들어야 할 것입니다. 테라폼을 활용한 인프라 프로비저닝에서도 코드의 특징을 십분 활용 가능하고, 변수도 그 기능 중 하나 입니다.</p>
<p>테라폼 설정 파일을 작성하는 운영자와 개발자는 변수 선언을 통해 때에 따라 적절한 값을 할당하여 재 정의할 수 있습니다.</p>
<h2 id="types" tabindex="-1"><a class="header-anchor" href="#types" aria-hidden="true">#</a> Types</h2>
<p>지원되는 변수의 범주와 형태는 다음과 같습니다.</p>
<ul>
<li>Primitive Types
<ul>
<li>string</li>
<li>number</li>
<li>bool</li>
</ul>
</li>
<li>Collection Types
<ul>
<li>list</li>
<li>map</li>
<li>set</li>
</ul>
</li>
<li>Structural Types
<ul>
<li>object</li>
<li>tuple</li>
</ul>
</li>
</ul>
<p>기본이 되는 형태를 하나 예를 들어보겠습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "name" </span></span><span class="token punctuation">{</span>								<span class="token comment">// 변수 이름</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> string								<span class="token comment">// 변수 타입</span>
    <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"var String"</span>	<span class="token comment">// 변수 설명</span>
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"myString"</span>				<span class="token comment">// 변수 기본 값</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>변수 이름 : <code v-pre>variable &quot;이름&quot;</code>으로 선언 합니다. 일반적인 코드의 <code v-pre>int i</code> 에서의 <code v-pre>i</code> 를 의미합니다. 변수 선언 시 타입과 기본 값 선언 외에도 설정 가능한 값이 많이 있어서 <code v-pre>variable</code>로 선언합니다. 변수에 대한 이름 선언은 다른 위치에서 해당 변수를 사용할 수 있도록 하는 유일한 값입니다. 같은 이름의 변수를 선언하면 오류가 발생하게 됩니다.</li>
<li>type :  해당 변수가 어떤 형태인지 선언해 줍니다. <code v-pre>default</code>에 정의되는 값의 형태를 보고 자동으로 추측해주기도 하지만 변수 값의 명확한 형태를 지정해주는 것이 권장됩니다. 또한 해당 유형에 맞지 않는 값이 입력되는 것을 방지해 줍니다.</li>
<li>description :  이 변수가 무엇을 의미하는지 설명을 기입할 수 있습니다. 지속적으로 관리하고 협업을 위해 도움이 되는 항목입니다.</li>
<li>default : 변수의 기본값을 지정할 수 있습니다. 여기 지정된 값을 보고 <code v-pre>type</code>이 없더라도 추측할 수 있습니다. <code v-pre>default</code>에 설정된 값이 없고 이후 다른 코드 상에도 값이 비어 있으면 terraform이 실행 될 때 값을 물어봅니다.</li>
</ul>
<p>각 형태에 대한 예제는 아래와 같습니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "string" </span></span><span class="token punctuation">{</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> string
    <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"var String"</span>
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"myString"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "number" </span></span><span class="token punctuation">{</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> number
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token string">"123"</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "boolean" </span></span><span class="token punctuation">{</span>
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "list" </span></span><span class="token punctuation">{</span>
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        <span class="token string">"google"</span>,
        <span class="token string">"vmware"</span>,
        <span class="token string">"amazon"</span>,
        <span class="token string">"microsoft"</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "list_index_0" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> var.list.<span class="token number">0</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "list_all" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    for name in var.list :
        upper(name)
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "map" </span></span><span class="token punctuation">{</span>				<span class="token comment"># Sorting</span>
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
        <span class="token property">aws</span> <span class="token punctuation">=</span> <span class="token string">"amazon"</span>,
        <span class="token property">azure</span> <span class="token punctuation">=</span> <span class="token string">"microsoft"</span>,
        <span class="token property">gcp</span> <span class="token punctuation">=</span> <span class="token string">"google"</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "map" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> var.map.aws
<span class="token punctuation">}</span>
  
<span class="token keyword">variable<span class="token type variable"> "set" </span></span><span class="token punctuation">{</span>				<span class="token comment"># Sorting</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> set(string)
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
        <span class="token string">"google"</span>,
        <span class="token string">"vmware"</span>,
        <span class="token string">"amazon"</span>,
        <span class="token string">"microsoft"</span>
    <span class="token punctuation">]</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "set" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> var.set
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "object" </span></span><span class="token punctuation">{</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> object(<span class="token punctuation">{</span><span class="token property">name</span><span class="token punctuation">=</span>string, <span class="token property">age</span><span class="token punctuation">=</span>number<span class="token punctuation">}</span>)
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
        <span class="token property">name</span> <span class="token punctuation">=</span> <span class="token string">"abc"</span>
        <span class="token property">age</span> <span class="token punctuation">=</span> <span class="token number">12</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "tuple" </span></span><span class="token punctuation">{</span>
    <span class="token property">type</span> <span class="token punctuation">=</span> tuple(<span class="token punctuation">[</span>string, number, bool<span class="token punctuation">]</span>)
    <span class="token property">default</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"abc"</span>, <span class="token number">123</span>, <span class="token boolean">true</span><span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="validation" tabindex="-1"><a class="header-anchor" href="#validation" aria-hidden="true">#</a> Validation</h2>
<p>아직은 실험적인 Terraform의 확장 기능이지만, 변수의 유효성 체크가 가능합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">terraform</span> <span class="token punctuation">{</span>
  <span class="token property">experiments</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>variable_validation<span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>Terraform에서 선언되는 변수가 <code v-pre>variable</code>로 되어있던 것은 관련 변수를 확장시키는데 의미가 있습니다. 변수 밖에서 별도의 로직을 답는 것이 아니라 내부에 미리 선언하여 사용 가능합니다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">variable<span class="token type variable"> "myVar" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"for test"</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"myVar"</span>

  <span class="token keyword">validation</span> <span class="token punctuation">{</span>
    <span class="token property">condition</span>     <span class="token punctuation">=</span> length(var.myVar) > <span class="token number">4</span>
    <span class="token property">error_message</span> <span class="token punctuation">=</span> <span class="token string">"The myVar length up to 4."</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">variable<span class="token type variable"> "yourVar" </span></span><span class="token punctuation">{</span>
  <span class="token property">type</span>        <span class="token punctuation">=</span> string
  <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token string">"for test"</span>
  <span class="token property">default</span>     <span class="token punctuation">=</span> <span class="token string">"yourVar"</span>

  <span class="token keyword">validation</span> <span class="token punctuation">{</span>
    <span class="token property">condition</span>     <span class="token punctuation">=</span> can(regex(<span class="token string">"^your"</span>, var.yourVar))
    <span class="token property">error_message</span> <span class="token punctuation">=</span> <span class="token string">"The yourVar must be starting with \"your\"."</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>내부에 <code v-pre>validation</code> 를 추가하고 조건과 에러시의 메시지를 정의합니다. 조건은 true/false로 확인될 수 있는 대부분의 설정이 가능하고 <code v-pre>string</code> 의 경우에는 정규표현식(regex)도 확인 가능합니다.</p>
<h2 id="ordering" tabindex="-1"><a class="header-anchor" href="#ordering" aria-hidden="true">#</a> Ordering</h2>
<p>변수를 선언하는 방식에는 여러가지가 있지만 각각의 우선순위가 있기 때문에 설정에 주의해야 합니다. 아래 순서대로 마지막에 정의된 변수가 위의 설정 값을 엎어씁니다.</p>
<ol>
<li>환경변수 (e.g. TF_VAR_변수이름)</li>
<li>terraform.tfvars</li>
<li>terraform.tfvars.json</li>
<li>*.auto.tfvars / *.auto.tfvars.json</li>
<li>명령 줄 상의 <code v-pre>-var</code> 또는 <code v-pre>-var-file</code></li>
</ol>
<p>예를들어 <code v-pre>myvar</code> 변수가 정의되어있고 시스템의 환경변수로 <code v-pre>TF_VAR_myvar</code>  에 값이 선언되었습니다. 이후에 <code v-pre>terraform.tfvars</code> 에서 <code v-pre>myvar</code>에 값을 선언하면 최종적으로는 <code v-pre>terraform.tfvars</code>의 값이 반영됩니다.</p>
<h2 id="마치며" tabindex="-1"><a class="header-anchor" href="#마치며" aria-hidden="true">#</a> 마치며</h2>
<p>변수에 대한 자유로운 재할당을 통해 기존 인프라에 대한 리소스, 데이터, 모듈을 변경하지 않고 이미 정해진 코드적 인프라를 재활용할 수 있습니다. 코드가 복잡해지고 여러개로 나눠진다 해도 변수에 대한 타입 정의나 조건 확인 같은 기능을 활용하고 변수가 반영 되는 우선순위를 잘 고려한다면 나이스한 IaC가 구현가능합니다.</p>
</div></template>


