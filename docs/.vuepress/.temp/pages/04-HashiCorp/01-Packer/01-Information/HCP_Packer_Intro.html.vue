<template><div><h1 id="hcp-packer-소개" tabindex="-1"><a class="header-anchor" href="#hcp-packer-소개" aria-hidden="true">#</a> HCP Packer 소개</h1>
<p>HashiCorp의 제품은 설치형과 더불어 SaaS 모델로도 사용가능한 모델이 제공됩니다. 여기에는 지금까지 Terraform Cloud, HCP Vault, HCP Consul 이 제공되었습니다. HCP는 HashiCorp Cloud Platform의 약자 입니다.</p>
<ul>
<li>HCP : <a href="https://cloud.hashicorp.com/" target="_blank" rel="noopener noreferrer">https://cloud.hashicorp.com/<ExternalLinkIcon/></a></li>
</ul>
<p>여기에 최근 HCP Packer가 공식적으로 GA(General Available)되었습니다. HashiCorp의 솔루션들에 대해서 우선 OSS(Open Source Software)로 떠올려 볼 수 있지만 기업을 위해 기능이 차별화된 설치형 엔터프라이즈와 더불어 클라우드형 서비스도 제공되고 있으며 향후 새로운 솔루션들이 추가될 전망입니다.</p>
<h2 id="packer" tabindex="-1"><a class="header-anchor" href="#packer" aria-hidden="true">#</a> Packer</h2>
<p>Packer는 HashiCorp 에서 Vagrant에 이어 두번째로 릴리즈된 OSS 제품 입니다. 기존에는 표준 이미지(골든 이미지) 생성을 위해 사용자가 OS 설치 이후 접속하여 패키지, 파일, 설정 들을 수행 후 빠져나와 이미지를 생성하였다면, Packer는 미리 정의된 구성파일로 이미지를 생성하고 여러 플랫폼에 동시적으로 생성할 수 있습니다.</p>
<p>Amazone EC2(AMI), AZure VM, GCP GCE(Image)와 같은 주요 클라우드 밴더는 물론 국내 클라우드 밴더인 Naver Cloud Platform을 지원하고, 프라이빗 환경의 OpenStack과 VMware, 컨테이너인 Docker를 지원합니다.</p>
<ul>
<li>Packer Plugins : <a href="https://www.packer.io/plugins" target="_blank" rel="noopener noreferrer">https://www.packer.io/plugins<ExternalLinkIcon/></a></li>
</ul>
<p>플러그인이 다양하게 준비되어 있어 빌드 작업시 스크립트는 당연하고, Ansible 같은 구성관리 코드 툴과도 조합하여 이미지를 생성하는 동작을 코드화하고 자동화 합니다.</p>
<h2 id="hcp-packer" tabindex="-1"><a class="header-anchor" href="#hcp-packer" aria-hidden="true">#</a> HCP Packer</h2>
<p>HCP Packer가 제공하는 기능은 Packer가 생성한 이미지 Metadata에 대한 Registry 기능입니다. 개념적인 이해가 필요한 부분은 Packer로 생성되는 이미지 자체는 해당 플랫폼에 저장되며 HCP Packer는 해당 이미지에 대한 정보를 저장한다는 것으로 기존 Packer OSS와 함께 사용된다는 점입니다.</p>
<figure><img src="https://cloud.hashicorp.com/img/docs/packer/hcp_packer_overview.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="hcp-packer-registry의-활용" tabindex="-1"><a class="header-anchor" href="#hcp-packer-registry의-활용" aria-hidden="true">#</a> HCP Packer Registry의 활용</h2>
<p>이미지 Metadata에 대한 Registry로서의 기능이 서비스로 제공된다는 것이 어떤 문제를 해결하기 위함인지에 대해 이해가 필요합니다.</p>
<p>기업 환경에서 표준 이미지에 대한 관리 및 관련하여 Packer를 이용하면 이미지는 자동화되어 쉽게 발생하지만 작성된 이미지를 활용하는데에 어려움이 발생합니다. 몇가지 예를 들면 다음과 같은 문제점이 있습니다.</p>
<ul>
<li>어떤 이미지가 관리되는 최신의 이미지인지 확인 필요</li>
<li>생성된 이미지가 어떤 시점의 코드로 작성된 것인지</li>
<li>IaC와 연계시 이미지 ID는 사람이 알아보기 어려움</li>
<li>다중 플랫폼, 다중 리전에 이미지를 통합으로 관리해야 함</li>
<li>생성되는 VM 이미지의 생성자와 이용자 모두에게 이미지 관리에 대한 목록관리와 비용 이슈</li>
</ul>
<p>여러 문제를 해결하기 위해 Packer에서 빌드 시 HCP Packer Registry에 Metadata를 동시에 등록하고 이미지의 속성 정보를 확인할 수 있게 되어 관리성을 높이고 외부 도구에서 명확한 이미지 ID를 쉽게 얻는 인터페이스를 제공할 수 있습니다.</p>
<h2 id="iterations-channels" tabindex="-1"><a class="header-anchor" href="#iterations-channels" aria-hidden="true">#</a> Iterations / Channels</h2>
<p>HCP Packer Registry의 주요 개념은 이미지 순환(Iterations)과 이미지 채널(Channels)입니다.</p>
<p>Packer의 빌드마다 <code v-pre>Iterations</code>에 작성된 이미지의 정보가 추가됩니다.</p>
<figure><img src="https://cloud.hashicorp.com/img/docs/packer/iteration_basic_config.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>이렇게 추가된 Iteration 정보는 빌드시마다 기록되어 기존 Packer OSS 대비 이미지 생성에 대한 기록을 확인할 수 있습니다.</p>
<figure><img src="https://cloud.hashicorp.com/img/docs/packer/multiple_iteration_example.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p>각 Iteration 항목을 클릭하면 빌드의 세부적보를 확인 할 수 있고 아래 이미지에서는 AWS와 Azure에 대한 각 멀티 클라우드, 멀티 리전에 대한 생성 정보를 확인 할 수 있습니다.</p>
<figure><img src="https://cloud.hashicorp.com/img/docs/packer/multi_cloud_bucket.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<p><code v-pre>Channels</code>는 특정 Channel에 대해 기존 작성된 Iteration을 할당할 수 있는 객체 입니다. Channel을 통해 Terraform을 포함한 외부 툴은 Iteration의 버전을 신경쓰지 않고 원하는 Channel의 이름만 알고 있으면 항상 유효한 이미지 정보를 취득할 수 있습니다. 아래 이미지에서는 Channel을 사용자가 알기 쉬운 이름으로 구성하고 작성된 Iteration 의 버전을 맵핑하는 것을 확인 할 수 있습니다.</p>
<figure><img src="https://cloud.hashicorp.com/img/docs/packer/create_new_channel_box.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="hcp-packer-template" tabindex="-1"><a class="header-anchor" href="#hcp-packer-template" aria-hidden="true">#</a> HCP Packer Template</h2>
<p>HCP Packer에 이미지 Metadata를 등록하는 방법은 기존 Packer로 작성된 선언의 <code v-pre>build</code> 블록에 <code v-pre>hip_packer_registry</code> 속성을 정의하는 것입니다. 관련 수행을 위한 안내는 learn.hashicorp.com의 내용을 확인할 수 있습니다.</p>
<ul>
<li>Packer Get Started : <a href="https://learn.hashicorp.com/collections/packer/hcp-get-started" target="_blank" rel="noopener noreferrer">https://learn.hashicorp.com/collections/packer/hcp-get-started<ExternalLinkIcon/></a></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">build</span> <span class="token punctuation">{</span>
  <span class="token keyword">hcp_packer_registry</span> <span class="token punctuation">{</span>
    <span class="token property">bucket_name</span> <span class="token punctuation">=</span> <span class="token string">"learn-packer-ubuntu"</span>
    <span class="token property">description</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOT
Some nice description about the image being published to HCP Packer Registry.
    EOT</span>
    <span class="token property">bucket_labels</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token property">"owner"</span>          <span class="token punctuation">=</span> <span class="token string">"platform-team"</span>
      <span class="token property">"os"</span>             <span class="token punctuation">=</span> <span class="token string">"Ubuntu"</span>,
      <span class="token property">"ubuntu-version"</span> <span class="token punctuation">=</span> <span class="token string">"Focal 20.04"</span>,
    <span class="token punctuation">}</span>

    <span class="token property">build_labels</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
      <span class="token punctuation">{</span><span class="token comment">/* "build-time"   = timestamp()
      "build-source" = basename(path.cwd) */</span><span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
  <span class="token property">sources</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
    <span class="token string">"source.amazon-ebs.basic-example-east"</span>,
    <span class="token string">"source.amazon-ebs.basic-example-west"</span>
  <span class="token punctuation">]</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>현재 모든 Packer Plugin이 HCP Packer를 지원하는 것은 아니므로 Plugin 페이지에서 <code v-pre>HCP Packer Ready</code> 표시가 되어있는지 확인이 필요합니다. 예를들어 Docker Plugin의 페이지를 확인해보면 지원되고 있는 표시를 확인 할 수 있습니다.</p>
<figure><img src="https://storage.googleapis.com/zenn-user-upload/ef7706869a8f-20220319.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<ul>
<li>Packer - Docker Plugin : <a href="https://www.packer.io/plugins/builders/docker" target="_blank" rel="noopener noreferrer">https://www.packer.io/plugins/builders/docker<ExternalLinkIcon/></a></li>
</ul>
<h2 id="기업의-governance-policy를-준수" tabindex="-1"><a class="header-anchor" href="#기업의-governance-policy를-준수" aria-hidden="true">#</a> 기업의 Governance/Policy를 준수</h2>
<p>기업내에서는 이미지에 대한 보안 규정 준수를 위해 Image의 revoke(취소)를 지원합니다. revoke된 Iteration은 관리자에 의해 완전 삭제되지 않는다면 복구하는 것도 가능합니다. 예를 들어 작성된 이미지이용을 중단하고 싶은 경우 <code v-pre>Revoke Immediately</code> 요청과 관련 설명을 추가할 수 있습니다.</p>
<figure><img src="https://storage.googleapis.com/zenn-user-upload/de0b443f013f-20220319.png" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure>
<h2 id="terraform-연계" tabindex="-1"><a class="header-anchor" href="#terraform-연계" aria-hidden="true">#</a> Terraform 연계</h2>
<p>HCP Packer의 정보는 외부 솔루션에서도 활용 가능합니다. Terraform과의 워크플로우에서 사용시에도 <code v-pre>hcp</code> 프로바이더가 추가되어 저장된 정보를 데이터 소스로 활용 가능합니다.</p>
<ul>
<li>HCP Packer image data source : <a href="https://registry.terraform.io/providers/hashicorp/hcp/latest/docs/data-sources/packer_image" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/hashicorp/hcp/latest/docs/data-sources/packer_image<ExternalLinkIcon/></a></li>
<li>HCP Packer iteration data source : <a href="https://registry.terraform.io/providers/hashicorp/hcp/latest/docs/data-sources/packer_iteration" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/hashicorp/hcp/latest/docs/data-sources/packer_iteration<ExternalLinkIcon/></a></li>
</ul>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># This assumes HCP_CLIENT_ID and HCP_CLIENT_SECRET env variables are set</span>
<span class="token keyword">provider<span class="token type variable"> "hcp" </span></span><span class="token punctuation">{</span> <span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"hcp_packer_iteration"</span></span> <span class="token string">"ubuntu"</span> <span class="token punctuation">{</span>
  <span class="token property">bucket_name</span> <span class="token punctuation">=</span> <span class="token string">"learn-packer-ubuntu"</span>
  <span class="token property">channel</span>     <span class="token punctuation">=</span> <span class="token string">"development"</span>
<span class="token punctuation">}</span>

<span class="token keyword">data <span class="token type variable">"hcp_packer_image"</span></span> <span class="token string">"ubuntu_us_west_1"</span> <span class="token punctuation">{</span>
  <span class="token property">bucket_name</span>    <span class="token punctuation">=</span> <span class="token string">"learn-packer-ubuntu"</span>
  <span class="token property">cloud_provider</span> <span class="token punctuation">=</span> <span class="token string">"aws"</span>
  <span class="token property">iteration_id</span>   <span class="token punctuation">=</span> data.hcp_packer_iteration.ubuntu.ulid
  <span class="token property">region</span>         <span class="token punctuation">=</span> <span class="token string">"us-west-1"</span>
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "ubuntu_iteration" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> data.hcp_packer_iteration.ubuntu
<span class="token punctuation">}</span>

<span class="token keyword">output<span class="token type variable"> "ubuntu_us_west_1" </span></span><span class="token punctuation">{</span>
  <span class="token property">value</span> <span class="token punctuation">=</span> data.hcp_packer_image.ubuntu_us_west_1
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="terraform-cloud-run-task" tabindex="-1"><a class="header-anchor" href="#terraform-cloud-run-task" aria-hidden="true">#</a> Terraform Cloud Run Task</h2>
<p>Terraform Cloud Business를 사용하는 경우 HCP Packer에서 제공하는 <code v-pre>Terraform Cloud Run Tasks</code>기능과 통합시킬 수 있습니다. Terraform Apply시 HCP Packer에서 제공하는 Run Tasks 정책이 적용되면 Plan과 Apply 단계 중간에 명확한 이미지에 대한 확인 및 오류 메시지를 발견할 수 있습니다.</p>
<ul>
<li>Terraform Cloud Run Tasks : <a href="https://cloud.hashicorp.com/docs/packer/manage-image-use/terraform-cloud-run-tasks" target="_blank" rel="noopener noreferrer">https://cloud.hashicorp.com/docs/packer/manage-image-use/terraform-cloud-run-tasks<ExternalLinkIcon/></a></li>
</ul>
<p>또한 이미지사 사용되는 AWS, Azure, GCP의 리소스에서 하드코딩되는 이미지 ID를 검색하거나 사용하지 못하게 경고 또는 실패하는 동작을 수행 할 수 있습니다.</p>
<ul>
<li>지원되는 리소스 목록 : <a href="https://cloud.hashicorp.com/docs/packer/manage-image-use/terraform-cloud-run-tasks#supported-resources" target="_blank" rel="noopener noreferrer">https://cloud.hashicorp.com/docs/packer/manage-image-use/terraform-cloud-run-tasks#supported-resources<ExternalLinkIcon/></a></li>
</ul>
<h2 id="사용-요금" tabindex="-1"><a class="header-anchor" href="#사용-요금" aria-hidden="true">#</a> 사용 요금</h2>
<p>무료 플랜이 제공되며 최대 10개의 이미지와 월 250건의 API 요청을 지원합니다. Standard 플랜 부터는 이미지 제한은 없고 시간 당 추적되는 이미지 총 개수와 요청 건에 대해 부과 되며 기술지원이 포함됩니다.</p>
<ul>
<li>Pricing : <a href="https://cloud.hashicorp.com/products/packer/pricing" target="_blank" rel="noopener noreferrer">https://cloud.hashicorp.com/products/packer/pricing<ExternalLinkIcon/></a></li>
</ul>
</div></template>


