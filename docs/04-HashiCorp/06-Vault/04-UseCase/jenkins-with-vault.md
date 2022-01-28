---
meta:
  - name: description
    content: Vault를 활용하여 jenkins에 kv secret 활용
tags: ["vault", "jenkins", "screct", "kv"]
---
# jenkins with vault
jenkins와 vault를 연동하여 pipe line에서 kv 사용하기
이 예제는 진짜 kv까지만 테스트함

```bash
# approle 엔진 생성
$ vault auth enable approle
# kv2 enable
$ vault secrets enable kv-v2

# jenkins 정책으로 될 파일 생성
$ tee jenkins-policy.hcl <<EOF
path "kv/secret/data/jenkins/*" {
  capabilities = [ "read" ]
}
EOF

#jenkins 정책 생성
vault policy write jenkins jenkins-policy.hcl

#approle 생성 및 정책 jenkins에 연결
vault write auth/approle/role/jenkins token_policies="jenkins" \
token_ttl=1h token_max_ttl=4h
 
#Role id, secret id 가져오기

vault read auth/approle/role/jenkins/role-id
vault write -f auth/approle/role/jenkins/secret-id


vault secrets enable -path=kv kv
$ tee gitlab.json <<EOF
{
  "gitlabIP": "172.21.2.52",
  "api-key": "RjLAbbWsSAzXoyBvo2qL"
}
EOF

vault kv put kv/secret/data/jenkins/gitlab @gitlab.json

# jenkins pipe line
def secrets = [
  [path: 'kv%2Fsecret/data/jenkins/gitlab', engineVersion:1, secretValues: [
    [envVar: 'gitlabIP', vaultKey: 'gitlabIP'],
    [envVar: 'API_KEY', vaultKey: 'api-key']]],
]
def configuration = [vaultUrl: 'http://172.21.2.50:8200',  vaultCredentialId: 'vault-approle', engineVersion: 1]
                      
pipeline {
    agent any
    options {
        buildDiscarder(logRotator(numToKeepStr: '20'))
        disableConcurrentBuilds()
    }
    stages{   
      stage('Vault') {
        steps {
          withVault([configuration: configuration, vaultSecrets: secrets]) {
            sh "echo $gitlabIP"
            sh "echo ${env.API_KEY}"
          }
        }  
      }
    }
}
```