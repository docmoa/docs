<template><div><h2 id="consul-acl-policy-sample" tabindex="-1"><a class="header-anchor" href="#consul-acl-policy-sample" aria-hidden="true">#</a> Consul ACL Policy sample</h2>
<p>Consul ACL을 활성화 할 경우 default를 deny로 할 지 allow를 할 지 정할 수 있다.<br>
deny로 할 경우에는 하나하나 policy로 tokne을 만들어서 사용해야 한다.</p>
<h2 id="consul이-vault의-storage로-되어야-할-경우" tabindex="-1"><a class="header-anchor" href="#consul이-vault의-storage로-되어야-할-경우" aria-hidden="true">#</a> Consul이 Vault의 Storage로 되어야 할 경우</h2>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>key_prefix "vault/" {
  policy = "write"
}
service "vault" {
   policy = "write"
}
agent_prefix "" {
   policy = "read"
}
session_prefix "" {
   policy = "write"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="consul-dns-query가-필요할-경우" tabindex="-1"><a class="header-anchor" href="#consul-dns-query가-필요할-경우" aria-hidden="true">#</a> Consul Dns query가 필요할 경우</h2>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>node_prefix "" {
  policy = "read"
}
service_prefix "" {
  policy = "read"
}
# only needed if using prepared queries
query_prefix "" {
  policy = "read"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="consul-ui-접근권한이-필요할-경우" tabindex="-1"><a class="header-anchor" href="#consul-ui-접근권한이-필요할-경우" aria-hidden="true">#</a> Consul UI 접근권한이 필요할 경우</h2>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>service_prefix "" {
  policy = "read"
}
key_prefix "" {
  policy = "read"
}
node_prefix "" {
  policy = "read"
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


