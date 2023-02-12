---
meta:
  - name: description
    content: Vault 개발 모드 실행시 옵션 값 설명
tags: ["vault", "optinos"]
---

# Vault Development Mode Options

볼트 개발 모드 서버를 시작하는 기초적인 커맨드와 실행 후 안내 메시지는 다음과 같다.

```bash
$ vault server -dev

==> Vault server configuration:

             Api Address: http://127.0.0.1:8200
                     Cgo: disabled
         Cluster Address: https://127.0.0.1:8201
   Environment Variables: HOME, ITERM_PROFILE, ...
              Go Version: go1.19.4
              Listener 1: tcp (addr: "127.0.0.1:8200", cluster address: "127.0.0.1:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "disabled")
               Log Level: info
                   Mlock: supported: false, enabled: false
           Recovery Mode: false
                 Storage: inmem
                 Version: Vault v1.12.3, built 2023-02-02T09:07:27Z
             Version Sha: 209b3dd99fe8ca320340d08c70cff5f620261f9b

==> Vault server started! Log data will stream in below:

...
```

개발 모드에서 제공하는 옵션을 확인하기 위해 `vault server -h` 커맨드를 실행하면 하단에서 `Dev Opstions`를 확인할 수 있다.

```bash
$ vault server -h

...
Dev Options:

  -dev
      Enable development mode. In this mode, Vault runs in-memory and starts
      unsealed. As the name implies, do not run "dev" mode in production. The
      default is false.

  -dev-listen-address=<string>
      Address to bind to in "dev" mode. The default is 127.0.0.1:8200. This
      can also be specified via the VAULT_DEV_LISTEN_ADDRESS environment
      variable.

  -dev-no-store-token
      Do not persist the dev root token to the token helper (usually the local
      filesystem) for use in future requests. The token will only be displayed
      in the command output. The default is false.

  -dev-root-token-id=<string>
      Initial root token. This only applies when running in "dev" mode.
      This can also be specified via the VAULT_DEV_ROOT_TOKEN_ID environment
      variable.

  -dev-tls
      Enable TLS development mode. In this mode, Vault runs in-memory and
      starts unsealed, with a generated TLS CA, certificate and key. As the
      name implies, do not run "dev-tls" mode in production. The default is
      false.

  -dev-tls-cert-dir=<string>
      Directory where generated TLS files are created if `-dev-tls` is
      specified. If left unset, files are generated in a temporary directory.
```

개발 모드로 실행하는 `-dev `  옵션 외 다른 옵션에 대한 설명은 다음과 같다.

- `-dev-listen-address` : 기본은 `127.0.0.1:8200`이며, 변경을 원하는 경우 여기 입력한다. `VAULT_DEV_LISTEN_ADDRESS` 환경변수로도 대체 가능하다.
- `-dev-no-store-token` : 개발 모드시 사용자 디렉토리에 저장되는 `.vault-token`을 생성하지 않는 경우 `true`로 설정한다.
- `-dev-root-token-id`: `Root Token`은 임의의 값으로 생성되는데, 개발 모드 한정으로 사용자가 지정한 문자열로 정의할 수 있다.
- `-dev-tls` : 개발 모드를 위한 임시 TLS 인증서를 적용하고 `Api Address`를 `HTTPS`로 설정한다. 실행 후 출력에 `VAULT_CACERT` 로 임의 생성된 인증서 위치와 설정을 출력한다.
- `-dev-tls-cert-dir`: `-dev-tls`가 적용된 경우 사용자가 보유한 인증서를 적용하려는 경우 대상 디렉토리를 지정한다.



다음과 같이 옵션을 적용한 개발 모드 볼트를 실행하면, `Api Address`가 지정된 주소로 설정되고, `.vault-token`은 생성되지 않고, `Root Token`이 `root`로 설정되고, 생성된 인증서 위치와 커맨드 실행에 필요한  `VAULT_CACERT`가 출력되는 것을 확인할 수 있다.

```bash
$ vault server -dev -dev-listen-address=0.0.0.0:8200 -dev-no-store-token=true -dev-root-token-id=root -dev-tls\

==> Vault server configuration:

             Api Address: https://0.0.0.0:8200
                       ...
              Listener 1: tcp (addr: "0.0.0.0:8200", cluster address: "0.0.0.0:8201", max_request_duration: "1m30s", max_request_size: "33554432", tls: "enabled")

==> Vault server started! Log data will stream in below:

...

You may need to set the following environment variables:

    $ export VAULT_ADDR='https://0.0.0.0:8200'
    $ export VAULT_CACERT='/var/folders/5r/8y6t82xd1h183tq1l_whv8yw0000gn/T/vault-tls3194599057/vault-ca.pem'

The unseal key and root token are displayed below in case you want to
seal/unseal the Vault or re-authenticate.

Unseal Key: DfFexcExFfbN3jRu7cRuAvMeLMpP9J9yNTgzvvcO8Gw=
Root Token: root

Development mode should NOT be used in production installations!
```

