---

description: docker bridge mode netstat
tag: ["linux", "docker", "bridge", "netstat"]

---

# docker나 nomad를 이용하여 bridge모드로 기동된 컨테이너의 port 체크 
- 단순 netstat만으로 bridge모드로 기동된 docker의 port를 체크할 수 없다
- 그래서 아래와 같은 절차가 필요하다.

### 먼저 찾으려는 컨테이너의 port를 확인한다. (nomad로 배포되어 있는 컨테이너임)
```bash
nomad alloc status d78d5b32
ID                  = d78d5b32-00c3-5468-284a-8c201058c53a
Eval ID             = c6c9a1d9
Name                = 08_grafana.08_grafana[0]
Node ID             = e11b7729
Node Name           = slave1
Job ID              = 08_grafana
Job Version         = 0
Client Status       = running
Client Description  = Tasks are running
Desired Status      = run
Desired Description = <none>
Created             = 18h42m ago
Modified            = 2h36m ago

Allocation Addresses (mode = "bridge")
Label                   Dynamic  Address
*http                   yes      10.0.0.161:25546
*connect-proxy-grafana  yes      10.0.0.161:29382 -> 29382
```


### 먼저 일반적으로 사용하는 netstat에는 grafana 컨테이너의 http port인 25546이 확인되지 않는다.
```bash
$ netstat -ntlp
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name
tcp        0      0 127.0.0.1:8502          0.0.0.0:*               LISTEN      780/consul
tcp        0      0 0.0.0.0:22              0.0.0.0:*               LISTEN      813/sshd: /usr/sbin
tcp        0      0 0.0.0.0:8888            0.0.0.0:*               LISTEN      2354/haproxy
tcp        0      0 127.0.0.1:8600          0.0.0.0:*               LISTEN      780/consul
tcp        0      0 10.0.0.161:24185        0.0.0.0:*               LISTEN      22324/docker-proxy
tcp        0      0 10.0.0.161:9090         0.0.0.0:*               LISTEN      2496/docker-proxy
tcp        0      0 172.30.1.112:8301       0.0.0.0:*               LISTEN      780/consul
tcp        0      0 0.0.0.0:111             0.0.0.0:*               LISTEN      1/init
tcp        0      0 0.0.0.0:1936            0.0.0.0:*               LISTEN      2354/haproxy
tcp        0      0 127.0.0.1:8500          0.0.0.0:*               LISTEN      780/consul
tcp        0      0 127.0.0.53:53           0.0.0.0:*               LISTEN      33902/systemd-resol
tcp6       0      0 :::22                   :::*                    LISTEN      813/sshd: /usr/sbin
tcp6       0      0 :::4646                 :::*                    LISTEN      9827/nomad
tcp6       0      0 :::111                  :::*                    LISTEN      1/init
tcp6       0      0 :::6100                 :::*                    LISTEN      22827/java
```

### 기동 중인 docker에서 inspect로 pid를 검색해오고 그 정보로 netstat를 다시하면 이제 LISTEN된 정보를 얻어올 수 있다.
```bash
$ docker ps | grep grafana
0371b4c5f500   grafana/grafana                            "/run.sh"                50 minutes ago   Up 50 minutes                                                            grafana-d78d5b32-00c3-5468-284a-8c201058c53a
62a46e08d426   envoyproxy/envoy:v1.20.0                   "/docker-entrypoint.…"   50 minutes ago   Up 50 minutes                                                            connect-proxy-grafana-d78d5b32-00c3-5468-284a-8c201058c53a

$ docker inspect -f '{{.State.Pid}}' 0371b4c5f500
22741

$ nsenter -t 22741 -n netstat -ntl
Active Internet connections (only servers)
Proto Recv-Q Send-Q Local Address           Foreign Address         State
tcp        0      0 127.0.0.2:19001         0.0.0.0:*               LISTEN
tcp6       0      0 :::25546                :::*                    LISTEN
```
#### * 위 결과로 알 수 있는 것은 가상 네트워크에 물려 기동되는 컨테이너의 LISTEN정보를 알기위해선 조금의 과정이 필요함