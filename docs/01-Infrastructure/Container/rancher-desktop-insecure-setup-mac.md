---
meta:
  - name: description
    content: "http: server gave HTTP response to HTTPS client"
tags: ["rancher", "docker", "mac"]
---

# Rancher Desktop Insecure Setup on MAC

> Private docker registry
> Rancher Desktop
> MacOS
> Setup `insecure-registries`

## issue
```bash
$ docker push 192.168.0.3:5000/example-python:1.0
Error response from daemon: Get https://192.168.60.11:5000/v1/example-python: http: server gave HTTP response to HTTPS client
```

## Edit docker.json within Rancher desktop
```bash
MAC $ LIMA_HOME="$HOME/Library/Application Support/rancher-desktop/lima" "/Applications/Rancher Desktop.app/Contents/Resources/resources/darwin/lima/bin/limactl" shell 0
lima-rancher-desktop $ sudo vi /etc/conf.d/docker
```
```ini
...
# DOCKER_OPTS="" to
DOCKER_OPTS="--insecure-registry=192.168.60.11:5000"
```

## Restart docker service
```bash
lima-rancher-desktop $ sudo service docker restart
 * Caching service dependencies .. [ ok ]
 * Stopping Docker Daemon ..       [ ok ]
 * Starting Docker Daemon ...      [ ok ]

lima-rancher-desktop $ exit
```

## Try Push/Pull
```
$ docker push 192.168.60.11:5000/example-python:1.0
The push refers to repository [192.168.60.11:5000/example-python]
259faf3d45f5: Pushed
d25777b53a01: Pushed
b28e272ad893: Pushed
517c4790d67b: Pushed
40dc2004f48f: Pushed
df63783f60fd: Pushed
7e1c5e1a1242: Pushed
b4440cc8e4ff: Pushed
26a1b0864fd3: Pushed
867d0767a47c: Pushed
1.0: digest: sha256:dc8ebd032c0c1cd8fd991926eaea5a9d8f3cf66286c048e3bac6336969c524b5 size: 2414
```