---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job","ollama", "ollama-webui"]
---

# Ollama & WEB UI

- Docker 드라이버를 사용하여 Ollama와 Web UI 실행하는 Job 샘플입니다.
- Web UI의 외부 노출을 위해 `bridge` 네트워크 모드를 사용해야 할 수 있습니다. 이경우 CNI가 설치되어야 합니다.

::: info Nomad CNI setup

Link : <https://developer.hashicorp.com/nomad/docs/networking/cni>

```bash
export ARCH_CNI=$( [ $(uname -m) = aarch64 ] && echo arm64 || echo amd64)
export CNI_PLUGIN_VERSION=v1.6.2
curl -L -o cni-plugins.tgz "https://github.com/containernetworking/plugins/releases/download/${CNI_PLUGIN_VERSION}/cni-plugins-linux-${ARCH_CNI}-${CNI_PLUGIN_VERSION}".tgz && \
  sudo mkdir -p /opt/cni/bin && \
  sudo tar -C /opt/cni/bin -xzf cni-plugins.tgz
```

:::

## Ollama

```hcl
job "ollama" {
  datacenters = ["dc1"]
  type = "service"

  group "ollama-group" {
    count = 1

    network {
      mode = "bridge"
      port "http" {
        static = 11434
      }
    }

    task "ollama-task" {
      driver = "docker"

      config {
        image = "ollama/ollama"

        ports = ["http"]
      }

      resources {
        cpu    = 500  # MHz
        memory = 1024  # MB
      }
    }
  }
}
```

## Ollama Web UI

```hcl
job "open-webui" {
  datacenters = ["dc1"]
  type = "service"

  group "webui-group" {
    count = 1

    network {
      mode = "bridge"
      port "api" {
        static = 8080
        to     = 8080
      }
    }
    
    task "webui-task" {
      driver = "docker"
      
      env {
        PORT = "${NOMAD_PORT_api}"
        OLLAMA_HOST = "0.0.0.0"
        OLLAMA_API_BASE_URL = "http://localhost:11434/api" #host private ip
        OLLAMA_BASE_URLS = "http://localhost:11434;http://127.0.0.1:11434;http://host.docker.internal:11434"
        ENABLE_SIGNUP = false
        DEFAULT_MODELS = "llama3.1"
        USE_OLLAMA = true
        ENABLE_RAG_WEB_SEARCH = true
        USER_AGENT = "myagent"
	    WEBUI_AUTH = false
      }

      config {
        image = "ghcr.io/open-webui/open-webui:main"

        ports = ["api"]

        volumes = [
          "nomad-webui:/app/backend/data"
        ]
      }

      resources {
        cpu    = 1000
        memory = 2048
      }
    }
  }
}
```