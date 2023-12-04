---
description: Vault가 K8s Cluster API에 Inbound가 안되는 경우(보안 정책 때문에) Helm/VSO 구성이 불가능 하므로, 이 경우 수동으로 Sidecar를 붙여주거나 별도 Vault Agent/Proxy를 구성하여 Outbound로 처리하도록 해줘야 하는 경우가 발생한다.
tag: ["vault", "kubernetes"]
---
# Kubernetes에 Vault Agent(Sidecar) 수동 구성

Kubernetes(K8s)환경에서 외부 Vault(External Vault Server)와 연계하는 경우 일반적으로 `kubernetes` 인증방식을 활용하여 Vault와 K8s 간 플랫폼 수준에서의 인증을 처리하나, K8s로의 Cluster API에 대한 inbound가 막혀있는 경우 이같은 방식은 사용할 수 없다. 따라서 `helm`, `vso` 같은 방식의 사용이 불가능하므로 Vault Agent를 Sidecar로 함께 배포하는 경우 수동으로 구성해주어야 한다.

![](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/Monosnap%20Samsung%20MX%20-%20Multicloud%20-%20Vault%20%7C%20onemodel%202023-12-04%2011-55-09.png)

::: tip
구성 과정은 Vault Agent를 BM/VM 환경에 구성하는 방식과 유사하며, 관련 구성 파일과 인증을 위한 정보를 Kubernetes 리소스를 활용한다는 차이가 있다.
:::

테스트를 위한 Secret Engine은 `kv-v2` 이며, `/secret` 경로에 할당하였다.

::: details Secret Example
```bash
vault secrets enable -version=2 -path=secret kv

vault kv put secret/my-k8s-secret foo=my-k8s-secret-data

vault policy write my-secret - <<EOF
path "secret/data/my-k8s-secret" {
  capabilities = ["read"]
}
EOF
```
:::


## 1.  Approle 인증 방식

AppRole 인증방식을 활성화 한다.

```bash
vault auth enable approle
```

AppRole의 `role`을 생성한다.

```bash
vault write auth/approle/role/k8s-role \
    secret_id_ttl=10m \
    token_ttl=60m \
    token_max_ttl=120m \
    policies=my-secret
```

`role_id`를 확인한다.

```bash
vault read auth/approle/role/k8s-role/role-id
```

`role_id`와 `secret_id`를  K8s의 Secret에 저장한다.

```bash
# kubectl create secret generic vault-approle --from-literal=role_id=<role-id-1234> --from-literal=secret_id=<s.1234567890abcdef>
kubectl create secret generic vault-approle \
  --from-literal=role_id=$(vault read -field=role_id auth/approle/role/k8s-role/role-id) \
  --from-literal=secret_id=$(vault write -force -field=secret_id auth/approle/role/k8s-role/secret-id)
```

AppRole로 인증하는 Vault Agent를 위한 구성 파일을 `vault-agent-config.hcl`에 설정한다. ConfigMap에 저장한다.

```bash
cat <<EOF | kubectl create configmap vault-agent-config --from-file=agent-config.hcl=/dev/stdin
vault {
  address = "http://10.100.11.233:8200"
}

auto_auth {
  method "approle" {
    config = {
      role_id_file_path = "/etc/vault/approle/role_id"
      secret_id_file_path = "/etc/vault/approle/secret_id"
    }
  }

  sink "file" {
    config = {
      path = "/etc/vault-agent-token/token"
    }
  }
}

template_config {
	static_secret_render_interval = "20s"
}

template {
  destination = "/etc/secrets/index.html"
  contents = <<EOH
  <html>
  <body>
  <p>Secret Value: {{ with secret "secret/data/my-k8s-secret" }}{{ .Data.data.foo }}{{ end }}</p>
  </body>
  </html>
  EOH
}
EOF
```

AppRole ID과 SecretID, Vault Agent Config 를 사용하는 샘플 앱을 실행한다. 다음은 Nginx를 사용한 Deployment Yaml의 예이다.

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-vault-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-vault-demo
  template:
    metadata:
      labels:
        app: nginx-vault-demo
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html
      - name: vault-agent-sidecar
        image: hashicorp/vault:latest
        args:
          - "agent"
          - "-config=/etc/vault/agent-config.hcl"
        volumeMounts:
        - name: vault-agent-config
          mountPath: /etc/vault
        - name: vault-approle
          mountPath: /etc/vault/approle
        - name: vault-token
          mountPath: /etc/vault-agent-token
        - name: html-volume
          mountPath: /etc/secrets
      volumes:
      - name: vault-agent-config
        configMap:
          name: vault-agent-config
      - name: vault-approle
        secret:
          secretName: vault-approle
      - name: vault-token
        emptyDir: {}
      - name: html-volume
        emptyDir: {}
EOF
```

Nginx의 Service를 등록한다.

```bash
kubectl apply -f - <<EOF
apiVersion: v1
kind: Service
metadata:
  name: nginx-service
spec:
  selector:
    app: nginx-vault-demo
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
EOF
```

`port-forward`를 이용하여 Nginx에서 정상적으로 랜더링된 vault의 시크릿을 포함한 페이지가 나타나는지 확인한다.

```bash
kubectl port-forward $(kubectl get pods -l app=nginx-vault-demo -o jsonpath='{.items[0].metadata.name}') 8080:80
```

![](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20231204105453607.png)

Vault Agent 구성파일에서 `static_secret_render_interval`에 대한 정의가 있으므로, 20s 간격마다 변경된 KV 값으로 랜더링하는지 확인해본다.

``` bash
vault kv put secret/my-k8s-secret foo=my-k8s-secret-data-v2
```

Pod 내의 `vault-agent-sidecar` 로그에 `rendered` 로그가 기록된다.

```log
│ 2023-12-04T02:01:51.992Z [INFO] (runner) rendered "(dynamic)" => "/etc/secrets/index.html"
```

![](https://raw.githubusercontent.com/Great-Stone/images/master/picgo/image-20231204110230042.png)



## 2. Cloud Provider 인증 방식(e.g. AWS Auth)

범용적인 AppRole 대신 Cloud Provider와의 인증 방식(여기서는 AWS 인증 방식)을 사용하여 Vault와 통신하는 구성을 적용할 수 있다.

EKS의 경우, EKS에 배포되는 Vault Agent는 AWS Role을 확인 가능하므로, AWS 인증 방식은 Vault가 AWS의 IAM 자격증명을 사용하여 인증을 수행하게 된다.

Vault AWS 인증 방식을 사용하기 위해서는 사전에 Vault AWS 인증에 사용할 Role이 필요하다.(아래는 Terraform으로의 구성 예제이다.)

::: details AWS Role create - Terraform Example
```hcl
provider "aws" {
  region = "ap-northeast-2"
}

resource "aws_iam_role" "eks_vault_auth_role" {
  name = "eks-vault-auth-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

# Vault에 접근할 수 있는 역할에 대한 정책 (필요에 따라 수정)
resource "aws_iam_role_policy" "vault_access" {
  name = "VaultAccess"
  role = aws_iam_role.eks_vault_auth_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "ec2:DescribeInstances",
          "ec2:DescribeTags"
        ],
        Effect   = "Allow",
        Resource = "*"
      }
    ]
  })
}

output "role_arn" {
  value = aws_iam_role.eks_vault_auth_role.arn
}
```
:::


Vault 서버에서 AWS 인증 방식을 활성화한다.

```bash
vault auth enable aws
```

AWS 역할을 생성하고, 해당 역할에 적절한 정책을 할당한다. 이 역할은 EKS에서 실행되는 서비스나 애플리케이션이 Vault에 인증할 때 사용된다. (terraform으로 생성한 경우 role_arn output에 출력된 결과를 `bound_iam_principal_arn`에 입력해준다.)

```
vault write auth/aws/role/k8s-role \
    auth_type=iam \
    bound_iam_principal_arn="arn:aws:iam::<AWS_ACCOUNT_ID>:role/<EKS_ROLE_NAME>" \
    policies=my-secret \
    ttl=1h
```

AWS로 인증하는 Vault Agent를 위한 구성 파일을 `vault-agent-config-aws.hcl`에 설정한다. ConfigMap에 저장한다.

```bash
cat <<EOF | kubectl create configmap vault-agent-config-aws --from-file=agent-config.hcl=/dev/stdin
vault {
  address = "http://10.100.11.233:8200"
}

auto_auth {
  method "aws" {
    mount_path = "auth/aws"
    config = {
      type = "iam"
      role = "k8s-role"
    }
  }

  sink "file" {
    config = {
      path = "/etc/vault-agent-token/token"
    }
  }
}

template_config {
	static_secret_render_interval = "20s"
}

template {
  destination = "/etc/secrets/index.html"
  contents = <<EOH
  <html>
  <body>
  <p>Secret Value: {{ with secret "secret/data/my-k8s-secret" }}{{ .Data.data.foo }}{{ end }}</p>
  </body>
  </html>
  EOH
}
EOF
```

Deployment는 다음과 같이 수정하여 적용한다.  AppRole 구성에서의 관련 설정들이 제외된다.

```bash
kubectl apply -f - <<EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-vault-demo
spec:
  replicas: 1
  selector:
    matchLabels:
      app: nginx-vault-demo
  template:
    metadata:
      labels:
        app: nginx-vault-demo
    spec:
      containers:
      - name: nginx
        image: nginx:latest
        ports:
        - containerPort: 80
        volumeMounts:
        - name: html-volume
          mountPath: /usr/share/nginx/html
      - name: vault-agent-sidecar
        image: hashicorp/vault:latest
        args:
          - "agent"
          - "-config=/etc/vault/agent-config.hcl"
        volumeMounts:
        - name: vault-agent-config-aws
          mountPath: /etc/vault
        - name: vault-token
          mountPath: /etc/vault-agent-token
        - name: html-volume
          mountPath: /etc/secrets
      volumes:
      - name: vault-agent-config
        configMap:
          name: vault-agent-config
      - name: vault-token
        emptyDir: {}
      - name: html-volume
        emptyDir: {}
EOF
```





