---
meta:
  - name: description
    content: Consul Service Mesh on Kubernetes
tags: ["Consul", "ServiceMesh", "K8s", "Kubernetes", "timeout"]
---

# Envoy Timeout

> Consul API : <https://www.consul.io/api-docs/config>  
> Proxy Default : <https://www.consul.io/docs/connect/config-entries/proxy-defaults>  
> Envoy Integration : <https://www.consul.io/docs/connect/proxies/envoy>  

## 단계 1. Deployment Sample

```bash
cat > ./gs-frontend.yaml <<EOF
---
apiVersion: v1
kind: Service
metadata:
  name: gs-frontend
spec:
  selector:
    app: gs-frontend
  ports:
    - protocol: TCP
      port: 3000
      targetPort: 3000
---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: gs-frontend
---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: gs-frontend
spec:
  replicas: 1
  selector:
    matchLabels:
      app: gs-frontend
  template:
    metadata:
      annotations:
        consul.hashicorp.com/connect-inject: "true"
        consul.hashicorp.com/transparent-proxy: "false"
        consul.hashicorp.com/connect-service-upstreams: "gs-backend:8080"
      labels:
        app: gs-frontend
    spec:
      serviceAccountName: gs-frontend
      containers:
        - name: gs-frontend
          image: hahohh/consul-frontend-nodejs:v1.5
          env:
            - name: PORT
              value: "3000"
            - name: UPSTREAM_URL
              value: "http://localhost:8080"
          ports:
            - containerPort: 3000
EOF

kubectl apply -f ./gs-frontend.yaml
```

## 단계 2. config_dump 생성

```bash
kubectl exec pod/<POD_ID> -c envoy-sidecar -- wget -qO- http://localhost:19000/config_dump
```

```json
{
 "configs": [
  {
   "@type": "type.googleapis.com/envoy.admin.v3.BootstrapConfigDump",
   "bootstrap": {
     <생략>
    "static_resources": {
     "clusters": [
      {
       "name": "local_agent",
       "type": "STATIC",
       "connect_timeout": "1s",
  <생략>
  {
   "@type": "type.googleapis.com/envoy.admin.v3.ClustersConfigDump",
   "static_clusters": [
    {
     "cluster": {
      "@type": "type.googleapis.com/envoy.config.cluster.v3.Cluster",
      "name": "local_agent",
      "type": "STATIC",
      "connect_timeout": "1s",
      "http2_protocol_options": {},
      
  <생략>
   "dynamic_active_clusters": [
    {
     "version_info": "eb3fa9f7104047dd6420d0eb13fd556995d2c6e7d687c4db07b759408ecf0345",
     "cluster": {
      "@type": "type.googleapis.com/envoy.config.cluster.v3.Cluster",
      "name": "gs-backend.default.dc1.internal.a3568e3d-e611-5f3e-01b9-24ec787ce275.consul",
      "type": "EDS",
      "eds_cluster_config": {
       "eds_config": {
        "ads": {},
        "resource_api_version": "V3"
       }
      },
      "connect_timeout": "5s",
      "circuit_breakers": {},
  <생략>
```

- 일부 기본 timeout 값은 기본값
  - static_resources.clusters.*.connect_timeout : "1s"
  - dynamic_active_clusters.*.connect_timeout : "5s"

## 단계 3. ProxyDefaults 설정
```bash
cat > ./proxydefaults.yaml <<EOF
apiVersion: consul.hashicorp.com/v1alpha1
kind: ProxyDefaults
metadata:
  name: global
spec:
  config:
    protocol: http
    local_connect_timeout_ms: 60000
    local_request_timeout_ms: 60000
    upstreamConfig:
      defaults:
        protocol: http
        connectTimeoutMs : 60000
EOF

kubectl apply -f ./proxydefaults.yaml
```

### 단계 4. Consul API 에서 `proxy-default` 값 변경 확인
```bash
kubectl exec pod/consul-server-0 -- wget -qO- http://localhost:8500/v1/config/proxy-defaults/global | jq .
{
  "Kind": "proxy-defaults",
  "Name": "global",
  "Config": {
    "local_connect_timeout_ms": 60000,
    "local_request_timeout_ms": 60000,
    "protocol": "http",
    "upstreamConfig": {
      "defaults": {
        "connectTimeoutMs": 60000,
        "protocol": "http"
      }
    }
  },
  "TransparentProxy": {},
  "MeshGateway": {},
  "Expose": {},
  "Meta": {
    "consul.hashicorp.com/source-datacenter": "dc1",
    "external-source": "kubernetes"
  },
  "Partition": "default",
  "Namespace": "default",
  "CreateIndex": 354,
  "ModifyIndex": 354
}
```

## 단계 5. config_dump 재생성
- Pod 재기동 없이 dump 확인
  - dynamic_active_clusters.connect_timeout : "60s"
  - type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager route timeout : "60s"
  - type.googleapis.com/envoy.config.route.v3.RouteConfiguration route timeout : "60s"

```json
{
 "configs": [
  {
   "@type": "type.googleapis.com/envoy.admin.v3.BootstrapConfigDump",
   "bootstrap": {
  <생략>
    {
     "version_info": "c80b97864daee80ecc0335fdd5b67437b946ea76e77f848d0cd69d6d1ad330ea",
     "cluster": {
      "@type": "type.googleapis.com/envoy.config.cluster.v3.Cluster",
      "name": "local_app",
      "type": "STATIC",
      "connect_timeout": "60s",
      "load_assignment": {
  <생략>
    {
     "name": "public_listener:10.0.1.162:20000",
     "active_state": {
      "version_info": "4f8654a4ce70f346dd63c479b3b42b41c5a92eda52f6b2d38dab8ff4536923f3",
      "listener": {
       "@type": "type.googleapis.com/envoy.config.listener.v3.Listener",
       "name": "public_listener:10.0.1.162:20000",
       "address": {
        "socket_address": {
         "address": "10.0.1.162",
         "port_value": 20000
        }
       },
       "filter_chains": [
        {
         "filters": [
          {
           "name": "envoy.filters.network.http_connection_manager",
           "typed_config": {
            "@type": "type.googleapis.com/envoy.extensions.filters.network.http_connection_manager.v3.HttpConnectionManager",
            "stat_prefix": "public_listener",
            "route_config": {
             "name": "public_listener",
             "virtual_hosts": [
              {
               "name": "public_listener",
               "domains": [
                "*"
               ],
               "routes": [
                {
                 "match": {
                  "prefix": "/"
                 },
                 "route": {
                  "cluster": "local_app",
                  "timeout": "60s"
  <생략>
    {
     "route_config": {
      "@type": "type.googleapis.com/envoy.config.route.v3.RouteConfiguration",
      "name": "public_listener",
      "virtual_hosts": [
       {
        "name": "public_listener",
        "domains": [
         "*"
        ],
        "routes": [
         {
          "match": {
           "prefix": "/"
          },
          "route": {
           "cluster": "local_app",
           "timeout": "60s"
  <생략>
```

