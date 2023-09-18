<template><div><h1 id="homebrew-install-certificate-has-expired" tabindex="-1"><a class="header-anchor" href="#homebrew-install-certificate-has-expired" aria-hidden="true">#</a> homebrew install - certificate has expired</h1>
<ul>
<li>현상 : brew 설치시 인증서 에러 발생</li>
</ul>
<blockquote>
<p><a href="https://apple.stackexchange.com/questions/393481/homebrew-cask-download-failure-ssl-certificate-problem-certificate-has-expired" target="_blank" rel="noopener noreferrer">https://apple.stackexchange.com/questions/393481/homebrew-cask-download-failure-ssl-certificate-problem-certificate-has-expired<ExternalLinkIcon/></a></p>
</blockquote>
<ul>
<li>오류 내용 :</li>
</ul>
<div class="language-text line-numbers-mode" data-ext="text"><pre v-pre class="language-text"><code>Already downloaded: /Users/gslee/Library/Caches/Homebrew/downloads/b6ccc5a2a602c2af3480bbcf1656bd9844595974ba60501871ac12504508e818--openssl-1.1.1l.tar.gz
==> Downloading https://ftp.gnu.org/gnu/wget/wget-1.21.2.tar.gz

curl: (60) SSL certificate problem: certificate has expired
More details here: https://curl.haxx.se/docs/sslcerts.html

curl performs SSL certificate verification by default, using a "bundle"
 of Certificate Authority (CA) public keys (CA certs). If the default
 bundle file isn't adequate, you can specify an alternate file
 using the --cacert option.
If this HTTPS server uses a certificate signed by a CA represented in
 the bundle, the certificate verification probably failed due to a
 problem with the certificate (it might be expired, or the name might
 not match the domain name in the URL).
If you'd like to turn off curl's verification of the certificate, use
 the -k (or --insecure) option.
HTTPS-proxy has similar options --proxy-cacert and --proxy-insecure.
Error: wget: Failed to download resource "wget"
Download failed: https://ftp.gnu.org/gnu/wget/wget-1.21.2.tar.gz
</code></pre><div class="highlight-lines"><br><br><br><div class="highlight-line">&nbsp;</div><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br></div><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul>
<li>
<p>원인 : 다운로드를 위한 링크의 인증서가 만료된 경우 brew에서 다운로드를 위해 사용하는 curl에서 인증서 오류 발생</p>
</li>
<li>
<p>해결방안 :</p>
<ul>
<li>curl 에 curlrc를 사용하도록 설치
<ul>
<li><code v-pre>~/.curlrc</code> 파일에 <code v-pre>--insecure</code> 추가</li>
<li><code v-pre>HOMEBREW_CURLRC</code> 환경변수를 enable 하여 curl 설치</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">HOMEBREW_CURLRC</span><span class="token operator">=</span><span class="token number">1</span> brew <span class="token function">install</span> <span class="token function">curl</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><ul>
<li>이후 패키지 재설치ㅉ</li>
</ul>
</li>
<li>기존 설정으로 원복하고 옵션으로 <code v-pre>--insecure</code>를 활성화
<ul>
<li><code v-pre>~/.curlrc</code> 파일을 삭제하거나 해당 파일에서 <code v-pre>--insecure</code> 삭제</li>
<li>필요시 <code v-pre>HOMEBREW_FORCE_BREWED_CURL</code> 환경변수를 enable 하여 사용</li>
</ul>
<div class="language-bash line-numbers-mode" data-ext="sh"><pre v-pre class="language-bash"><code><span class="token assign-left variable">HOMEBREW_FORCE_BREWED_CURL</span><span class="token operator">=</span><span class="token number">1</span> brew <span class="token function">install</span> <span class="token function">curl</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div></li>
</ul>
</li>
</ul>
</div></template>


