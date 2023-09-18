<template><div><h1 id="vault-pki-mtls-demo" tabindex="-1"><a class="header-anchor" href="#vault-pki-mtls-demo" aria-hidden="true">#</a> Vault PKI - mTLS demo</h1>
<blockquote>
<p>Demo App Github : <a href="https://github.com/Great-Stone/vault-mtls-demo" target="_blank" rel="noopener noreferrer">https://github.com/Great-Stone/vault-mtls-demo<ExternalLinkIcon/></a></p>
</blockquote>
<h2 id="_1-mtls-설명" tabindex="-1"><a class="header-anchor" href="#_1-mtls-설명" aria-hidden="true">#</a> 1. mTLS 설명</h2>
<h3 id="_1-1-ssl과-tls" tabindex="-1"><a class="header-anchor" href="#_1-1-ssl과-tls" aria-hidden="true">#</a> 1.1 SSL과 TLS</h3>
<p>SSL(Secure Sokets Layer, 보안 소캣 계층)는 클라이언트와 서버 사이에 전송된 데이터를 암호화 하고 인터넷 연결에 보안을 유지하는 표준 기술이다. 악의적 외부인이 클라이언트와 서버 사이에 전송되는 정보를 확인 및 탈취하는 것을 방지한다.</p>
<p>TLS(Transport Layer Security, 전송 계층 보안)는 현재 더이상 사용되지 않는 SSL을 계승하는 보다 진보된 보안 기술이다. SSL 3.0을 기반으로 만들어졌지만 호환되지는 않는다. 최신 버전은 TLS 1.3이다.</p>
<ul>
<li>TLS 1.2의 경우 암호화 방식과 키 교환 통신이 handshake 과정에 포한되어있어 2회 정도의 추가 요청이 있었다.</li>
<li>TLS 1.3에서는 handshake과정을 최소화해 암호화 통신하는 방안이 추가되어 HTTPS 통신에 속도와 보안이 개선되었다.
<ul>
<li>handshake에 0-RTT 모드 추가</li>
<li>정적인 RSA와 Diffie-Hellman Cipher Suite 제거</li>
<li>handshake 최대한 암호화</li>
<li>키 교환과 암호화 방식을 Cipher Suite를 통해 묶어서 정하지 않고 개별적 지정</li>
</ul>
</li>
</ul>
<p>SSL 기술이 TLS로 대체되었다고 하지만 여전히 브라우저 인증서는 SSL 인증서라고 불린다.</p>
<h3 id="_1-2-tls-handshake" tabindex="-1"><a class="header-anchor" href="#_1-2-tls-handshake" aria-hidden="true">#</a> 1.2 TLS Handshake</h3>
<p>TLS에서는 서버에만 TLS 인증서 및 공개/개인 키 쌍이 있고 클라이언트에는 없다. TLS 프로세스는 다음과 같다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230320091036089.png" alt="image-20230320091036089" tabindex="0" loading="lazy"><figcaption>image-20230320091036089</figcaption></figure>
<h3 id="_1-3-mutualtls-mtls" tabindex="-1"><a class="header-anchor" href="#_1-3-mutualtls-mtls" aria-hidden="true">#</a> 1.3 mutualTLS(mTLS)</h3>
<p>mTLS에서는 클라이언트와 서버 모두에 인증서가 있고 양쪽에서 공개/개인 키 쌍을 사용하여 인증한다. TLS 대비 mTLS는 양쪽을 확인하기 위한 추가 단계가 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/image-20230320091236622.png" alt="image-20230320091236622" tabindex="0" loading="lazy"><figcaption>image-20230320091236622</figcaption></figure>
<h3 id="_1-4-mtls-의-장단점" tabindex="-1"><a class="header-anchor" href="#_1-4-mtls-의-장단점" aria-hidden="true">#</a> 1.4 mTLS 의 장단점</h3>
<p>먼저 mTLS의 장점을 살펴보면,</p>
<ul>
<li>서버와 클라이언트 간의 상호 인증을 가능하게 하므로, 서버와 클라이언트 모두 신뢰할 수 있는 대상인지 확인할 수 있다. 이를 통해 중간자 공격 및 위조된 인증서와 같은 보안 문제를 방지할 수 있다.</li>
<li>mTLS는 암호화된 연결을 통해 전송되는 데이터의 안전성을 보장한다. TLS 프로토콜을 사용하므로, 데이터는 암호화되어 전송되며, 중간자 공격 및 도청과 같은 공격으로부터 안전하게 보호된다.</li>
</ul>
<p>mTLS의 단점은 다음과 같다.</p>
<ul>
<li>연결을 설정하는 과정에서 추가적인 CPU 리소스와 대역폭이 필요할 수 있다. 이는 특히 고사양의 서버에서 큰 부담이 될 수 있다.</li>
<li>서버와 클라이언트 모두가 인증서를 발급하고 관리해야 한다는 점이 있다. 인증서를 발급하는 과정은 복잡할 수 있으며, 이를 관리하는 것도 일정한 노력과 비용이 필요합니다.</li>
<li>mTLS를 구현하는 것은 애플리케이션과 서버 모두에게 추가적인 복잡성을 요구할 수 있다. 이를 위해 애플리케이션과 서버 모두에 대한 추가적인 설정 및 관리가 필요할 수 있다.</li>
</ul>
<h3 id="_1-5-구성의-예" tabindex="-1"><a class="header-anchor" href="#_1-5-구성의-예" aria-hidden="true">#</a> 1.5 구성의 예</h3>
<h4 id="python-flask" tabindex="-1"><a class="header-anchor" href="#python-flask" aria-hidden="true">#</a> Python - Flask</h4>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">from</span> flask <span class="token keyword">import</span> Flask<span class="token punctuation">,</span> render_template<span class="token punctuation">,</span> request<span class="token punctuation">,</span> make_response
<span class="token keyword">import</span> ssl

app <span class="token operator">=</span> Flask<span class="token punctuation">(</span>__name__<span class="token punctuation">)</span>

<span class="token comment">### APIs ###</span>

<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    app<span class="token punctuation">.</span>debug <span class="token operator">=</span> <span class="token boolean">True</span>
    ssl_context <span class="token operator">=</span> ssl<span class="token punctuation">.</span>create_default_context<span class="token punctuation">(</span>purpose<span class="token operator">=</span>ssl<span class="token punctuation">.</span>Purpose<span class="token punctuation">.</span>CLIENT_AUTH<span class="token punctuation">,</span> cafile<span class="token operator">=</span><span class="token string">'ca.crt'</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>load_cert_chain<span class="token punctuation">(</span>certfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'site.crt'</span></span><span class="token punctuation">,</span> keyfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'site.key'</span></span><span class="token punctuation">,</span> password<span class="token operator">=</span><span class="token string">''</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>verify_mode <span class="token operator">=</span> ssl<span class="token punctuation">.</span>CERT_REQUIRED
    app<span class="token punctuation">.</span>run<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">"0.0.0.0"</span><span class="token punctuation">,</span> port<span class="token operator">=</span>src_port<span class="token punctuation">,</span> ssl_context<span class="token operator">=</span>ssl_context<span class="token punctuation">,</span> use_reloader<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">)</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="nginx" tabindex="-1"><a class="header-anchor" href="#nginx" aria-hidden="true">#</a> nginx</h4>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># default.conf</span>
<span class="token keyword">server</span> <span class="token punctuation">{</span>
    listen                  <span class="token number">443</span> ssl;

    access_log /var/log/nginx/access.log;
    error_log /var/log/nginx/error.log;

    ssl_certificate         /etc/ssl/server.crt;
    ssl_certificate_key     /etc/ssl/server.key;
    ssl_protocols           TLSv1.<span class="token number">2</span> TLSv1.<span class="token number">3</span>;
    ssl_client_certificate  /etc/nginx/client_certs/ca.crt;
    ssl_verify_client       on;
    ssl_verify_depth        <span class="token number">2</span>;

    location / <span class="token punctuation">{</span>
        if ($ssl_client_verify !<span class="token punctuation">=</span> SUCCESS) <span class="token punctuation">{</span> return <span class="token number">403</span>; <span class="token punctuation">}</span>

        <span class="token comment">### 구성 ###</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="apache-httpd-2-4" tabindex="-1"><a class="header-anchor" href="#apache-httpd-2-4" aria-hidden="true">#</a> Apache HTTPD 2.4</h4>
<div class="language-xml line-numbers-mode" data-ext="xml"><pre v-pre class="language-xml"><code><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>VirtualHost</span> <span class="token attr-name"><span class="token namespace">*:</span>80</span><span class="token punctuation">></span></span>
    ServerName {DOMAIN}
    Redirect permanent / https://{DOMAIN}
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>VirtualHost</span><span class="token punctuation">></span></span>

<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>IfModule</span> <span class="token attr-name">mod_ssl.c</span><span class="token punctuation">></span></span>
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>VirtualHost</span> <span class="token attr-name"><span class="token namespace">*:</span>443</span><span class="token punctuation">></span></span>
        ServerAdmin info@{DOMAIN}
        ServerName {DOMAIN}

        Header always set Strict-Transport-Security "max-age=63072000; includeSubdomains;"

        SSLEngine       on
        SSLCompression      Off
        SSLProtocol         ALL -SSLv2 -SSLv3
        SSLHonorCipherOrder     On
        SSLCipherSuite      EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH
        SSLCertificateFile  {SSL}/fullchain.pem
        SSLCertificateKeyFile   {SSL}/privkey.pem
        SSLCACertificateFile    {PATH}/ca.crt
        SSLStrictSNIVHostCheck  on

        &lt;Location / >
            SSLVerifyClient     require 
            SSLVerifyDepth      1

            Options FollowSymLinks
            AllowOverride None
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Location</span><span class="token punctuation">></span></span>     

        &lt;Location /health>
            SSLVerifyClient none
        <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>Location</span><span class="token punctuation">></span></span>

        ProxyPreserveHost On
        ProxyRequests off
        ProxyPass / http://localhost/
        ProxyPassReverse / http://localhost/
    <span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>VirtualHost</span><span class="token punctuation">></span></span>
<span class="token tag"><span class="token tag"><span class="token punctuation">&lt;/</span>IfModule</span><span class="token punctuation">></span></span>
</code></pre><div class="highlight-lines"><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><div class="highlight-line">&nbsp;</div><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><hr>
<p>볼트가 제공하는 PKI 기능과 Agent의 자동 교체 기능을 활용하여 인증서 관리와 발급을 자동화하여 애플리케이션과 서버에 대한 부담을 줄이고 mTLS의 장점을 취할 수 있다.</p>
<h2 id="_2-use-openssl" tabindex="-1"><a class="header-anchor" href="#_2-use-openssl" aria-hidden="true">#</a> 2. use OpenSSL</h2>
<blockquote>
<ul>
<li>참고 : <a href="https://bitgadak.tistory.com/5" target="_blank" rel="noopener noreferrer">https://bitgadak.tistory.com/5<ExternalLinkIcon/></a></li>
<li>openssl 대신 smallstep 을 사용하면 좀더 간단하다 : <a href="https://smallstep.com/hello-mtls/doc/client/requests" target="_blank" rel="noopener noreferrer">https://smallstep.com/hello-mtls/doc/client/requests<ExternalLinkIcon/></a></li>
<li>socket example : <a href="https://www.electricmonk.nl/log/2018/06/02/ssl-tls-client-certificate-verification-with-python-v3-4-sslcontext/" target="_blank" rel="noopener noreferrer">https://www.electricmonk.nl/log/2018/06/02/ssl-tls-client-certificate-verification-with-python-v3-4-sslcontext/<ExternalLinkIcon/></a></li>
</ul>
</blockquote>
<p>OpenSSL을 활용하여 볼트를 사용하지 않고 mTLS를 구현하는 과정을 설명한다.</p>
<h3 id="_2-1-root-key-생성" tabindex="-1"><a class="header-anchor" href="#_2-1-root-key-생성" aria-hidden="true">#</a> 2.1 Root Key 생성</h3>
<p>root ca 생성을 위한 root key를 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> cert
openssl genrsa <span class="token parameter variable">-out</span> root.key <span class="token number">2048</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>OS에 따라(Linux/MacOS) 권한 변경이 권장된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token function">chmod</span> <span class="token number">600</span> root.key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-2-root-ca-요청서-csr-생성" tabindex="-1"><a class="header-anchor" href="#_2-2-root-ca-요청서-csr-생성" aria-hidden="true">#</a> 2.2 Root CA 요청서(CSR) 생성</h3>
<p>생성된 <code v-pre>root.key</code> 기반의 root ca 인증서 생성을 위한 요청서를 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ openssl req <span class="token parameter variable">-config</span> ca.conf <span class="token parameter variable">-extensions</span> usr_cert <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> root.key <span class="token parameter variable">-out</span> ca.csr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-config</code> : 미리 구성해 놓은 ca용 구성 정보를 읽는다.</li>
</ul>
<p><code v-pre>openssl-xxx.conf</code> sample</p>
<table>
<thead>
<tr>
<th>구분</th>
<th>작성 예</th>
</tr>
</thead>
<tbody>
<tr>
<td>Country Name (국가코드)</td>
<td>KR</td>
</tr>
<tr>
<td>State or Province Name (시/도의 전체이름)</td>
<td>Seoul</td>
</tr>
<tr>
<td>Locality Name (시/군/구 등의 이름)</td>
<td>Songpa-gu</td>
</tr>
<tr>
<td>Organization (회사이름)</td>
<td>XXXX</td>
</tr>
<tr>
<td>Organization Unit (부서명)</td>
<td>Server</td>
</tr>
<tr>
<td>Common Name (SSL 인증서를 설치할 서버의 Full Domain)</td>
<td><a href="http://www.xxxx.com" target="_blank" rel="noopener noreferrer">www.xxxx.com<ExternalLinkIcon/></a></td>
</tr>
</tbody>
</table>
<h4 id="check" tabindex="-1"><a class="header-anchor" href="#check" aria-hidden="true">#</a> Check</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ openssl req <span class="token parameter variable">-text</span> <span class="token parameter variable">-in</span> ca.csr
Certificate Request:
    Data:
        Version: <span class="token number">0</span> <span class="token punctuation">(</span>0x0<span class="token punctuation">)</span>
        Subject: <span class="token assign-left variable">C</span><span class="token operator">=</span>KR, <span class="token assign-left variable">ST</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">L</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">O</span><span class="token operator">=</span>COMPANY, <span class="token assign-left variable">OU</span><span class="token operator">=</span>DEV/emailAddress<span class="token operator">=</span>example@example.com, <span class="token assign-left variable">CN</span><span class="token operator">=</span>example root
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: <span class="token punctuation">(</span><span class="token number">2048</span> bit<span class="token punctuation">)</span>
                Modulus:
                    <span class="token operator">&lt;</span><span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.<span class="token operator">></span>
                Exponent: <span class="token number">65537</span> <span class="token punctuation">(</span>0x10001<span class="token punctuation">)</span>
        Attributes:
        Requested Extensions:
            X509v3 Basic Constraints: 
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
         <span class="token operator">&lt;</span><span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.<span class="token operator">></span>
-----BEGIN CERTIFICATE REQUEST-----
<span class="token operator">&lt;</span><span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.<span class="token operator">></span>
-----END CERTIFICATE REQUEST-----
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-3-root-ca-인증서-생성" tabindex="-1"><a class="header-anchor" href="#_2-3-root-ca-인증서-생성" aria-hidden="true">#</a> 2.3 Root CA 인증서 생성</h3>
<p>생성된 요청서에 대해 자체 서명(self-signning)한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">3650</span> <span class="token parameter variable">-in</span> ca.csr <span class="token parameter variable">-signkey</span> root.key <span class="token parameter variable">-extfile</span> ca.ext <span class="token parameter variable">-out</span> ca.crt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-days</code> : 인증서 기간은 10년으로 하였다.</li>
<li><code v-pre>-extfile</code> : 서명시 추가 정보에 대한 내용을 읽는다.</li>
</ul>
<h4 id="check-1" tabindex="-1"><a class="header-anchor" href="#check-1" aria-hidden="true">#</a> Check</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ openssl x509 <span class="token parameter variable">-text</span> <span class="token parameter variable">-noout</span> <span class="token parameter variable">-in</span> ca.crt
Certificate:
    Data:
        Version: <span class="token number">3</span> <span class="token punctuation">(</span>0x2<span class="token punctuation">)</span>
        Serial Number:
            ee:38:a2:de:5e:b2:11:c8
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: <span class="token assign-left variable">C</span><span class="token operator">=</span>KR, <span class="token assign-left variable">ST</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">L</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">O</span><span class="token operator">=</span>COMPANY, <span class="token assign-left variable">OU</span><span class="token operator">=</span>DEV/emailAddress<span class="token operator">=</span>example@example.com, <span class="token assign-left variable">CN</span><span class="token operator">=</span>example root
        Validity
            Not Before: Mar <span class="token number">15</span> 03:04:58 <span class="token number">2023</span> GMT
            Not After <span class="token builtin class-name">:</span> Mar <span class="token number">12</span> 03:04:58 <span class="token number">2033</span> GMT
        Subject: <span class="token assign-left variable">C</span><span class="token operator">=</span>KR, <span class="token assign-left variable">ST</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">L</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">O</span><span class="token operator">=</span>COMPANY, <span class="token assign-left variable">OU</span><span class="token operator">=</span>DEV/emailAddress<span class="token operator">=</span>example@example.com, <span class="token assign-left variable">CN</span><span class="token operator">=</span>example root
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: <span class="token punctuation">(</span><span class="token number">2048</span> bit<span class="token punctuation">)</span>
                Modulus:
                    <span class="token operator">&lt;</span><span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.<span class="token operator">></span>
                Exponent: <span class="token number">65537</span> <span class="token punctuation">(</span>0x10001<span class="token punctuation">)</span>
        X509v3 extensions:
            X509v3 Basic Constraints: 
                CA:TRUE
    Signature Algorithm: sha256WithRSAEncryption
         <span class="token operator">&lt;</span><span class="token punctuation">..</span>.생략<span class="token punctuation">..</span>.<span class="token operator">></span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>생성된 root ca 파일을 시스템에 신뢰할 수 있는 인증서로 등록하면, 브라우저 호출시 신뢰할 수 없는 인증서로 인한 경고 창이 뜨지 않는다.</p>
<ul>
<li>MacOS의 경우 <code v-pre>ca.crt</code>를 더블클릭하여 <code v-pre>키체인 접근</code> 앱에 <code v-pre>인증서</code> 탭에 등록하고, 등록된 <code v-pre>example.com</code>인증서를 더블클릭하여 <code v-pre>신뢰</code> 항목에서 <code v-pre>이 인증서 사용 시</code>를 <code v-pre>항상 신뢰</code>로 변경한다.</li>
<li>RedHat 계열 OS의 경우 <code v-pre>/etc/pki/ca-trust/source/anchors/</code> 에 인증서를 복사 한 후, <code v-pre>update-ca-trust</code> 명령을 실행한다.</li>
<li>Windows의 경우 <code v-pre>ca.crt</code>를 더블클릭하여 인증서 창의 <code v-pre>인증서 설치...</code>를 클릭, <code v-pre>인증서 가져오기 마법사</code>로 신뢰할 수 있는 인증서로 등록한다.</li>
</ul>
<h3 id="_2-4-서비스-a-용-key-생성" tabindex="-1"><a class="header-anchor" href="#_2-4-서비스-a-용-key-생성" aria-hidden="true">#</a> 2.4 서비스 A 용 Key 생성</h3>
<p>데모 서비스 A용 인증서를 생성하기 위해 해당 인증서를 위한 key를 생성한다. 생성 시 패스워드를 넣어주며, 패스워드 없는 key를 생성하려는 경우 한번더 풀어주는 과정이 필요하다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token comment"># 패스워드 4자리 이상 입력</span>
openssl genrsa <span class="token parameter variable">-aes256</span> <span class="token parameter variable">-out</span> service-a-with-pw.key <span class="token number">2048</span>
<span class="token comment"># 패스워드 없는 key</span>
openssl rsa <span class="token parameter variable">-in</span> service-a-with-pw.key <span class="token parameter variable">-out</span> service-a.key
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_2-5-서비스-a-용-인증서-요청서-csr-생성" tabindex="-1"><a class="header-anchor" href="#_2-5-서비스-a-용-인증서-요청서-csr-생성" aria-hidden="true">#</a> 2.5 서비스 A 용 인증서 요청서(CSR) 생성</h3>
<p>서비스 A용 인증서를 위한 요청서를 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> service-a.key <span class="token parameter variable">-config</span> service-a.conf <span class="token parameter variable">-out</span> service-a.csr
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li><code v-pre>-config</code> : 미리 구성해 놓은 서비스 A용 구성 정보를 읽는다.</li>
</ul>
<h3 id="_2-6-서비스용-인증서-생성" tabindex="-1"><a class="header-anchor" href="#_2-6-서비스용-인증서-생성" aria-hidden="true">#</a> 2.6 서비스용 인증서 생성</h3>
<p>자체 서명과정에서 앞서 생성한 root ca 인증서와 key를 넣어 서비스 A인증서가 root ca에 종속되도록 구성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-in</span> service-a.csr <span class="token parameter variable">-extfile</span> service-a.ext <span class="token parameter variable">-CA</span> ca.crt <span class="token parameter variable">-CAkey</span> root.key <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> service-a.crt
$ openssl x509 <span class="token parameter variable">-text</span> <span class="token parameter variable">-in</span> service-a.crt
Certificate:
    Data:
        Version: <span class="token number">3</span> <span class="token punctuation">(</span>0x2<span class="token punctuation">)</span>
        Serial Number:
            ec:71:b0:dd:72:c2:a2:4a
    Signature Algorithm: sha256WithRSAEncryption
        Issuer: <span class="token assign-left variable">C</span><span class="token operator">=</span>KR, <span class="token assign-left variable">ST</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">L</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">O</span><span class="token operator">=</span>COMPANY, <span class="token assign-left variable">OU</span><span class="token operator">=</span>DEV/emailAddress<span class="token operator">=</span>example@example.com, <span class="token assign-left variable">CN</span><span class="token operator">=</span>example root
        Validity
            Not Before: Mar <span class="token number">15</span> 03:36:06 <span class="token number">2023</span> GMT
            Not After <span class="token builtin class-name">:</span> Mar <span class="token number">14</span> 03:36:06 <span class="token number">2024</span> GMT
        Subject: <span class="token assign-left variable">C</span><span class="token operator">=</span>KR, <span class="token assign-left variable">ST</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">L</span><span class="token operator">=</span>Seoul, <span class="token assign-left variable">O</span><span class="token operator">=</span>COMPANY, <span class="token assign-left variable">OU</span><span class="token operator">=</span>DEV/emailAddress<span class="token operator">=</span>example@example.com, <span class="token assign-left variable">CN</span><span class="token operator">=</span>service-a.example.com
        Subject Public Key Info:
            Public Key Algorithm: rsaEncryption
                RSA Public-Key: <span class="token punctuation">(</span><span class="token number">2048</span> bit<span class="token punctuation">)</span>
                Modulus:
                    <span class="token operator">&lt;</span><span class="token punctuation">..</span>생략<span class="token punctuation">..</span><span class="token operator">></span>
                Exponent: <span class="token number">65537</span> <span class="token punctuation">(</span>0x10001<span class="token punctuation">)</span>
        X509v3 extensions:
            X509v3 Subject Alternative Name: 
                DNS:service-a.example.com
    Signature Algorithm: sha256WithRSAEncryption
         <span class="token operator">&lt;</span><span class="token punctuation">..</span>생략<span class="token punctuation">..</span><span class="token operator">></span>
-----BEGIN CERTIFICATE-----
<span class="token operator">&lt;</span><span class="token punctuation">..</span>생략<span class="token punctuation">..</span><span class="token operator">></span>
-----END CERTIFICATE-----
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>-days</code> : 인증서 기간을 1년으로 하였다.</li>
<li><code v-pre>-CA</code> : root ca 인증서를 지정한다.</li>
<li><code v-pre>-CAkey</code> : root ca의 key를 지정한다.</li>
<li><code v-pre>-CAcreateserial</code> : 서명 작업에 root ca가 인증서에 대한 일련번호 생성</li>
<li><code v-pre>-extfile</code> : 서비스 A를 위한 추가 정보</li>
</ul>
<h3 id="_2-7-service-b용-생성" tabindex="-1"><a class="header-anchor" href="#_2-7-service-b용-생성" aria-hidden="true">#</a> 2.7 Service B용 생성</h3>
<p>서비스 B에 대한 인증서도 생성한다. 앞서 설명된 내용을 생략하고 아래 커맨드만 나열한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>openssl genrsa <span class="token parameter variable">-aes256</span> <span class="token parameter variable">-out</span> service-b-with-pw.key <span class="token number">2048</span>

openssl rsa <span class="token parameter variable">-in</span> service-b-with-pw.key <span class="token parameter variable">-out</span> service-b.key

openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> service-b.key <span class="token parameter variable">-config</span> service-b.conf <span class="token parameter variable">-out</span> service-b.csr

openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-in</span> service-b.csr <span class="token parameter variable">-extfile</span> service-b.ext <span class="token parameter variable">-CA</span> ca.crt <span class="token parameter variable">-CAkey</span> root.key <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> service-b.crt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_3-demo-app-python" tabindex="-1"><a class="header-anchor" href="#_3-demo-app-python" aria-hidden="true">#</a> 3. Demo App (Python)</h2>
<p>데모 앱은 Python으로 구성되었다.</p>
<h3 id="_3-1-preparation" tabindex="-1"><a class="header-anchor" href="#_3-1-preparation" aria-hidden="true">#</a> 3.1 preparation</h3>
<h4 id="python" tabindex="-1"><a class="header-anchor" href="#python" aria-hidden="true">#</a> Python</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ python <span class="token parameter variable">--version</span>
Python <span class="token number">3.10</span>.5

$ pip <span class="token parameter variable">--version</span>
pip <span class="token number">23.0</span>.1

$ pip <span class="token function">install</span> requests flask
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="system-hosts" tabindex="-1"><a class="header-anchor" href="#system-hosts" aria-hidden="true">#</a> System : hosts</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token number">127.0</span>.0.1   service-a.example.com   service-b.example.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_3-2-run-services" tabindex="-1"><a class="header-anchor" href="#_3-2-run-services" aria-hidden="true">#</a> 3.2 Run services</h3>
<h4 id="service-a" tabindex="-1"><a class="header-anchor" href="#service-a" aria-hidden="true">#</a> Service A</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> python_service_a
python main.py
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="service-b" tabindex="-1"><a class="header-anchor" href="#service-b" aria-hidden="true">#</a> Service B</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> python_service_b
python main.py
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_3-3-test-api" tabindex="-1"><a class="header-anchor" href="#_3-3-test-api" aria-hidden="true">#</a> 3.3 Test API</h3>
<h4 id="check-curl-service-a" tabindex="-1"><a class="header-anchor" href="#check-curl-service-a" aria-hidden="true">#</a> Check curl - Service A</h4>
<p>Python으로 작성된 flask api server 구성은 다음과 같다.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token comment"># main.py</span>

<span class="token comment">### 생략 ###</span>
<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    app<span class="token punctuation">.</span>debug <span class="token operator">=</span> <span class="token boolean">True</span>
    ssl_context <span class="token operator">=</span> ssl<span class="token punctuation">.</span>create_default_context<span class="token punctuation">(</span>purpose<span class="token operator">=</span>ssl<span class="token punctuation">.</span>Purpose<span class="token punctuation">.</span>CLIENT_AUTH<span class="token punctuation">,</span> cafile<span class="token operator">=</span><span class="token string">'../cert/ca.crt'</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>load_cert_chain<span class="token punctuation">(</span>certfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">,</span> keyfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.key'</span></span><span class="token punctuation">,</span> password<span class="token operator">=</span><span class="token string">''</span><span class="token punctuation">)</span>
    <span class="token comment"># ssl_context.verify_mode = ssl.CERT_REQUIRED</span>
    app<span class="token punctuation">.</span>run<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">"0.0.0.0"</span><span class="token punctuation">,</span> port<span class="token operator">=</span>src_port<span class="token punctuation">,</span> ssl_context<span class="token operator">=</span>ssl_context<span class="token punctuation">,</span> use_reloader<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> extra_files<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>ssl.create_default_context</code> : flask에서 사용할 ssl context를 정의한다. 여기 <code v-pre>cafile</code>에 root ca 파일을 지정한다.</li>
<li><code v-pre>ssl_context.load_cert_chain</code> : cert와 key를 지정하여 인증서 체인을 설정한다.</li>
<li><code v-pre>ssl_context.verify_mode</code> : service A는 인증서 검증을 무시할 수 있도록 해당 옵션에 주석처리 한다.</li>
<li><code v-pre>app.run(..., extra_files=[f'../cert/{src}.crt'])</code> : 인증서가 변경되면 flask를 다시 시작하도록 구성한다.</li>
</ul>
<p>서비스 A의 경우 https로 접근할 수 있고, <code v-pre>ssl.CERT_REQUIRED</code> 옵션이 활성화 되어있지 않아 신뢰할 수 없는 인증서라도 curl로 <code v-pre>--insecure</code> 옵션을 추가하여 응답을 확인할 수 있다. 브라우저에서도 별도의 신뢰 확인을 통해 접근가능하다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> https://service-a.example.com:7443

curl: <span class="token punctuation">(</span><span class="token number">60</span><span class="token punctuation">)</span> SSL certificate problem: self signed certificate <span class="token keyword">in</span> certificate chain
More details here: https://curl.se/docs/sslcerts.html

<span class="token function">curl</span> failed to verify the legitimacy of the server and therefore could not
establish a secure connection to it. To learn <span class="token function">more</span> about this situation and
how to fix it, please visit the web page mentioned above.
$ <span class="token function">curl</span> <span class="token parameter variable">--insecure</span> https://service-a.example.com:7443

Hello from <span class="token string">"service-a"</span>% 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="check-curl-service-b" tabindex="-1"><a class="header-anchor" href="#check-curl-service-b" aria-hidden="true">#</a> Check Curl - Service B</h4>
<p>Python으로 작성된 flask api server 구성은 다음과 같다.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token comment"># main.py</span>

<span class="token comment">### 생략 ###</span>
<span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    app<span class="token punctuation">.</span>debug <span class="token operator">=</span> <span class="token boolean">True</span>
    ssl_context <span class="token operator">=</span> ssl<span class="token punctuation">.</span>create_default_context<span class="token punctuation">(</span>purpose<span class="token operator">=</span>ssl<span class="token punctuation">.</span>Purpose<span class="token punctuation">.</span>CLIENT_AUTH<span class="token punctuation">,</span> cafile<span class="token operator">=</span><span class="token string">'../cert/ca.crt'</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>load_cert_chain<span class="token punctuation">(</span>certfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">,</span> keyfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.key'</span></span><span class="token punctuation">,</span> password<span class="token operator">=</span><span class="token string">''</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>verify_mode <span class="token operator">=</span> ssl<span class="token punctuation">.</span>CERT_REQUIRED
    app<span class="token punctuation">.</span>run<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">"0.0.0.0"</span><span class="token punctuation">,</span> port<span class="token operator">=</span>src_port<span class="token punctuation">,</span> ssl_context<span class="token operator">=</span>ssl_context<span class="token punctuation">,</span> use_reloader<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> extra_files<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li><code v-pre>ssl_context.verify_mode = ssl.CERT_REQUIRED</code> 설정으로 인해 인증서 검증이 반드시 필요하도록 설정한다.</li>
</ul>
<p><code v-pre>--insecure</code> 옵션을 추가하더라도 서비스 B는 인증서를 요구한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">--insecure</span> https://service-b.example.com:8443
curl: <span class="token punctuation">(</span><span class="token number">56</span><span class="token punctuation">)</span> LibreSSL SSL_read: error:1404C45C:SSL routines:ST_OK:reason<span class="token punctuation">(</span><span class="token number">1116</span><span class="token punctuation">)</span>, errno <span class="token number">0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>따라서 요청시 root ca, cert(인증서), key를 함께 사용해야 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ <span class="token function">curl</span> <span class="token parameter variable">--cacert</span> ca.crt <span class="token parameter variable">--key</span> service-b.key <span class="token parameter variable">--cert</span> service-b.crt https://service-b.example.com:8443 
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="normal-mtls-check" tabindex="-1"><a class="header-anchor" href="#normal-mtls-check" aria-hidden="true">#</a> Normal mTLS Check</h4>
<p>서비스 A에서 B로 요청할 때 인증서 모두를 설정한 경우이다. 응답이 정상적으로 오는지 확인한다.</p>
<p><a href="https://service-a.example.com:7443/w-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/w-mtls<ExternalLinkIcon/></a></p>
<h4 id="without-cert" tabindex="-1"><a class="header-anchor" href="#without-cert" aria-hidden="true">#</a> Without Cert</h4>
<p>서비스 A에서 B로 요청할 때 A의 인증정보를 담지 않은 경우이다. 서비스 B에서 인증서를 요구하는 메시지가 출력된다.</p>
<p><a href="https://service-a.example.com:7443/wo-cert-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/wo-cert-mtls<ExternalLinkIcon/></a></p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token operator">#</span> 응답
SSLError<span class="token operator">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'[SSL: TLSV13_ALERT_CERTIFICATE_REQUIRED] tlsv13 alert certificate required'</span><span class="token operator">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="without-ca" tabindex="-1"><a class="header-anchor" href="#without-ca" aria-hidden="true">#</a> Without CA</h4>
<p>서비스 A에서 B로 요청할 때 root ca를 포함하지 않는 경우이다. 인증을 위한 자체 서명 인증서를 요구한다.</p>
<p><a href="https://service-a.example.com:7443/wo-ca-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/wo-ca-mtls<ExternalLinkIcon/></a></p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token operator">#</span> 응답
SSLError<span class="token operator">(</span>SSLCertVerificationError<span class="token operator">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: self signed certificate in certificate chain'</span><span class="token operator">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="with-expired-cert-service-a" tabindex="-1"><a class="header-anchor" href="#with-expired-cert-service-a" aria-hidden="true">#</a> With 'Expired' Cert - Service A</h4>
<blockquote>
<p>faketime : <a href="https://github.com/wolfcw/libfaketime" target="_blank" rel="noopener noreferrer">https://github.com/wolfcw/libfaketime<ExternalLinkIcon/></a></p>
</blockquote>
<p><code v-pre>faketime</code>을 사용하여 서비스 A의 인증서 만료 기간을 현재시간 이전으로 만든다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>faketime <span class="token string">'2023-01-01 00:00:00'</span> /bin/bash <span class="token parameter variable">-c</span> <span class="token string">'openssl x509 -req -days 30 -in service-a.csr -extfile service-a.ext -CA ca.crt -CAkey root.key -CAcreateserial -out service-a.crt'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>서비스 A가 보유한 인증서가 만료된 경우 인증서 만료됨을 표기한다. (서비스 B 인증서는 정상)</p>
<p><a href="https://service-a.example.com:7443/w-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/w-mtls<ExternalLinkIcon/></a></p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token operator">#</span> 응답
SSLError<span class="token operator">(</span>SSLError<span class="token operator">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'[SSL: SSLV3_ALERT_CERTIFICATE_EXPIRED] sslv3 alert certificate expired'</span><span class="token operator">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="with-expired-cert-service-b" tabindex="-1"><a class="header-anchor" href="#with-expired-cert-service-b" aria-hidden="true">#</a> With 'Expired' Cert - Service B</h4>
<blockquote>
<p>faketime : <a href="https://github.com/wolfcw/libfaketime" target="_blank" rel="noopener noreferrer">https://github.com/wolfcw/libfaketime<ExternalLinkIcon/></a></p>
</blockquote>
<p><code v-pre>faketime</code>을 사용하여 서비스 B의 인증서 만료 기간을 현재시간 이전으로 만든다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>faketime <span class="token string">'2023-01-01 00:00:00'</span> /bin/bash <span class="token parameter variable">-c</span> <span class="token string">'openssl x509 -req -days 30 -in service-b.csr -extfile service-b.ext -CA ca.crt -CAkey root.key -CAcreateserial -out service-b.crt'</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>서비스 B가 보유한 인증서가 만료된 경우 인증서 만료됨을 표기한다. (서비스 A 인증서는 정상)</p>
<p><a href="https://service-a.example.com:7443/w-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/w-mtls<ExternalLinkIcon/></a></p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code>SSLError<span class="token operator">(</span>SSLCertVerificationError<span class="token operator">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate has expired'</span><span class="token operator">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="with-different-cert-service-a-b" tabindex="-1"><a class="header-anchor" href="#with-different-cert-service-a-b" aria-hidden="true">#</a> With 'Different' Cert - Service A &amp; B</h4>
<p>A와 B의 인증서 Root CA가 다른 경우 인증서 서명이 다르므로 요청 실패한다. 아래와 같이 서비스 B를 위한 인증서를 root ca부터 새로 생성한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">cd</span> cert

openssl genrsa <span class="token parameter variable">-out</span> root-b.key <span class="token number">2048</span>

<span class="token function">chmod</span> <span class="token number">600</span> root-b.key

openssl req <span class="token parameter variable">-config</span> ca.conf <span class="token parameter variable">-extensions</span> usr_cert <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> root-b.key <span class="token parameter variable">-out</span> ca-b.csr

openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">3650</span> <span class="token parameter variable">-in</span> ca-b.csr <span class="token parameter variable">-signkey</span> root-b.key <span class="token parameter variable">-extfile</span> ca-b.ext <span class="token parameter variable">-out</span> ca-b.crt

openssl genrsa <span class="token parameter variable">-aes256</span> <span class="token parameter variable">-out</span> service-b-with-pw.key <span class="token number">2048</span>

openssl rsa <span class="token parameter variable">-in</span> service-b-with-pw.key <span class="token parameter variable">-out</span> service-b.key

openssl req <span class="token parameter variable">-new</span> <span class="token parameter variable">-key</span> service-b.key <span class="token parameter variable">-config</span> service-b.conf <span class="token parameter variable">-out</span> service-b.csr

openssl x509 <span class="token parameter variable">-req</span> <span class="token parameter variable">-days</span> <span class="token number">365</span> <span class="token parameter variable">-in</span> service-b.csr <span class="token parameter variable">-extfile</span> service-b.ext <span class="token parameter variable">-CA</span> ca-b.crt <span class="token parameter variable">-CAkey</span> root-b.key <span class="token parameter variable">-CAcreateserial</span> <span class="token parameter variable">-out</span> service-b.crt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>python_service_b</code>의 <code v-pre>main.py</code>에 서 ca 파일 이름을 변경한다.</p>
<div class="language-python line-numbers-mode" data-ext="py"><pre v-pre class="language-python"><code><span class="token keyword">if</span> __name__ <span class="token operator">==</span> <span class="token string">"__main__"</span><span class="token punctuation">:</span>
    app<span class="token punctuation">.</span>debug <span class="token operator">=</span> <span class="token boolean">True</span>
    ssl_context <span class="token operator">=</span> ssl<span class="token punctuation">.</span>create_default_context<span class="token punctuation">(</span>purpose<span class="token operator">=</span>ssl<span class="token punctuation">.</span>Purpose<span class="token punctuation">.</span>CLIENT_AUTH<span class="token punctuation">,</span> cafile<span class="token operator">=</span><span class="token string">'../cert/ca-b.crt'</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>load_cert_chain<span class="token punctuation">(</span>certfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">,</span> keyfile<span class="token operator">=</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.key'</span></span><span class="token punctuation">,</span> password<span class="token operator">=</span><span class="token string">''</span><span class="token punctuation">)</span>
    ssl_context<span class="token punctuation">.</span>verify_mode <span class="token operator">=</span> ssl<span class="token punctuation">.</span>CERT_REQUIRED
    app<span class="token punctuation">.</span>run<span class="token punctuation">(</span>host<span class="token operator">=</span><span class="token string">"0.0.0.0"</span><span class="token punctuation">,</span> port<span class="token operator">=</span>src_port<span class="token punctuation">,</span> ssl_context<span class="token operator">=</span>ssl_context<span class="token punctuation">,</span> use_reloader<span class="token operator">=</span><span class="token boolean">True</span><span class="token punctuation">,</span> extra_files<span class="token operator">=</span><span class="token punctuation">[</span><span class="token string-interpolation"><span class="token string">f'../cert/</span><span class="token interpolation"><span class="token punctuation">{</span>src<span class="token punctuation">}</span></span><span class="token string">.crt'</span></span><span class="token punctuation">]</span><span class="token punctuation">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>요청 시 서비스 A와 B의 서명이 달라 오류가 발생함을 확인한다.</p>
<p><a href="https://service-a.example.com:7443/w-mtls" target="_blank" rel="noopener noreferrer">https://service-a.example.com:7443/w-mtls<ExternalLinkIcon/></a></p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code>SSLError<span class="token operator">(</span>SSLCertVerificationError<span class="token operator">(</span><span class="token number">1</span><span class="token punctuation">,</span> <span class="token string">'[SSL: CERTIFICATE_VERIFY_FAILED] certificate verify failed: certificate signature failure'</span><span class="token operator">)</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>테스트가 끝났으면 다시 root ca 파일을 원래의 같은 <code v-pre>ca.crt</code> 파일로 지정한다.</p>
<h2 id="_4-vault-pki-setup" tabindex="-1"><a class="header-anchor" href="#_4-vault-pki-setup" aria-hidden="true">#</a> 4. Vault PKI Setup</h2>
<blockquote>
<p>Vault Download : <a href="https://releases.hashicorp.com/vault/" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/vault/<ExternalLinkIcon/></a></p>
</blockquote>
<p>Vault의 인증서 관리 및 자동화 관리 방안을 설명한다.</p>
<h3 id="_4-1-run-vault" tabindex="-1"><a class="header-anchor" href="#_4-1-run-vault" aria-hidden="true">#</a> 4.1 Run Vault</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault server <span class="token parameter variable">-dev</span> -dev-root-token-id<span class="token operator">=</span>root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-2-set-env-for-vault" tabindex="-1"><a class="header-anchor" href="#_4-2-set-env-for-vault" aria-hidden="true">#</a> 4.2 Set env for Vault</h3>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token builtin class-name">export</span> <span class="token assign-left variable">VAULT_ADDR</span><span class="token operator">=</span><span class="token string">'http://127.0.0.1:8200'</span>
$ vault login

Token <span class="token punctuation">(</span>will be hidden<span class="token punctuation">)</span>: root
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-3-enable-pki-setup" tabindex="-1"><a class="header-anchor" href="#_4-3-enable-pki-setup" aria-hidden="true">#</a> 4.3 Enable PKI &amp; Setup</h3>
<h4 id="pki-엔진-활성화" tabindex="-1"><a class="header-anchor" href="#pki-엔진-활성화" aria-hidden="true">#</a> PKI 엔진 활성화</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault secrets <span class="token builtin class-name">enable</span> pki
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="pki-엔진-ttl-tuning" tabindex="-1"><a class="header-anchor" href="#pki-엔진-ttl-tuning" aria-hidden="true">#</a> PKI 엔진 TTL tuning</h4>
<p>Vault 기본 <code v-pre>Max TTL</code>은 32일(786h) 이므로 원하는 <code v-pre>TTL</code>로 변경한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault secrets tune -max-lease-ttl<span class="token operator">=</span>87600h pki
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="root-ca-생성" tabindex="-1"><a class="header-anchor" href="#root-ca-생성" aria-hidden="true">#</a> root CA 생성</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> pki/root/generate/internal <span class="token punctuation">\</span>
    <span class="token assign-left variable">key_bits</span><span class="token operator">=</span><span class="token number">2048</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">private_key_format</span><span class="token operator">=</span>pem <span class="token punctuation">\</span>
    <span class="token assign-left variable">signature_bits</span><span class="token operator">=</span><span class="token number">256</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">country</span><span class="token operator">=</span>KR <span class="token punctuation">\</span>
    <span class="token assign-left variable">province</span><span class="token operator">=</span>Seoul <span class="token punctuation">\</span>
    <span class="token assign-left variable">locality</span><span class="token operator">=</span>KR <span class="token punctuation">\</span>
    <span class="token assign-left variable">organization</span><span class="token operator">=</span>COMPANY <span class="token punctuation">\</span>
    <span class="token assign-left variable">ou</span><span class="token operator">=</span>DEV <span class="token punctuation">\</span>
    <span class="token assign-left variable">common_name</span><span class="token operator">=</span>example.com <span class="token punctuation">\</span>
    <span class="token assign-left variable">ttl</span><span class="token operator">=</span>87600h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="crl-생성" tabindex="-1"><a class="header-anchor" href="#crl-생성" aria-hidden="true">#</a> CRL 생성</h4>
<p>Certificate Revocation List(인증서 해지 목록) 엔드포인트 작성</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> pki/config/urls <span class="token punctuation">\</span>
    <span class="token assign-left variable">issuing_certificates</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:8200/v1/pki/ca"</span> <span class="token punctuation">\</span>
    <span class="token assign-left variable">crl_distribution_points</span><span class="token operator">=</span><span class="token string">"http://127.0.0.1:8200/v1/pki/crl"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="role-생성" tabindex="-1"><a class="header-anchor" href="#role-생성" aria-hidden="true">#</a> Role 생성</h4>
<p>미리 Role을 구성해 놓으면 사용자 및 앱은 지정된 규칙에 따라 인증서를 발급받을 수 있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> pki/roles/example-dot-com <span class="token punctuation">\</span>
    <span class="token assign-left variable">allowed_domains</span><span class="token operator">=</span>example.com <span class="token punctuation">\</span>
    <span class="token assign-left variable">allow_subdomains</span><span class="token operator">=</span>true <span class="token punctuation">\</span>
    <span class="token assign-left variable">max_ttl</span><span class="token operator">=</span>72h
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="발급-테스트" tabindex="-1"><a class="header-anchor" href="#발급-테스트" aria-hidden="true">#</a> 발급 테스트</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> pki/issue/example-dot-com <span class="token punctuation">\</span>
    <span class="token assign-left variable">common_name</span><span class="token operator">=</span>service-a.example.com
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-4-vault-agent-setup" tabindex="-1"><a class="header-anchor" href="#_4-4-vault-agent-setup" aria-hidden="true">#</a> 4.4 Vault Agent Setup</h3>
<blockquote>
<p><code v-pre>vault_agent</code> 디렉토리에서 작업한다.</p>
</blockquote>
<p>Vault Agent는 볼트가 가지고 있는 시크릿 정보를 발급 및 <code v-pre>TTL</code> 만료 시 자동 갱신해주는 역할을 수행한다.</p>
<h4 id="policy-추가" tabindex="-1"><a class="header-anchor" href="#policy-추가" aria-hidden="true">#</a> Policy 추가</h4>
<p>Vault Agent가 취득할 정책을 추가한다. 앞서 생성한 PKI 시크릿 엔진에 대한 권한이 설정되어있다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault policy <span class="token function">write</span> pki pki_policy.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h4 id="vault-agent를-위한-approle인증-추가" tabindex="-1"><a class="header-anchor" href="#vault-agent를-위한-approle인증-추가" aria-hidden="true">#</a> Vault Agent를 위한 approle인증 추가</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault auth <span class="token builtin class-name">enable</span> approle
Success<span class="token operator">!</span> Enabled approle auth method at: approle/

$ vault <span class="token function">write</span> auth/approle/role/pki-agent <span class="token punctuation">\</span>
    <span class="token assign-left variable">secret_id_ttl</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_ttl</span><span class="token operator">=</span>60m <span class="token punctuation">\</span>
    <span class="token assign-left variable">token_max_tll</span><span class="token operator">=</span>120m <span class="token punctuation">\</span>
    <span class="token assign-left variable">policies</span><span class="token operator">=</span><span class="token string">"pki"</span>
Success<span class="token operator">!</span> Data written to: auth/approle/role/pki-agent

$ vault <span class="token builtin class-name">read</span> auth/approle/role/pki-agent/role-id
Key        Value
---        -----
role_id    dfa2a248-1e1b-e2e9-200c-69c63b9ca447

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> auth/approle/role/pki-agent/secret-id
Key                   Value
---                   -----
secret_id             864360c1-c79f-ea7c-727b-7752361fe1ba
secret_id_accessor    3cc068e2-a172-2bb1-c097-b777c3525ba6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="vault-agent가-사용할-roleid-secretid-저장" tabindex="-1"><a class="header-anchor" href="#vault-agent가-사용할-roleid-secretid-저장" aria-hidden="true">#</a> Vault Agent가 사용할 RoleID, SecretID 저장</h4>
<p>Vault Agent 실행 시 approle 인증방식을 사용하도록 구성하는 예제로, <code v-pre>role_id</code>와 <code v-pre>secret_id</code>가 필요하다. Vault Agent 재기동시에는 <code v-pre>secret_id</code>를 재발급 해야 한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ vault <span class="token builtin class-name">read</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>role_id auth/approle/role/pki-agent/role-id <span class="token operator">></span> roleid

$ vault <span class="token function">write</span> <span class="token parameter variable">-f</span> <span class="token parameter variable">-field</span><span class="token operator">=</span>secret_id auth/approle/role/pki-agent/secret-id <span class="token operator">></span> secretid
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="template-확인" tabindex="-1"><a class="header-anchor" href="#template-확인" aria-hidden="true">#</a> Template 확인</h4>
<p>Vault Agent는 Template에 따라 시크릿을 특정 파일로 랜더링하는 기능을 갖고 있다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token comment"># ca-a.tpl</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span>- <span class="token comment">/* ca-a.tpl */</span> -<span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> with secret <span class="token string">"pki/issue/example-dot-com"</span> <span class="token string">"common_name=service-a.example.com"</span> <span class="token string">"ttl=2m"</span> <span class="token punctuation">}</span><span class="token punctuation">}</span>
<span class="token punctuation">{</span><span class="token punctuation">{</span> .Data.issuing_ca <span class="token punctuation">}</span><span class="token punctuation">}</span><span class="token punctuation">{</span><span class="token punctuation">{</span> end <span class="token punctuation">}</span><span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>위 구문은 <code v-pre>pki/issue/example-dot-com</code> 에서 <code v-pre>common_name=service-a.example.com</code> 인 인증서를 발급하는 것으로, 테스트를 위해 <code v-pre>ttl=2m</code>로 짧게 설정하였다. 볼트로 부터 받는 결과 중에서 <code v-pre>issuing_ca</code> 값을 랜더링한다.</p>
<p><code v-pre>vault_agent.hcl</code>에서는 위 Template에 대한 랜더링 결과를 특정 파일로 저장하도록 명시한다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code><span class="token keyword">template</span> <span class="token punctuation">{</span>
  <span class="token property">source</span>      <span class="token punctuation">=</span> <span class="token string">"ca-a.tpl"</span>
  <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"../cert/ca.crt"</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="vault-agent-실행" tabindex="-1"><a class="header-anchor" href="#vault-agent-실행" aria-hidden="true">#</a> Vault Agent 실행</h4>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault agent <span class="token parameter variable">-config</span><span class="token operator">=</span>vault_agent.hcl -log-level<span class="token operator">=</span>debug
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>지정된 <code v-pre>TTL</code> 간격마다 템플릿 랜더링 로그 확인한다.</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code><span class="token punctuation">.</span><span class="token punctuation">.</span><span class="token punctuation">.</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendering <span class="token string">"ca-a.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/ca.crt"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> checking template <span class="token hash constant">a04612e63b9a03a45ef968a8984a23db</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendering <span class="token string">"cert-a.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-a.crt"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> checking template <span class="token hash constant">850589d81f7afe64c7c5a0a8440c8569</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendering <span class="token string">"key-a.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-a.key"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> checking template <span class="token hash constant">60e7f2683d2c76a501eb54879bf89ad2</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.312+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendering <span class="token string">"cert-b.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-b.crt"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.333+0900</span> <span class="token punctuation">[</span><span class="token level info keyword">INFO</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendered <span class="token string">"cert-b.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-b.crt"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.333+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> checking template <span class="token hash constant">1fb22b9f15857b7eeb0b68a3c9ac6d20</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.334+0900</span> <span class="token punctuation">[</span><span class="token level debug keyword">DEBUG</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendering <span class="token string">"key-b.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-b.key"</span>
<span class="token date number">2023-03-18T</span><span class="token time number">22:29:09.354+0900</span> <span class="token punctuation">[</span><span class="token level info keyword">INFO</span><span class="token punctuation">]</span> <span class="token operator">(</span>runner<span class="token operator">)</span> rendered <span class="token string">"key-b.tpl"</span> <span class="token operator">=</span><span class="token operator">></span> <span class="token string">"../cert/service-b.key"</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>랜더링이 완료되고, 파일이 갱신되면 Python의 Flask 설정의 <code v-pre>extra_files</code> 항목이 변경되므로 재시작되어 인증서를 다시 읽어온다.</p>
<div class="language-log line-numbers-mode" data-ext="log"><pre v-pre class="language-log"><code> <span class="token operator">*</span> Detected change in <span class="token string">'/vault-examples/mtls-pki/cert/130906523'</span><span class="token punctuation">,</span> reloading
 <span class="token operator">*</span> Detected change in <span class="token string">'/vault-examples/mtls-pki/cert/service-a.crt'</span><span class="token punctuation">,</span> reloading
 <span class="token operator">*</span> Restarting with watchdog <span class="token operator">(</span>fsevents<span class="token operator">)</span>
 <span class="token operator">*</span> Debugger is active<span class="token operator">!</span>
 <span class="token operator">*</span> Debugger PIN<span class="token operator">:</span> <span class="token number">136</span><span class="token operator">-</span><span class="token number">647</span><span class="token operator">-</span><span class="token number">438</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>변경된 인증서를 확인해보면 갱신된 유효기간을 확인할 수 있고, 브라우저에서도 인증서 보기를 통해 변경된 인증서의 유효기간을 확인할 수 있다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Monosnap 2023-03-19 14-44-08.png" alt="Monosnap 2023-03-19 14-44-08" tabindex="0" loading="lazy"><figcaption>Monosnap 2023-03-19 14-44-08</figcaption></figure>
<h2 id="_5-nomad-연계" tabindex="-1"><a class="header-anchor" href="#_5-nomad-연계" aria-hidden="true">#</a> 5. Nomad 연계</h2>
<p>인증서 같은 시크릿은 파일 형태로 관리되는데, 이런 파일이 변경되면 애플리케이션 또는 웹서버나 솔루션에서 감지하는 구성이 필요하다. 데모 앱인 Python의 Flask에서는 Debug모드에 <code v-pre>extra_files</code>에 인증서를 지정하여 변경되는 인증서를 감지하도록 하였으나 이는 운영에서는 권장되지 않는 방식이며 인증서 교체와 함께 <code v-pre>watch</code>, <code v-pre>reload</code>, <code v-pre>restart</code>에 대한 동작이 요구된다.</p>
<p>애플리케이션에서 내부적으로 코드 구현을 통해 이를 교체하는 방법도 있으나, mTLS가 적용되는 코드 전반에 변경이 필요하므로 HasihCorp Nomad같은 Vault 연계된 애플리케이션 오케스트레이터를 활용할 수 있다.</p>
<p>Vault의 인증서 관리 및 자동화 관리 방안을 Nomad와 연계하여 설명한다.</p>
<blockquote>
<p>Nomad Download : <a href="https://releases.hashicorp.com/nomad/" target="_blank" rel="noopener noreferrer">https://releases.hashicorp.com/nomad/<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>Vault 서버는 그대로 두고, PKI를 기존것을 사용한다.</li>
<li>서비스 A와 B는 종료한다.</li>
<li>Vault Agent는 종료한다.</li>
</ul>
<p>준비된 Policy 및 Job은 <code v-pre>nomad</code> 디렉토리에 있다.</p>
<h3 id="_4-1-nomad-policy를-vault에-생성-및-nomad-실행" tabindex="-1"><a class="header-anchor" href="#_4-1-nomad-policy를-vault에-생성-및-nomad-실행" aria-hidden="true">#</a> 4.1 Nomad Policy를 Vault에 생성 및 Nomad 실행</h3>
<p>Nomad 에 부여할 Vault의 정책을 생성한다.</p>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>vault policy write nomad-server nomad_policy.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Nomad 에서 사용할 Token Role을 생성한다. Nomad에서 허용되는 정책은 앞서 생성한 <code v-pre>pki</code> 이다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault <span class="token function">write</span> auth/token/roles/nomad-cluster <span class="token assign-left variable">allowed_policies</span><span class="token operator">=</span><span class="token string">"pki"</span> <span class="token assign-left variable">disallowed_policies</span><span class="token operator">=</span>nomad-server <span class="token assign-left variable">token_explicit_max_ttl</span><span class="token operator">=</span><span class="token number">0</span> <span class="token assign-left variable">orphan</span><span class="token operator">=</span>true <span class="token assign-left variable">token_period</span><span class="token operator">=</span><span class="token string">"259200"</span> <span class="token assign-left variable">renewable</span><span class="token operator">=</span>true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>생성한 Token Role 기반으로 Nomad와의 설정에 사용할 Token을 하나 발급한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>vault token create <span class="token parameter variable">-field</span> token <span class="token parameter variable">-policy</span> nomad-server <span class="token parameter variable">-period</span> 72h <span class="token parameter variable">-orphan</span> <span class="token operator">></span> /tmp/token.txt
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>Nomad를 실행한다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>$ nomad agent <span class="token parameter variable">-dev</span> -vault-enabled<span class="token operator">=</span>true -vault-address<span class="token operator">=</span>http://127.0.0.1:8200 -vault-token<span class="token operator">=</span><span class="token variable"><span class="token variable">$(</span><span class="token function">cat</span> /tmp/token.txt<span class="token variable">)</span></span> -vault-tls-skip-verify<span class="token operator">=</span>true -vault-create-from-role<span class="token operator">=</span>nomad-cluster

<span class="token operator">==</span><span class="token operator">></span> No configuration files loaded
<span class="token operator">==</span><span class="token operator">></span> Starting Nomad agent<span class="token punctuation">..</span>.
<span class="token operator">==</span><span class="token operator">></span> Nomad agent configuration:

       Advertise Addrs: HTTP: <span class="token number">127.0</span>.0.1:4646<span class="token punctuation">;</span> RPC: <span class="token number">127.0</span>.0.1:4647<span class="token punctuation">;</span> Serf: <span class="token number">127.0</span>.0.1:4648
            Bind Addrs: HTTP: <span class="token punctuation">[</span><span class="token number">127.0</span>.0.1:4646<span class="token punctuation">]</span><span class="token punctuation">;</span> RPC: <span class="token number">127.0</span>.0.1:4647<span class="token punctuation">;</span> Serf: <span class="token number">127.0</span>.0.1:4648
                Client: <span class="token boolean">true</span>
             Log Level: DEBUG
                Region: global <span class="token punctuation">(</span>DC: dc1<span class="token punctuation">)</span>
                Server: <span class="token boolean">true</span>
               Version: <span class="token number">1.5</span>.1

<span class="token operator">==</span><span class="token operator">></span> Nomad agent started<span class="token operator">!</span> Log data will stream <span class="token keyword">in</span> below:
<span class="token punctuation">..</span>.
    <span class="token number">2023</span>-03-19T15:34:30.081+0900 <span class="token punctuation">[</span>DEBUG<span class="token punctuation">]</span> nomad.vault: starting renewal loop: <span class="token assign-left variable">creation_ttl</span><span class="token operator">=</span>72h0m0s
    <span class="token number">2023</span>-03-19T15:34:30.082+0900 <span class="token punctuation">[</span>DEBUG<span class="token punctuation">]</span> nomad.vault: successfully renewed server token
    <span class="token number">2023</span>-03-19T15:34:30.082+0900 <span class="token punctuation">[</span>INFO<span class="token punctuation">]</span>  nomad.vault: successfully renewed token: <span class="token assign-left variable">next_renewal</span><span class="token operator">=</span>35h59m59.999944054s
<span class="token punctuation">..</span>.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="_4-2-set-env-for-nomad" tabindex="-1"><a class="header-anchor" href="#_4-2-set-env-for-nomad" aria-hidden="true">#</a> 4.2 Set env for Nomad</h3>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>export NOMAD_ADDR='http://127.0.0.1:4646'
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_4-3-job-spec-설명" tabindex="-1"><a class="header-anchor" href="#_4-3-job-spec-설명" aria-hidden="true">#</a> 4.3 Job spec 설명</h3>
<p>Nomad Job을 해석하면 다음과 같다.</p>
<div class="language-hcl line-numbers-mode" data-ext="hcl"><pre v-pre class="language-hcl"><code>job <span class="token string">"mtls-service-a"</span> <span class="token punctuation">{</span>
  <span class="token property">datacenters</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"dc1"</span><span class="token punctuation">]</span>

  <span class="token property">type</span> <span class="token punctuation">=</span> <span class="token string">"service"</span>

  group <span class="token string">"service"</span> <span class="token punctuation">{</span>
    <span class="token property">count</span> <span class="token punctuation">=</span> <span class="token number">1</span>

    <span class="token keyword">network</span> <span class="token punctuation">{</span>
      port <span class="token string">"https"</span> <span class="token punctuation">{</span>
        <span class="token property">static</span> <span class="token punctuation">=</span> <span class="token number">7433</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    
    <span class="token comment"># vault에서 할당받을 Polocy를 명시 한다.</span>
    <span class="token comment"># 해당 Policy로 생성되는 Token의 변경시 동작은 change_mode에서 지정한다.</span>
    <span class="token keyword">vault</span> <span class="token punctuation">{</span>
      <span class="token property">namespace</span> <span class="token punctuation">=</span> <span class="token string">""</span>
      <span class="token property">policies</span> <span class="token punctuation">=</span> <span class="token punctuation">[</span><span class="token string">"pki"</span><span class="token punctuation">]</span>
      <span class="token property">change_mode</span> <span class="token punctuation">=</span> <span class="token string">"noop"</span>
    <span class="token punctuation">}</span>

    task <span class="token string">"python-task"</span> <span class="token punctuation">{</span>
      <span class="token property">driver</span> <span class="token punctuation">=</span> <span class="token string">"raw_exec"</span>

      <span class="token keyword">config</span> <span class="token punctuation">{</span>
        <span class="token property">command</span> <span class="token punctuation">=</span> <span class="token string">"local/start.sh"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
#!/bin/bash
cp -R /Users/gs/workspaces/hashicorp_example/vault-examples/mtls-pki/python_service_a python_service_a
cd python_service_a
pip install requests flask
python main.py
      EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"local/start.sh"</span>
      <span class="token punctuation">}</span>
      
      <span class="token comment"># Vault Agent에서 구성했던 Template이 Job내에 정의된다.</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
{{- /* ca-a.tpl */ -}}
{{ with secret "pki/issue/example-dot-com" "common_name=service-a.example.com" "ttl=2m" }}
{{ .Data.issuing_ca }}{{ end }}
      EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/cert/ca.crt"</span>
        <span class="token property">change_mode</span> <span class="token punctuation">=</span> <span class="token string">"noop"</span>
      <span class="token punctuation">}</span>
      <span class="token comment"># 인증서가 변경되는 경우 change_mode에 지정된 restart를 통해 Job을 재시작한다.</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
{{- /* cert-a.tpl */ -}}
{{ with secret "pki/issue/example-dot-com" "common_name=service-a.example.com" "ttl=2m" }}
{{ .Data.certificate }}{{ end }}
      EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/cert/service-a.crt"</span>
        <span class="token property">change_mode</span> <span class="token punctuation">=</span> <span class="token string">"restart"</span>
      <span class="token punctuation">}</span>
      <span class="token keyword">template</span> <span class="token punctuation">{</span>
        <span class="token property">data</span> <span class="token punctuation">=</span> <span class="token heredoc string">&lt;&lt;EOH
{{- /* key-a.tpl */ -}}
{{ with secret "pki/issue/example-dot-com" "common_name=service-a.example.com" "ttl=2m" }}
{{ .Data.private_key }}{{ end }}
      EOH</span>
        <span class="token property">destination</span> <span class="token punctuation">=</span> <span class="token string">"/cert/service-a.key"</span>
        <span class="token property">change_mode</span> <span class="token punctuation">=</span> <span class="token string">"noop"</span>
      <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code v-pre>change_mode</code> 의 경우 인증서 변경후 동작을 정의하는데,</p>
<ul>
<li><code v-pre>noop</code>은 아무 동작도 수행하지 않음을 의미한다.</li>
<li><code v-pre>restart</code>는 Job을 재시작한다.</li>
<li><code v-pre>signal</code>은 system signal을 호출하며, systemctl로 실행되는 프로세스의 경우 <code v-pre>SIGHUP</code>을 지정하면 reload 동작이 발생한다.</li>
</ul>
<h3 id="_4-4-job-실행" tabindex="-1"><a class="header-anchor" href="#_4-4-job-실행" aria-hidden="true">#</a> 4.4 Job 실행</h3>
<p>앞서 Python을 직접 실행했던것과 같이 Nomad 를 통해 Python을 실행하며, 조건은 동일하다. Flask에서 파일 체크를 위해 추가했던 <code v-pre>extra_files</code>는 삭제해도 된다.</p>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code>nomad job run service_a_job.hcl
nomad job run service_b_job.hcl
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Jobs - Nomad 2023-03-19.png" alt="Jobs - Nomad 2023-03-19" tabindex="0" loading="lazy"><figcaption>Jobs - Nomad 2023-03-19</figcaption></figure>
<p>Vault 에서 가져온 인증서가 변경되면 <code v-pre>change_mode</code>에 정의된 <code v-pre>restart</code> 에 의해 애플리케이션을 자동 재시작 한다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Task python-task logs - Nomad 2023-03-19 16-55-40.png" alt="Task python-task logs - Nomad 2023-03-19 16-55-40" tabindex="0" loading="lazy"><figcaption>Task python-task logs - Nomad 2023-03-19 16-55-40</figcaption></figure>
<h2 id="_5-consul의-mtls" tabindex="-1"><a class="header-anchor" href="#_5-consul의-mtls" aria-hidden="true">#</a> 5. Consul의 mTLS</h2>
<p>Consul에서는 mTLS를 위한 인증서를 각 애플리케이션에서 분리하여 envoy로 구현된 proxy에서 이를 대체한다. 따라서 애플리케이션에는 별도 mTLS 구현이 불필요하며, 인증서 교체를 Consul이 제공하는 proxy가 담당하게 된다.</p>
<p>Consul Service Mesh에서 기본 제공하는 mTLS를 사용하는 경우 장점은</p>
<ul>
<li>애플리케이션 개발에 mTLS 및 인증서 관리가 불필요하다.</li>
<li>Consul 내에서 인증서가 자동 교체된다.</li>
<li>mTLS의 서비스 간 인증 외에 Intention과 같은 서비스 요청에 대한 방향성을 지정 가능하다.</li>
</ul>
<p>단점은 Consul의 Control Plane과 Data Plane을 구분하는 동작으로 인해 추가적인 리소스가 발생한다는 점이다.</p>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Service Mesh Certificate Authority - Overview | Consul | HashiCorp Developer 2023-03-19 17-23-03.png" alt="Service Mesh Certificate Authority - Overview | Consul | HashiCorp Developer 2023-03-19 17-23-03" tabindex="0" loading="lazy"><figcaption>Service Mesh Certificate Authority - Overview | Consul | HashiCorp Developer 2023-03-19 17-23-03</figcaption></figure>
<figure><img src="https://raw.githubusercontent.com/Great-Stone/images/master/uPic/Load Balancing Services in Consul Service Mesh with Envoy | Consul | HashiCorp Developer 2023-03-19 17-25-21.png" alt="Load Balancing Services in Consul Service Mesh with Envoy | Consul | HashiCorp Developer 2023-03-19 17-25-21" tabindex="0" loading="lazy"><figcaption>Load Balancing Services in Consul Service Mesh with Envoy | Consul | HashiCorp Developer 2023-03-19 17-25-21</figcaption></figure>
</div></template>


