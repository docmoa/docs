<template><div><h1 id="consul-공통-설정" tabindex="-1"><a class="header-anchor" href="#consul-공통-설정" aria-hidden="true">#</a> Consul 공통 설정</h1>
<div class="hint-container tip">
<p class="hint-container-title">팁</p>
<p>최대한 설정값을 넣어보고, 번역기도 돌려보고 물어도 보고 넣은 server, client의 공통설정 파일입니다.<br>
저는 agent.hcl파일안에 다 넣고 실행하지만 나눠서 추후에는 기능별로 나눠서 사용할 예정입니다.</p>
</div>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>#node name에는 _금지
#node_name
 
client_addr = "0.0.0.0"
bind_addr = "{{ GetInterfaceIP `ens192` }}"
advertise_addr = "{{ GetInterfaceIP `ens224` }}"
 
#ipv4, ipv6를 나눠서 설정할 수 있음.
#advertise_addr_ipv4
#advertise_addr_ipv6
 
ports {
  #http = 8500
  http = -1
  dns = 8600
  #https = -1
  https = 8500
  serf_lan = 8301
  grpc = 8502
  server = 8300
}
 
#gossip ip 지정
#serf_lan
#gossip 대역대 지정
#serf_lan_allowed_cidrs
 
#사용자 감사, 사용자가 consul에서 사용한 행동을 기록
#audit {
#  enabled = true
#  sink "My sink" {
#    type   = "file"
#    format = "json"
#    path   = "data/audit/audit.json"
#    #consul의 감사작성방법 규칙, 현재는 best-effort만지원
#    delivery_guarantee = "best-effort"
#    rotate_duration = "24h"
#    rotate_max_files = 15
#    rotate_bytes = 25165824
#  }
#}
 
#consul 서버관리 설정 변경
#autopoilt {
#    #새로운 서버가 클러스터에 추가될 때 죽은 서버 자동제거
#    cleanup_dead_servers = ture
#
#    last_contact_threshold = 200ms
#    #최소 quorm 수 지정
#    min_quorum = ni
#    #클러스터에 서버가 추가될 시 안정상태로 되어야 하는 최소 시간
#    server_stabilization_time = 10s
#}
 
#동시에 처리할 수 있는 인증서 서명 요청 제한
#csr_max_concurrent = 0
#서버가 수락할 인증서 서명 요청(CSR)의 최대 수에 대한 속도 제한을 설정
#csr_max_per_second = 50
#클러스터에서 이전 루트 인증서를 교체할 때 사용
#leaf_cert_ttl = 72h
#CA 키 생성 타입
#private_key_type = ec
#CA 키 생성될 길이
#private_key_bits = 256
 
#서버에서만 client를 join할 수 있게 함
#disable remote exec
 
#enable syslog = true
log_level = "DEBUG"
data_dir = "/var/log/consul/consul"
log_file = "/var/log/consul/consul.log"
log_rotate_duration = "24h"
log_rotate_bytes = 104857600
log_rotate_max_files = 100
 
license_path = "/opt/license/consul.license"
 
acl {
  enabled = true
  default_policy = "allow"
  enable_token_persistence = true
 
  #acl policy ttl, 줄이면 새로고침 빈도 상승, 성능에 영향을 미칠 수 있음
  #policy_ttl = 30s
  #acl role ttl, 줄이면 새로고침 빈도 상승, 성능에 영향을 미칠 수 있음
  #role_ttl = 30s
}
 
connect {
  enabled = true
  #vault 연동 옵션
  #ca_provider
}
 
dns_config {
  allow_stale = true,
  max_stale = "87600h"
}
 
#block_endpoints할성화시 restapi 차단
#http_config {
#    block_endpoints = false
#}
 
#segments
 
rpc {
  enable_streaming = true
}
 
encrypt = "7VY2fVm0p6vJUYNS/oex/mr2e59dy4AaGMefTKtUGi0="
encrypt_verify_incoming = false
encrypt_verify_outgoing = false
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


