<template><div><h1 id="vault-secrets-operator-설치" tabindex="-1"><a class="header-anchor" href="#vault-secrets-operator-설치" aria-hidden="true">#</a> Vault Secrets Operator 설치</h1>
<blockquote>
<p>참고:<br>
현재 Vault 비밀 오퍼레이터는 공개 베타 버전입니다. *<a href="https://github.com/hashicorp/vault-secrets-operator/issues" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>*에서 GitHub 이슈를 개설하여 피드백을 제공해 주세요.</p>
</blockquote>
<h2 id="사전-요구사항" tabindex="-1"><a class="header-anchor" href="#사전-요구사항" aria-hidden="true">#</a> 사전 요구사항</h2>
<ul>
<li>Kubernetes 1.22+</li>
<li>Vault OSS/Enterprise 1.11+</li>
</ul>
<h2 id="helm을-활용한-설치" tabindex="-1"><a class="header-anchor" href="#helm을-활용한-설치" aria-hidden="true">#</a> Helm을 활용한 설치</h2>
<p><a href="https://developer.hashicorp.com/vault/docs/platform/k8s/vso/helm" target="_blank" rel="noopener noreferrer">Vault Secrets Operator Helm chart<ExternalLinkIcon/></a>는 Vault Secrets Operator(이하, VSO)를 설치하고 구성하는 권고 방안이다.</p>
<p>VSO의 새 인스턴스를 설치하려면 먼저 HashiCorp Helm Repo를 추가하고 Chart에 액세스할 수 있는지 확인한다:</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token variable">$helm</span> repo <span class="token function">add</span> hashicorp https://helm.releases.hashicorp.com
<span class="token string">"hashicorp"</span> has been added to your repositories

$ helm search repo hashicorp/vault-secrets-operator <span class="token parameter variable">--devel</span>
NAME            CHART VERSION   APP VERSION DESCRIPTION
hashicorp/vault-secrets-operator    <span class="token number">0.1</span>.0-beta          <span class="token number">0.1</span>.0-beta      Official HashiCorp Vault Secrets Operator Chart
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>그런다음 Operator를 설치한다:</p>
<div class="language-shell-session line-numbers-mode" data-ext="shell-session"><pre v-pre class="language-shell-session"><code><span class="token command"><span class="token shell-symbol important">$</span> <span class="token bash language-bash">helm <span class="token function">install</span> --create-namespace <span class="token parameter variable">--namespace</span> vault-secrets-operator vault-secrets-operator hashicorp/vault-secrets-operator <span class="token parameter variable">--version</span> <span class="token number">0.1</span>.0-beta</span></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="helm을-사용한-업그레이드" tabindex="-1"><a class="header-anchor" href="#helm을-사용한-업그레이드" aria-hidden="true">#</a> Helm을 사용한 업그레이드</h2>
<p>업그레이드는 기존 설치에서 <code v-pre>helm upgrade</code>로 수행할 수 있다. 설치 또는 업그레이드 전에 항상 <code v-pre>--dry-run</code>으로 헬름을 실행하여 변경 사항을 확인한다.</p>
<h3 id="helm-chart-values" tabindex="-1"><a class="header-anchor" href="#helm-chart-values" aria-hidden="true">#</a> Helm Chart Values</h3>
<p>지원되는 모든 헬름 차트 값은 <a href="https://developer.hashicorp.com/vault/docs/platform/k8s/vso/helm" target="_blank" rel="noopener noreferrer">here<ExternalLinkIcon/></a>에서 확인할 수 있다.</p>
</div></template>


