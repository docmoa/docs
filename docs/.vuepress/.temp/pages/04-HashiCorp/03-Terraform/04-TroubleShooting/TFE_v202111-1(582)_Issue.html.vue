<template><div><h1 id="tfe-release-v202111-1-582-issue" tabindex="-1"><a class="header-anchor" href="#tfe-release-v202111-1-582-issue" aria-hidden="true">#</a> TFE Release v202111-1 (582) Issue</h1>
<blockquote>
<p>v202111-1 (582) 버전 이상으로 설치, 또는 업그레이드 시 발생하는 이슈</p>
</blockquote>
<h2 id="현상" tabindex="-1"><a class="header-anchor" href="#현상" aria-hidden="true">#</a> 현상</h2>
<figure><img src="@source/04-HashiCorp/03-Terraform/04-TroubleShooting/images/tfe_v202111-1_issue_portal.png" alt="error_console" tabindex="0" loading="lazy"><figcaption>error_console</figcaption></figure>
<table>
<thead>
<tr>
<th>Nginx access Log</th>
</tr>
</thead>
<tbody>
<tr>
<td>2021/12/17 02:58:31 [error] 10#10: *913 connect(0mfailed (111: Connection refused) while connecting to upstream, client: 10.10.10.100, server:tfe.mydomain.com, reguest: &quot;GET / HTTP/1.1&quot;, upstream: &quot;<a href="http://172.11.0.1:9292/" target="_blank" rel="noopener noreferrer">http://172.11.0.1:9292/<ExternalLinkIcon/></a>&quot;, host: &quot;<a href="http://tfe.mydomain.com" target="_blank" rel="noopener noreferrer">tfe.mydomain.com<ExternalLinkIcon/></a>&quot;</td>
</tr>
</tbody>
</table>
<table>
<thead>
<tr>
<th>Ptfe_atlas Log</th>
</tr>
</thead>
<tbody>
<tr>
<td>ExecJS::RuntimeUnavailable: Could not find a JavaScript runtime. see <a href="https://github.com/rails/execjs" target="_blank" rel="noopener noreferrer">https://github.com/rails/execjs<ExternalLinkIcon/></a> for a list fo available runtimes.</td>
</tr>
</tbody>
</table>
<h2 id="v202111-1-582-release" tabindex="-1"><a class="header-anchor" href="#v202111-1-582-release" aria-hidden="true">#</a> v202111-1 (582) Release</h2>
<p>v202111-1 (582) Release를 기점으로 TFE 내 포함된 container 들에 대한 update 가 있었으며, 해당 update 는 Alpine 3.14 를 사용하게 되는데 이는 특정 버전 이상의 'docker' 와 'libsecomp' 를 요구합니다. (docker - 20.10.0 이상 / libsecomp - 2.4.4 이상)</p>
<ul>
<li>TFE Release v202111-1 (582) : <a href="https://www.terraform.io/enterprise/release/v202111-1" target="_blank" rel="noopener noreferrer">https://www.terraform.io/enterprise/release/v202111-1<ExternalLinkIcon/></a></li>
<li>Release Notes for Alpine 3.14.0 : <a href="https://wiki.alpinelinux.org/wiki/Release_Notes_for_Alpine_3.14.0#faccessat2" target="_blank" rel="noopener noreferrer">https://wiki.alpinelinux.org/wiki/Release_Notes_for_Alpine_3.14.0#faccessat2<ExternalLinkIcon/></a></li>
</ul>
</div></template>


