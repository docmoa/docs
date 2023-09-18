<template><div><h1 id="the-admin-username-specified-is-not-allowed" tabindex="-1"><a class="header-anchor" href="#the-admin-username-specified-is-not-allowed" aria-hidden="true">#</a> The Admin Username specified is not allowed.</h1>
<table>
<thead>
<tr>
<th>Log</th>
</tr>
</thead>
<tbody>
<tr>
<td>Error : compute.VirtualMachinesClient#CreateOrUpdate: Failure sending request: StatusCode=400 – Original Error: Code=“InvalidParameter” Message=“The Admin Username specified is not allowed.” Target=&quot;adminUsername&quot;</td>
</tr>
</tbody>
</table>
<p>Azure(azurerm) 프로바이더를 사용하여 Virtual Machine을 프로비저닝하는 경우 <code v-pre>OSProfile</code>에서 Admin User Name을 잘못된 조건으로 구성하는 경우 발생 할 수 있음</p>
<h2 id="azure-api-osprofile-adminusername-property" tabindex="-1"><a class="header-anchor" href="#azure-api-osprofile-adminusername-property" aria-hidden="true">#</a> Azure API - OSProfile.AdminUsername Property</h2>
<p><a href="https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.compute.models.osprofile.adminusername?view=azure-dotnet" target="_blank" rel="noopener noreferrer">https://docs.microsoft.com/en-us/dotnet/api/microsoft.azure.management.compute.models.osprofile.adminusername?view=azure-dotnet<ExternalLinkIcon/></a></p>
<p>Azure의 API에서 정의하는 <code v-pre>OSProfile</code> 내의 <code v-pre>AdminUsername</code>은 온라인 문서에서처럼 몇가지 룰이 있다.</p>
<ul>
<li>Windows VM 제약
<ul>
<li><code v-pre>.</code> 으로 끝날 수 없음</li>
<li>20자 제한</li>
</ul>
</li>
<li>Linux VM 제약
<ul>
<li>1~64자</li>
</ul>
</li>
<li>다음의 이름은 AdminUser로 허용되지 않음
<ul>
<li>administrator</li>
<li>adm</li>
<li>admin</li>
<li>admin1</li>
<li>admin2</li>
<li>user</li>
<li>user1</li>
<li>user2</li>
<li>user3</li>
<li>user4</li>
<li>user5</li>
<li>test</li>
<li>test1</li>
<li>test2</li>
<li>test3</li>
<li>1</li>
<li>123</li>
<li>a</li>
<li>actuser</li>
<li>aspnet</li>
<li>backup</li>
<li>console</li>
<li>david</li>
<li>guest</li>
<li>john</li>
<li>owner</li>
<li>root</li>
<li>server</li>
<li>sql</li>
<li>support</li>
<li>support_388945a0</li>
<li>sys</li>
</ul>
</li>
</ul>
<h2 id="terraform-error-code-sample" tabindex="-1"><a class="header-anchor" href="#terraform-error-code-sample" aria-hidden="true">#</a> Terraform Error Code Sample</h2>
<p><a href="https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine" target="_blank" rel="noopener noreferrer">https://registry.terraform.io/providers/hashicorp/azurerm/latest/docs/resources/virtual_machine<ExternalLinkIcon/></a></p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre hcl="" class="language-hcl"><code><span class="token keyword">resource <span class="token type variable">"azurerm_virtual_machine"</span></span> <span class="token string">"main"</span> <span class="token punctuation">{</span>
  <span class="token property">name</span>                  <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span><span class="token keyword">var</span><span class="token punctuation">.</span><span class="token type variable">prefix</span><span class="token punctuation">}</span></span>-vm"</span>
  <span class="token property">location</span>              <span class="token punctuation">=</span> azurerm_resource_group.main.location
  <span class="token property">resource_group_name</span>   <span class="token punctuation">=</span> azurerm_resource_group.main.name
  <span class="token property">network_interface_ids</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>azurerm_network_interface.main.id<span class="token punctuation">]</span>
  <span class="token property">vm_size</span>               <span class="token punctuation">=</span> <span class="token string">"Standard_DS1_v2"</span>

  <span class="token keyword">storage_image_reference</span> <span class="token punctuation">{</span>
    <span class="token property">publisher</span> <span class="token punctuation">=</span> <span class="token string">"Canonical"</span>
    <span class="token property">offer</span>     <span class="token punctuation">=</span> <span class="token string">"UbuntuServer"</span>
    <span class="token property">sku</span>       <span class="token punctuation">=</span> <span class="token string">"16.04-LTS"</span>
    <span class="token property">version</span>   <span class="token punctuation">=</span> <span class="token string">"latest"</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">storage_os_disk</span> <span class="token punctuation">{</span>
    <span class="token property">name</span>              <span class="token punctuation">=</span> <span class="token string">"myosdisk1"</span>
    <span class="token property">caching</span>           <span class="token punctuation">=</span> <span class="token string">"ReadWrite"</span>
    <span class="token property">create_option</span>     <span class="token punctuation">=</span> <span class="token string">"FromImage"</span>
    <span class="token property">managed_disk_type</span> <span class="token punctuation">=</span> <span class="token string">"Standard_LRS"</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">os_profile</span> <span class="token punctuation">{</span>
    <span class="token property">computer_name</span>  <span class="token punctuation">=</span> <span class="token string">"hostname"</span>
    <span class="token property">admin_username</span> <span class="token punctuation">=</span> <span class="token string">"test"</span>
    <span class="token property">admin_password</span> <span class="token punctuation">=</span> <span class="token string">"Password1234!"</span>
  <span class="token punctuation">}</span>
  <span class="token keyword">os_profile_linux_config</span> <span class="token punctuation">{</span>
    <span class="token property">disable_password_authentication</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
  <span class="token punctuation">}</span>
  <span class="token property">tags</span> <span class="token punctuation">=</span> <span class="token punctuation">{</span>
    <span class="token property">environment</span> <span class="token punctuation">=</span> <span class="token string">"staging"</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


