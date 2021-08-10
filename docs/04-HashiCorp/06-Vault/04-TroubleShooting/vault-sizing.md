---
meta:
  - name: description
    content: MariaDB5.5버전에서 Dynamic Secret  구성을 위한 credential생성시 에러
tags: ["vault", "MiriaDB"]
---

# Vault MariaDB5.5 Dynamic Secret

- 현상 : $vault read mysql/creds/my-role 입력시 오류 

- 오류 내용 : 
```
Error reading mysql/creds/my-role: Error making API request.
URL: GET http://127.0.0.1:8200/v1/mysql/creds/my-role
Code: 500. Errors:

* 1 error occurred:
      * Error 1470: String 'v-root-my-role-87BP93fheiaHKGelc' is too long for user name (should be no longer than 16)
```

- 원인 : mysql 버전이 오래되어  mysql-database-plugin이 아닌  mysql-legacy-database-plugin 을 사용해야 함. 
https://github.com/hashicorp/vault/issues/4602


- 해결방안 : vault에서 database에 접근하기 위한 plugin설정시 아래와 같이 설정을 변경해야 함. 
    - 기존설정 
    ```bash
    $ vault write mysql/config/mysql-database \
        plugin_name=mysql-database-plugin \
        connection_url="{{username}}:{{password}}@tcp(192.168.56.204:3306)/" \
        allowed_roles="my-role" \
        username="vault2" \
        password="vaultpass"
    ```

    - 변경설정  
    ```bash
    $ vault write mysql/config/mysql-database \
        plugin_name=mysql-legacy-database-plugin \
        connection_url="{{username}}:{{password}}@tcp(192.168.56.204:3306)/" \
        allowed_roles="my-role" \
        username="vault2" \
    ```