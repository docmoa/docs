<template><div><h1 id="nomad-csi-sample" tabindex="-1"><a class="header-anchor" href="#nomad-csi-sample" aria-hidden="true">#</a> Nomad CSI Sample</h1>
<ul>
<li>AWS에 EFS를 Nomad CSI로 활용</li>
<li>full code는 아래 github를 참고
<ul>
<li>참고 github: <a href="https://github.com/Great-Stone/nomad-demo-with-ecs" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/nomad-demo-with-ecs<ExternalLinkIcon/></a>
<ul>
<li>branches: ung</li>
</ul>
</li>
</ul>
</li>
</ul>
<figure><img src="@source/04-HashiCorp/03-Terraform/03-Sample/image/nomad_csi.png" alt="nomad Architecture with CSI" tabindex="0" loading="lazy"><figcaption>nomad Architecture with CSI</figcaption></figure>
<h2 id="ec2-nomad-client-node-에-efs의-volume관련-권한이-필요합니다" tabindex="-1"><a class="header-anchor" href="#ec2-nomad-client-node-에-efs의-volume관련-권한이-필요합니다" aria-hidden="true">#</a> ec2(nomad client node)에 efs의 volume관련 권한이 필요합니다.</h2>
<ul>
<li>ec2와 efs는 같은 subnet이여야 합니다.</li>
<li>vpc에는 dns관련 권한설정이 필요합니다.</li>
</ul>
<details>
<summary>ec2 iam policy</summary>
<div markdown="1">
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>
resource <span class="token string-literal"><span class="token string">"aws_vpc"</span></span> <span class="token string-literal"><span class="token string">"nomad_demo"</span></span> <span class="token punctuation">{</span>
  cidr_block <span class="token operator">=</span> var<span class="token punctuation">.</span>vpc_cidr_block
  <span class="token comment">#dns 권한설정이 필요함</span>
  enable_dns_support   <span class="token operator">=</span> <span class="token boolean">true</span>
  enable_dns_hostnames <span class="token operator">=</span> <span class="token boolean">true</span>
  tags <span class="token operator">=</span> <span class="token punctuation">{</span>
    env <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nomad"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_subnet"</span></span> <span class="token string-literal"><span class="token string">"nomad_demo"</span></span> <span class="token punctuation">{</span>
  cidr_block <span class="token operator">=</span> var<span class="token punctuation">.</span>vpc_cidr_block
  vpc_id     <span class="token operator">=</span> aws_vpc<span class="token punctuation">.</span>nomad_demo<span class="token punctuation">.</span>id
  <span class="token comment">#efs와 az가 같아야함</span>
  availability_zone <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ap-northeast-2a"</span></span>
<span class="token punctuation">}</span>

<span class="token comment">############</span>
<span class="token comment"># Policy</span>

data <span class="token string-literal"><span class="token string">"aws_iam_policy_document"</span></span> <span class="token string-literal"><span class="token string">"instance_role"</span></span> <span class="token punctuation">{</span>
  statement <span class="token punctuation">{</span>
    effect <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    actions <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token string-literal"><span class="token string">"sts:AssumeRole"</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span>

    principals <span class="token punctuation">{</span>
      type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Service"</span></span>
      identifiers <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"ec2.amazonaws.com"</span></span><span class="token punctuation">]</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_iam_role"</span></span> <span class="token string-literal"><span class="token string">"instance_role"</span></span> <span class="token punctuation">{</span>
  name_prefix        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-nomad"</span></span>
  assume_role_policy <span class="token operator">=</span> data<span class="token punctuation">.</span>aws_iam_policy_document<span class="token punctuation">.</span>instance_role<span class="token punctuation">.</span>json
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_iam_role"</span></span> <span class="token string-literal"><span class="token string">"instance_role"</span></span> <span class="token punctuation">{</span>
  name_prefix        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-nomad"</span></span>
  assume_role_policy <span class="token operator">=</span> data<span class="token punctuation">.</span>aws_iam_policy_document<span class="token punctuation">.</span>instance_role<span class="token punctuation">.</span>json
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_iam_instance_profile"</span></span> <span class="token string-literal"><span class="token string">"test_profile"</span></span> <span class="token punctuation">{</span>
  name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"test_profile"</span></span>
  role <span class="token operator">=</span> aws_iam_role<span class="token punctuation">.</span>instance_role<span class="token punctuation">.</span>name
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_iam_role_policy"</span></span> <span class="token string-literal"><span class="token string">"cluster_discovery"</span></span> <span class="token punctuation">{</span>
  name   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"${var.prefix}-nomad-cluster_discovery"</span></span>
  role   <span class="token operator">=</span> aws_iam_role<span class="token punctuation">.</span>instance_role<span class="token punctuation">.</span>id
  policy <span class="token operator">=</span> data<span class="token punctuation">.</span>aws_iam_policy_document<span class="token punctuation">.</span>cluster_discovery<span class="token punctuation">.</span>json
<span class="token punctuation">}</span>

data <span class="token string-literal"><span class="token string">"aws_iam_policy_document"</span></span> <span class="token string-literal"><span class="token string">"cluster_discovery"</span></span> <span class="token punctuation">{</span>
  <span class="token comment"># allow role with this policy to do the following: list instances, list tags, autoscale</span>
  statement <span class="token punctuation">{</span>
    effect <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>
    actions <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token string-literal"><span class="token string">"ec2:DescribeInstances"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"autoscaling:CompleteLifecycleAction"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ec2:DescribeTags"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:ListClusters"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:DescribeClusters"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:DeregisterContainerInstance"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:ListContainerInstances"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:RegisterContainerInstance"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:SubmitContainerStateChange"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:SubmitTaskStateChange"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:DescribeContainerInstances"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:DescribeTasks"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:ListTasks"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:UpdateContainerAgent"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:StartTask"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:StopTask"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ecs:RunTask"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"elasticfilesystem:ClientMount"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"elasticfilesystem:ClientWrite"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"elasticfilesystem:ClientRootAccess"</span></span>
    <span class="token punctuation">]</span>
    resources <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"*"</span></span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
</details>
<details>
<summary>efs volume and iam policy</summary>
<div markdown="1">
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>
<span class="token comment">############</span>
<span class="token comment">#EFS</span>

resource <span class="token string-literal"><span class="token string">"aws_iam_role_policy"</span></span> <span class="token string-literal"><span class="token string">"mount_efs_volumes"</span></span> <span class="token punctuation">{</span>
  name   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"mount-efs-volumes"</span></span>
  role   <span class="token operator">=</span> aws_iam_role<span class="token punctuation">.</span>instance_role<span class="token punctuation">.</span>id
  policy <span class="token operator">=</span> data<span class="token punctuation">.</span>aws_iam_policy_document<span class="token punctuation">.</span>mount_efs_volumes<span class="token punctuation">.</span>json
<span class="token punctuation">}</span>

data <span class="token string-literal"><span class="token string">"aws_iam_policy_document"</span></span> <span class="token string-literal"><span class="token string">"mount_efs_volumes"</span></span> <span class="token punctuation">{</span>
  statement <span class="token punctuation">{</span>
    effect <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow"</span></span>

    actions <span class="token operator">=</span> <span class="token punctuation">[</span>
      <span class="token string-literal"><span class="token string">"ec2:DescribeInstances"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ec2:DescribeTags"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ec2:DescribeVolumes"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ec2:AttachVolume"</span></span><span class="token punctuation">,</span>
      <span class="token string-literal"><span class="token string">"ec2:DetachVolume"</span></span><span class="token punctuation">,</span>
    <span class="token punctuation">]</span>
    resources <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"*"</span></span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token comment"># csi efs volume</span>
resource <span class="token string-literal"><span class="token string">"aws_efs_file_system"</span></span> <span class="token string-literal"><span class="token string">"nomad_csi"</span></span> <span class="token punctuation">{</span>
  creation_token <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nomad-csi"</span></span>
  performance_mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"generalPurpose"</span></span>
  throughput_mode  <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"bursting"</span></span>

  tags <span class="token operator">=</span> <span class="token punctuation">{</span>
    Name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"nomad-csi"</span></span>
  <span class="token punctuation">}</span>
  <span class="token comment">#az가 ec2와 동일해야함</span>
  availability_zone_name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ap-northeast-2a"</span></span>
<span class="token punctuation">}</span>

<span class="token comment">#ec2와 subnet이 같아야함</span>
resource <span class="token string-literal"><span class="token string">"aws_efs_mount_target"</span></span> <span class="token string-literal"><span class="token string">"nomad_efs"</span></span> <span class="token punctuation">{</span>
  file_system_id <span class="token operator">=</span> aws_efs_file_system<span class="token punctuation">.</span>nomad_csi<span class="token punctuation">.</span>id
  subnet_id      <span class="token operator">=</span> aws_subnet<span class="token punctuation">.</span>nomad_demo<span class="token punctuation">.</span>id
  security_groups <span class="token operator">=</span> <span class="token punctuation">[</span> aws_security_group<span class="token punctuation">.</span>efs<span class="token punctuation">.</span>id <span class="token punctuation">]</span> 
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"aws_security_group"</span></span> <span class="token string-literal"><span class="token string">"efs"</span></span> <span class="token punctuation">{</span>
  name        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"allow_efs"</span></span>
  description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"Allow EFS inbound traffic"</span></span>
  vpc_id      <span class="token operator">=</span> aws_vpc<span class="token punctuation">.</span>nomad_demo<span class="token punctuation">.</span>id

  ingress <span class="token punctuation">{</span>
    description <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"TLS from VPC"</span></span>
    from_port   <span class="token operator">=</span> <span class="token number">443</span>
    to_port     <span class="token operator">=</span> <span class="token number">443</span>
    protocol    <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"tcp"</span></span>
    cidr_blocks <span class="token operator">=</span> <span class="token punctuation">[</span> <span class="token string-literal"><span class="token string">"0.0.0.0/0"</span></span> <span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  egress <span class="token punctuation">{</span>
    from_port   <span class="token operator">=</span> <span class="token number">0</span>
    to_port     <span class="token operator">=</span> <span class="token number">0</span>
    protocol    <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"-1"</span></span>
    cidr_blocks <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"0.0.0.0/0"</span></span><span class="token punctuation">]</span>
  <span class="token punctuation">}</span>

  tags <span class="token operator">=</span> <span class="token punctuation">{</span>
    Name <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"allow_tls"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
</details>
<h2 id="nomad-csi-create" tabindex="-1"><a class="header-anchor" href="#nomad-csi-create" aria-hidden="true">#</a> nomad csi create</h2>
<ul>
<li>nomad csi job을 배포합니다.</li>
<li>plugins을 생성합니다.</li>
</ul>
<details>
<summary>nomad csi create</summary>
<div markdown="1">
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code><span class="token comment">#efs csi job을 생성</span>
resource <span class="token string-literal"><span class="token string">"nomad_job"</span></span> <span class="token string-literal"><span class="token string">"nomad_csi_node_job"</span></span> <span class="token punctuation">{</span>
  jobspec <span class="token operator">=</span> file<span class="token punctuation">(</span><span class="token string-literal"><span class="token string">"./job_file/csi-node.tpl"</span></span><span class="token punctuation">)</span>
<span class="token punctuation">}</span>

resource <span class="token string-literal"><span class="token string">"time_sleep"</span></span> <span class="token string-literal"><span class="token string">"wait_30_seconds"</span></span> <span class="token punctuation">{</span>
  depends_on <span class="token operator">=</span> <span class="token punctuation">[</span>nomad_job<span class="token punctuation">.</span>nomad_csi_node_job<span class="token punctuation">]</span>
  create_duration <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"30s"</span></span>
<span class="token punctuation">}</span>

<span class="token comment">#생성된 plugin을 기다림</span>
data <span class="token string-literal"><span class="token string">"nomad_plugin"</span></span> <span class="token string-literal"><span class="token string">"efs"</span></span> <span class="token punctuation">{</span>
  depends_on <span class="token operator">=</span> <span class="token punctuation">[</span>time_sleep<span class="token punctuation">.</span>wait_30_seconds<span class="token punctuation">]</span>
  plugin_id        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"aws-efs0"</span></span>
  wait_for_registration <span class="token operator">=</span> <span class="token boolean">true</span>
<span class="token punctuation">}</span>

<span class="token comment">#efs volume을 nomad에서 사용할 수 있게 plugins을 생성</span>
resource <span class="token string-literal"><span class="token string">"nomad_volume"</span></span> <span class="token string-literal"><span class="token string">"efs_csi_volume"</span></span> <span class="token punctuation">{</span>
  depends_on  <span class="token operator">=</span> <span class="token punctuation">[</span>data<span class="token punctuation">.</span>nomad_plugin<span class="token punctuation">.</span>efs<span class="token punctuation">]</span>
  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"csi"</span></span>
  plugin_id   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"aws-efs0"</span></span>
  volume_id   <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"efs_csi_volume"</span></span>
  name        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"efs_csi_volume"</span></span>
  external_id <span class="token operator">=</span> data<span class="token punctuation">.</span>terraform_remote_state<span class="token punctuation">.</span>net<span class="token punctuation">.</span>outputs<span class="token punctuation">.</span>nomad_efs_name<span class="token punctuation">.</span>id

  capability <span class="token punctuation">{</span>
    access_mode     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"single-node-writer"</span></span>
    attachment_mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"file-system"</span></span>
  <span class="token punctuation">}</span>

  mount_options <span class="token punctuation">{</span>
    fs_type <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"ext4"</span></span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div>
</details>
<h2 id="efs-test-job-배포" tabindex="-1"><a class="header-anchor" href="#efs-test-job-배포" aria-hidden="true">#</a> efs test job 배포</h2>
<div class="language-ruby line-numbers-mode" data-ext="rb"><pre v-pre class="language-ruby"><code>job <span class="token string-literal"><span class="token string">"efs_csi_job"</span></span> <span class="token punctuation">{</span>
  datacenters <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"dc1"</span></span><span class="token punctuation">]</span>

  type        <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"system"</span></span>

  group <span class="token string-literal"><span class="token string">"cache"</span></span> <span class="token punctuation">{</span>
    count <span class="token operator">=</span> <span class="token number">1</span>

    network <span class="token punctuation">{</span>
      port <span class="token string-literal"><span class="token string">"db"</span></span> <span class="token punctuation">{</span>
        to <span class="token operator">=</span> <span class="token number">6379</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment"># 생성한 volume id 값을 명시한 volume을 선언</span>
    volume <span class="token string-literal"><span class="token string">"cache"</span></span> <span class="token punctuation">{</span>
      type            <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"csi"</span></span>
      source          <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"efs_csi_volume"</span></span>
      attachment_mode <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"file-system"</span></span>
      access_mode     <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"single-node-writer"</span></span>
      read_only    <span class="token operator">=</span> <span class="token boolean">false</span>
    <span class="token punctuation">}</span>

    task <span class="token string-literal"><span class="token string">"redis"</span></span> <span class="token punctuation">{</span>
      driver <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"docker"</span></span>

      config <span class="token punctuation">{</span>
        image <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"redis:6.2.6-alpine3.15"</span></span>
        ports <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token string-literal"><span class="token string">"db"</span></span><span class="token punctuation">]</span>
      <span class="token punctuation">}</span>

      resources <span class="token punctuation">{</span>
        cpu    <span class="token operator">=</span> <span class="token number">500</span>
        memory <span class="token operator">=</span> <span class="token number">511</span>
      <span class="token punctuation">}</span>
      <span class="token comment">#선언한 volume을 사용할 위치에 mount</span>
      volume_mount <span class="token punctuation">{</span>
        volume      <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"cache"</span></span>
        destination <span class="token operator">=</span> <span class="token string-literal"><span class="token string">"/data"</span></span>
        read_only    <span class="token operator">=</span> <span class="token boolean">false</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></div></template>


