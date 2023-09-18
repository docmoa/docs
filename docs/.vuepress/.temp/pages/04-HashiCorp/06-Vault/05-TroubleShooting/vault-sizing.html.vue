<template><div><h1 id="vault-mariadb5-5-dynamic-secret" tabindex="-1"><a class="header-anchor" href="#vault-mariadb5-5-dynamic-secret" aria-hidden="true">#</a> Vault MariaDB5.5 Dynamic Secret</h1>
<ul>
<li>
<p>현상 : $vault read mysql/creds/my-role 입력시 오류</p>
</li>
<li>
<p>오류 내용 :</p>
</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Error reading mysql/creds/my-role: Error making API request.
URL: GET http://127.0.0.1:8200/v1/mysql/creds/my-role
Code: 500. Errors:

* 1 error occurred:
      * Error 1470: String 'v-root-my-role-87BP93fheiaHKGelc' is too long for user name (should be no longer than 16)
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>원인 : mysql 버전이 오래되어  mysql-database-plugin이 아닌  mysql-legacy-database-plugin 을 사용해야 함.<br>
<a href="https://github.com/hashicorp/vault/issues/4602" target="_blank" rel="noopener noreferrer">https://github.com/hashicorp/vault/issues/4602<ExternalLinkIcon/></a></p>
</li>
<li>
<p>해결방안 : vault에서 database에 접근하기 위한 plugin설정시 아래와 같이 설정을 변경해야 함.</p>
<ul>
<li>기존설정</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> mysql/config/mysql-database <span class="token punctuation">\</span>
    <span class="token assign-left variable">plugin_name</span><span class="token operator">=</span>mysql-database-plugin <span class="token punctuation">\</span>
    <span class="token assign-left variable">connection_url</span><span class="token operator">=</span><span class="token string">"{{username}}:{{password}}@tcp(192.168.56.204:3306)/"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_roles</span><span class="token operator">=</span><span class="token string">"my-role"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">username</span><span class="token operator">=</span><span class="token string">"vault2"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">password</span><span class="token operator">=</span><span class="token string">"vaultpass"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>변경설정</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token function">write</span> mysql/config/mysql-database <span class="token punctuation">\</span>
    <span class="token assign-left variable">plugin_name</span><span class="token operator">=</span>mysql-legacy-database-plugin <span class="token punctuation">\</span>
    <span class="token assign-left variable">connection_url</span><span class="token operator">=</span><span class="token string">"{{username}}:{{password}}@tcp(192.168.56.204:3306)/"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_roles</span><span class="token operator">=</span><span class="token string">"my-role"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">username</span><span class="token operator">=</span><span class="token string">"vault2"</span> <span class="token punctuation">\</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></li>
</ul>
</div></template>


