<template><div><h1 id="tfe-재설치-주의사항" tabindex="-1"><a class="header-anchor" href="#tfe-재설치-주의사항" aria-hidden="true">#</a> TFE 재설치 주의사항</h1>
<blockquote>
<p>관련 Knowledge Base Article : <a href="https://support.hashicorp.com/hc/en-us/articles/4409044739859-Container-ptfe-base-startup-failed" target="_blank" rel="noopener noreferrer">https://support.hashicorp.com/hc/en-us/articles/4409044739859-Container-ptfe-base-startup-failed<ExternalLinkIcon/></a></p>
</blockquote>
<p>기존에 설치되어 있는 TFE를 백업받고, 업그레이드 작업을 하는 경우 반드시 enc_password를 저장 후 작업하시기 바랍니다.  그렇지 않은 경우, 아래와 같이 ptfe_base_startup failed 때문에 구성이 불가할 수 있습니다.</p>
<figure><img src="@source/04-HashiCorp/03-Terraform/04-TroubleShooting/images/tfe-reinstall-caution.png" alt="error_console" tabindex="0" loading="lazy"><figcaption>error_console</figcaption></figure>
<p>보통 Automated Install (silent install)을 하는 경우 Application Settings에 지정 후 설치하게 되어 해당 파일에 enc_password 값이 저장됩니다. (<a href="https://www.terraform.io/enterprise/install/automated/automating-the-installer#application-settings" target="_blank" rel="noopener noreferrer">https://www.terraform.io/enterprise/install/automated/automating-the-installer#application-settings<ExternalLinkIcon/></a>)</p>
<p>설치 시 사용한 TF 코드나 수작업을 생성한 settings.json 파일을 잘 보관하셔서 upgrade나 복구 시 이용할 수 있도록 준비하시는 게 나을 듯 합니다.</p>
</div></template>


