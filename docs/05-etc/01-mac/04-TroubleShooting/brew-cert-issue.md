---
meta:
  - name: description
    content: homebrew install certificate has expired
tags: ["mac", "homebrew", "brew"]
---

# homebrew install - certificate has expired

- 현상 : brew 설치시 인증서 에러 발생
> <https://apple.stackexchange.com/questions/393481/homebrew-cask-download-failure-ssl-certificate-problem-certificate-has-expired>

- 오류 내용 : 
```
Already downloaded: /Users/gslee/Library/Caches/Homebrew/downloads/b6ccc5a2a602c2af3480bbcf1656bd9844595974ba60501871ac12504508e818--openssl-1.1.1l.tar.gz
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
```

- 원인 : 다운로드를 위한 링크의 인증서가 만료된 경우 brew에서 다운로드를 위해 사용하는 curl에서 인증서 오류 발생


- 해결방안 :
    - curl 에 curlrc를 사용하도록 설치    
        - `~/.curlrc` 파일에 `--insecure` 추가
        - `HOMEBREW_CURLRC` 환경변수를 enable 하여 curl 설치
        ```bash
        HOMEBREW_CURLRC=1 brew install curl
        ```
        - 이후 패키지 재설치ㅉ
    - 기존 설정으로 원복하고 옵션으로 `--insecure`를 활성화
        - `~/.curlrc` 파일을 삭제하거나 해당 파일에서 `--insecure` 삭제
        - 필요시 `HOMEBREW_FORCE_BREWED_CURL` 환경변수를 enable 하여 사용
        ```bash
        HOMEBREW_FORCE_BREWED_CURL=1 brew install curl
        ```