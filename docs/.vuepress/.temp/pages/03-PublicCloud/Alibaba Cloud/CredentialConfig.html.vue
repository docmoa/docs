<template><div><h1 id="alibaba-cli-설정" tabindex="-1"><a class="header-anchor" href="#alibaba-cli-설정" aria-hidden="true">#</a> Alibaba CLI 설정</h1>
<h2 id="_1-cli-설치" tabindex="-1"><a class="header-anchor" href="#_1-cli-설치" aria-hidden="true">#</a> 1. CLI 설치</h2>
<h3 id="_1-1-download-방식" tabindex="-1"><a class="header-anchor" href="#_1-1-download-방식" aria-hidden="true">#</a> 1.1 Download 방식</h3>
<ul>
<li>Install guide : <a href="https://partners-intl.aliyun.com/help/doc-detail/139508.htm" target="_blank" rel="noopener noreferrer">https://partners-intl.aliyun.com/help/doc-detail/139508.htm<ExternalLinkIcon/></a></li>
<li>Release Download Page : <a href="https://github.com/aliyun/aliyun-cli/releases" target="_blank" rel="noopener noreferrer">https://github.com/aliyun/aliyun-cli/releases<ExternalLinkIcon/></a>
<ul>
<li>CLI 릴리즈 페이지에서 OS에 맞는 파일을 다운로드하여 사용</li>
</ul>
</li>
</ul>
<h3 id="_1-2-mac-brew-설치" tabindex="-1"><a class="header-anchor" href="#_1-2-mac-brew-설치" aria-hidden="true">#</a> 1.2 MAC - brew 설치</h3>
<ul>
<li>Install guide : <a href="https://formulae.brew.sh/formula/aliyun-cli" target="_blank" rel="noopener noreferrer">https://formulae.brew.sh/formula/aliyun-cli<ExternalLinkIcon/></a><div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>brew <span class="token function">install</span> aliyun-cli
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
<h2 id="_2-구성-설정" tabindex="-1"><a class="header-anchor" href="#_2-구성-설정" aria-hidden="true">#</a> 2. 구성 설정</h2>
<p>인증 메커니즘이 4가지이며 구성 설정시 <code v-pre>--mode</code> 에 Credential type을 넣어서 구성하게 됨</p>
<table>
<thead>
<tr>
<th style="text-align:left">Credential type</th>
<th style="text-align:left">Limit</th>
<th style="text-align:left">Interactive credential configuration (fast)</th>
<th style="text-align:left">Non-interactive credential configuration</th>
</tr>
</thead>
<tbody>
<tr>
<td style="text-align:left">AK</td>
<td style="text-align:left">Use an AccessKey ID and an AccessKey secret to authorize access.</td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-5pj-p7j-06z" target="_blank" rel="noopener noreferrer">Configure AccessKey credential<ExternalLinkIcon/></a></td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-hhx-jpx-95g" target="_blank" rel="noopener noreferrer">Configure AccessKey credential<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td style="text-align:left">StsToken</td>
<td style="text-align:left">Use a Security Token Service (STS) token to authorize access.</td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-bdk-377-tnm" target="_blank" rel="noopener noreferrer">Configure STS token credential<ExternalLinkIcon/></a></td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-mek-l1j-xib" target="_blank" rel="noopener noreferrer">Configure STS token credential<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td style="text-align:left">RamRoleArn</td>
<td style="text-align:left">Use the role of a Resource Access Management (RAM) user to authorize access.</td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-h4x-fnh-5yj" target="_blank" rel="noopener noreferrer">Configure RamRoleArn credential<ExternalLinkIcon/></a></td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-uyo-8pk-uow" target="_blank" rel="noopener noreferrer">Configure RamRoleArn credential<ExternalLinkIcon/></a></td>
</tr>
<tr>
<td style="text-align:left">EcsRamRole</td>
<td style="text-align:left">Use the RAM role of an Elastic Compute Service (ECS) instance to authorize password-free access.</td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-pq4-04b-7an" target="_blank" rel="noopener noreferrer">Configure EcsRamRole credential<ExternalLinkIcon/></a></td>
<td style="text-align:left"><a href="https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-874-dbh-9k0" target="_blank" rel="noopener noreferrer">Configure EcsRamRole credential<ExternalLinkIcon/></a></td>
</tr>
</tbody>
</table>
<h3 id="_2-1-ak-생성" tabindex="-1"><a class="header-anchor" href="#_2-1-ak-생성" aria-hidden="true">#</a> 2.1 AK 생성</h3>
<p>AccessKey 방식의 인증 정보가 없는 경우 아래와 같이 생성</p>
<ul>
<li>Alibaba Cloud 홈페이지의 우측 상단(변경될 수 있음) 클릭하여 <code v-pre>Accesskey Management</code> 클릭</li>
<li><code v-pre>AccessKey Pair</code> 항목에서 <code v-pre>Create AccessKey Pair</code> 를 클릭하여 AK(AccessKey)를 신규로 생성</li>
</ul>
<h3 id="_2-2-cli-구성" tabindex="-1"><a class="header-anchor" href="#_2-2-cli-구성" aria-hidden="true">#</a> 2.2 CLI 구성</h3>
<p>aliyun cli의 <code v-pre>configure</code> 를 실행</p>
<ul>
<li><code v-pre>--mode</code> 에는 Credential Type을 지정</li>
<li><code v-pre>--profile</code> 에는 사용할 이름을 사용자가 지정, <code v-pre>default</code>는 기본 값</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ aliyun configure <span class="token parameter variable">--mode</span> AK <span class="token parameter variable">--profile</span> myprofile
Configuring profile <span class="token string">'myprofile'</span> <span class="token keyword">in</span> <span class="token string">'AK'</span> authenticate mode<span class="token punctuation">..</span>.
Access Key Id <span class="token punctuation">[</span><span class="token punctuation">]</span>: LTAI5**********************t88V
Access Key Secret <span class="token punctuation">[</span><span class="token punctuation">]</span>: *******************************
Default Region Id <span class="token punctuation">[</span><span class="token punctuation">]</span>: ap-southeast-1
Default Output Format <span class="token punctuation">[</span>json<span class="token punctuation">]</span>: json <span class="token punctuation">(</span>Only support json<span class="token punctuation">)</span>
Default Language <span class="token punctuation">[</span>zh<span class="token operator">|</span>en<span class="token punctuation">]</span> en: en
Saving profile<span class="token punctuation">[</span>gslee<span class="token punctuation">]</span> <span class="token punctuation">..</span>.Done.

Configure Done<span class="token operator">!</span><span class="token operator">!</span><span class="token operator">!</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token number">888888888888888888888</span> <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token operator">=</span>8888888888888888888D<span class="token operator">=</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.88888888888888888888888 <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>D8888888888888888888888I<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.,8888888888888ZI: <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.<span class="token operator">=</span>Z88D8888888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.+88888888 <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>88888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.+88888888 <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.Welcome to use Alibaba Cloud<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.O8888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.+88888888 <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>. ************* <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>O8888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.+88888888 <span class="token punctuation">..</span><span class="token punctuation">..</span> Command Line Interface<span class="token punctuation">(</span>Reloaded<span class="token punctuation">)</span> <span class="token punctuation">..</span><span class="token punctuation">..</span>O8888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.+88888888<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.88888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>D888888888888DO+. <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>?ND888888888888D<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.O8888888888888888888888<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.D8888888888888888888888<span class="token operator">=</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.
<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span> .:D8888888888888888888<span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>.78888888888888888888O <span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span><span class="token punctuation">..</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>구성 완료 후 home 디렉토리의 <code v-pre>.aliyun</code> 디렉토리 내의 <code v-pre>config.json</code>에서 구성된 정보를 확인 가능</p>
<div class="language-json line-numbers-mode" data-ext="json"><pre v-pre class="language-json"><code><span class="token punctuation">{</span>
    <span class="token property">"current"</span><span class="token operator">:</span> <span class="token string">"myprofile"</span><span class="token punctuation">,</span>
    <span class="token property">"profiles"</span><span class="token operator">:</span> <span class="token punctuation">[</span>
        <span class="token punctuation">{</span>
            <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"default"</span><span class="token punctuation">,</span>
            ...
        <span class="token punctuation">}</span><span class="token punctuation">,</span>
        <span class="token punctuation">{</span>
            <span class="token property">"name"</span><span class="token operator">:</span> <span class="token string">"gslee"</span><span class="token punctuation">,</span>
            <span class="token property">"mode"</span><span class="token operator">:</span> <span class="token string">"AK"</span><span class="token punctuation">,</span>
            <span class="token property">"access_key_id"</span><span class="token operator">:</span> <span class="token string">"LTAI5**********************t88V"</span><span class="token punctuation">,</span>
            ...
            <span class="token property">"region_id"</span><span class="token operator">:</span> <span class="token string">"ap-southeast-1"</span><span class="token punctuation">,</span>
            <span class="token property">"output_format"</span><span class="token operator">:</span> <span class="token string">"json"</span><span class="token punctuation">,</span>
            <span class="token property">"language"</span><span class="token operator">:</span> <span class="token string">"en"</span><span class="token punctuation">,</span>
            ...
        <span class="token punctuation">}</span>
    <span class="token punctuation">]</span><span class="token punctuation">,</span>
    <span class="token property">"meta_path"</span><span class="token operator">:</span> <span class="token string">""</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-cli-사용-예제" tabindex="-1"><a class="header-anchor" href="#_2-3-cli-사용-예제" aria-hidden="true">#</a> 2.3 CLI 사용 예제</h3>
<p>Region 목록 확인</p>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>(profile이 <code v-pre>default</code>인 경우 <code v-pre>--profile or -p</code> 생략 가능</p>
</div>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ aliyun <span class="token parameter variable">-p</span> myprofile ecs DescribeRegions 
<span class="token punctuation">{</span>
        <span class="token string">"Regions"</span><span class="token builtin class-name">:</span> <span class="token punctuation">{</span>
                <span class="token string">"Region"</span><span class="token builtin class-name">:</span> <span class="token punctuation">[</span>
                        <span class="token punctuation">{</span>
                                <span class="token string">"LocalName"</span><span class="token builtin class-name">:</span> <span class="token string">"华北1（青岛）"</span>,
                                <span class="token string">"RegionEndpoint"</span><span class="token builtin class-name">:</span> <span class="token string">"ecs.aliyuncs.com"</span>,
                                <span class="token string">"RegionId"</span><span class="token builtin class-name">:</span> <span class="token string">"cn-qingdao"</span>
                        <span class="token punctuation">}</span>,
                        <span class="token punctuation">{</span>
                                <span class="token string">"LocalName"</span><span class="token builtin class-name">:</span> <span class="token string">"华北2（北京）"</span>,
                                <span class="token string">"RegionEndpoint"</span><span class="token builtin class-name">:</span> <span class="token string">"ecs.aliyuncs.com"</span>,
                                <span class="token string">"RegionId"</span><span class="token builtin class-name">:</span> <span class="token string">"cn-beijing"</span>
                        <span class="token punctuation">}</span>,
                        <span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.
                <span class="token punctuation">]</span>
        <span class="token punctuation">}</span>,
        <span class="token string">"RequestId"</span><span class="token builtin class-name">:</span> <span class="token string">"2304DF19-CABF-54DF-BDC6-F889C3A73E4F"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


