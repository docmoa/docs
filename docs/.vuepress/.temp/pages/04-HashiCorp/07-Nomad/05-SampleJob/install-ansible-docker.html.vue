<template><div><h1 id="nomad에서-ansible로-docker-설치와-template-주의사항" tabindex="-1"><a class="header-anchor" href="#nomad에서-ansible로-docker-설치와-template-주의사항" aria-hidden="true">#</a> Nomad에서 Ansible로 Docker 설치와 Template 주의사항</h1>
<blockquote>
<p>참고 : <a href="https://discuss.hashicorp.com/t/escape-characters-recognized-as-a-variable-in-template-stanza/40525" target="_blank" rel="noopener noreferrer">https://discuss.hashicorp.com/t/escape-characters-recognized-as-a-variable-in-template-stanza/40525<ExternalLinkIcon/></a></p>
</blockquote>
<p>Nomad를 통해 Ops작업을 수행할 때 <code v-pre>sysbatch</code> 타입의 Job에 Ansible을 <code v-pre>raw_exec</code>로 실행하면 전체 노드에서 일괄로 작업을 수행할 수 있다.</p>
<p>Ansible에서 사용하는 문법 중 <code v-pre>{{}}</code>의 부호로 팩트를 사용하는 경우 Nomad에서 사용하는 Template의 <code v-pre>{{}}</code>과 겹쳐 오류가 발생한다.</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token property">Template failed:</span> <span class="token operator">(</span>dynamic<span class="token operator">)</span><span class="token operator">:</span> parse<span class="token operator">:</span> template<span class="token operator">:</span> <span class="token operator">:</span><span class="token number">23</span><span class="token operator">:</span> function <span class="token string">"ansible_distribution_release"</span> not defined
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>이경우 Nomad에서 다음과 같이 표기하여 템플릿 문자에 대한 치환이 가능하다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code> <span class="token punctuation">{</span><span class="token punctuation">{</span> --> <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token string">"{{"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
 <span class="token punctuation">}</span><span class="token punctuation">}</span> --> <span class="token punctuation">{</span><span class="token punctuation">{</span> <span class="token string">"}}"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>다음은 Ansible에서 <code v-pre>apt_repository</code> 수행 시 <code v-pre>ansible_architecture</code>와 <code v-pre>ansible_distribution_release</code> 같은 팩트 값을 Template으로 Playbook을 작성한 예제 이다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"install-ansible-docker"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"hashitalks-kr"</span><span class="token punctuation">]</span>  <span class="token comment"># 사용할 데이터 센터 이름으로 수정</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"sysbatch"</span>  <span class="token comment"># 배치 작업 유형</span>

  <span class="token keyword">constraint</span> <span class="token punctuation">{</span>
    <span class="token property">attribute</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>attr<span class="token punctuation">.</span>os<span class="token punctuation">.</span>name<span class="token punctuation">}</span></span>"</span>
    <span class="token property">value</span>     <span class="token punctuation">=</span> <span class="token string">"ubuntu"</span>
  <span class="token punctuation">}</span>

  <span class="token keyword">parameterized</span> <span class="token punctuation">{</span>
    <span class="token property">payload</span>       <span class="token punctuation">=</span> <span class="token string">"forbidden"</span>
  <span class="token punctuation">}</span>

  group <span class="token string">"install- group"</span> <span class="token punctuation">{</span>

    task <span class="token string">"install-ansible-task"</span> <span class="token punctuation">{</span>
      <span class="token keyword">lifecycle</span> <span class="token punctuation">{</span>
        <span class="token property">hook</span> <span class="token punctuation">=</span> <span class="token string">"prestart"</span>
        <span class="token property">sidecar</span> <span class="token punctuation">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
      
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>  <span class="token comment"># 외부 스크립트를 실행</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"local/install_ansible.sh"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/install_ansible.sh"</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
#!/bin/bash
sudo apt-get update
sudo apt-get install -y ansible
EOF</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"install-docker-task"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>  <span class="token comment"># 외부 스크립트를 실행</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"ansible-playbook"</span>
        <span class="token property">args</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span>
          <span class="token string">"local/playbook.yml"</span>
        <span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">env</span> <span class="token punctuation">{</span>
        <span class="token property">JAVA_VERSION</span> <span class="token punctuation">=</span> <span class="token string">"<span class="token interpolation"><span class="token punctuation">$</span><span class="token punctuation">{</span>NOMAD_META_DesiredJavaVersion<span class="token punctuation">}</span></span>"</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/playbook.yml"</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOF
---
- hosts:
    - localhost
  become: yes
  tasks:
    - name: Install aptitude
      apt:
        name: aptitude
        state: latest
        update_cache: true

    - name: Install required packages
      apt:
        pkg:
          - apt-transport-https
          - ca-certificates
          - curl
          - software-properties-common
          - python3-pip
          - virtualenv
          - python3-setuptools
        state: latest
        update_cache: true

    - name: Add Docker GPG apt Key
      apt_key:
        url: https://download.docker.com/linux/ubuntu/gpg
        state: present

    - name: Add Docker repository
      apt_repository:
        repo: "deb [arch={{ env "attr.cpu.arch" }}] https://download.docker.com/linux/ubuntu {{"{{"}} ansible_lsb.codename {{"}}"}} stable"
        state: present
        update_cache: true

    - name: Update the apt package index
      apt:
        update_cache: true

    - name: Install Docker CE
      apt:
        name: docker-ce
        state: latest

    - name: Install Docker CE etc.
      apt:
        name:
          - docker-ce-cli
          - containerd.io
          - docker-buildx-plugin
          - docker-compose-plugin
        state: present

    - name: Ensure Docker starts on boot
      service:
        name: docker
        enabled: true
        state: started
EOF</span>
      <span class="token punctuation">}</span>

      <span class="token keyword">resources</span> <span class="token punctuation">{</span>
        <span class="token property">cpu</span>    <span class="token punctuation">=</span> <span class="token number">500</span>
        <span class="token property">memory</span> <span class="token punctuation">=</span> <span class="token number">256</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


