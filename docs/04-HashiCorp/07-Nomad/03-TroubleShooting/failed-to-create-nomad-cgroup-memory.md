---
description: failed to create nomad cgroup memory
tag: ["Nomad", "Error"]
---

# Failed to start (failed to create nomad cgroup memory)

오류 메시지는 파일 시스템이 읽기 전용으로 마운트된 Linux 시스템에서 `cgroup`을 수정하려고 할 때 문제가 있음을 나타냅니다. 이 문제는 컨테이너 및 컨테이너화되지 않은 애플리케이션을 오케스트레이션하는 클러스터 관리자 및 스케줄러인 Nomad가 관리하는 환경에서 발생할 수 있습니다.

## Error log

```log
...
Apr 25 11:27:31 raspberrypi nomad[20120]:     2024-04-25T11:27:31.007+0100 [INFO]  client.proclib.cg1: initializing nomad cgroups: cores=0-3
Apr 25 11:27:31 raspberrypi nomad[20120]:     2024-04-25T11:27:31.008+0100 [ERROR] agent: error starting agent: error="client setup failed: failed to initialize process manager: failed to create nomad cgroup memory: mkdir /sys/fs/cgroup/memory: read-only file system"
Apr 25 11:27:31 raspberrypi systemd[1]: nomad.service: Service RestartSec=100ms expired, scheduling restart.
```

## Check Filesystem Mount Options

파일 시스템이 읽기 전용으로 마운트되지 않았는지 확인합니다. 마운트 또는 findmnt 명령을 사용하여 마운트 옵션을 확인할 수 있습니다:

```bash
mount | grep cgroup
```

```log
#Current cgroup
tmpfs on /sys/fs/cgroup type tmpfs (ro,nosuid,nodev,noexec,mode=755)
cgroup2 on /sys/fs/cgroup/unified type cgroup2 (rw,nosuid,nodev,noexec,relatime,nsdelegate)
cgroup on /sys/fs/cgroup/systemd type cgroup (rw,nosuid,nodev,noexec,relatime,xattr,name=systemd)
cgroup on /sys/fs/cgroup/devices type cgroup (rw,nosuid,nodev,noexec,relatime,devices)
cgroup on /sys/fs/cgroup/net_cls,net_prio type cgroup (rw,nosuid,nodev,noexec,relatime,net_cls,net_prio)
cgroup on /sys/fs/cgroup/cpu,cpuacct type cgroup (rw,nosuid,nodev,noexec,relatime,cpu,cpuacct)
cgroup on /sys/fs/cgroup/pids type cgroup (rw,nosuid,nodev,noexec,relatime,pids)
cgroup on /sys/fs/cgroup/freezer type cgroup (rw,nosuid,nodev,noexec,relatime,freezer)
cgroup on /sys/fs/cgroup/cpuset type cgroup (rw,nosuid,nodev,noexec,relatime,cpuset)
cgroup on /sys/fs/cgroup/blkio type cgroup (rw,nosuid,nodev,noexec,relatime,blkio)
cgroup on /sys/fs/cgroup/perf_event type cgroup (rw,nosuid,nodev,noexec,relatime,perf_event)
```

## Add read-write to cgroup

`ro`옵션을 찾습니다. 실제로 읽기 전용인 `ro`(Read-Only)으로 마운트된 경우 가능하면 `rw`(Read-Write : 읽기-쓰기)로 마운트 해야 변경 가능합니다.

```bash
sudo mount -o remount,rw /sys/fs/cgroup
```

## Verify Kernel Support and Parameters

커널이 cgroups를 지원하고 필요한 모든 cgroup 하위 시스템이 활성화되어 있는지 확인하세요. cgroups와 관련된 커널 매개변수를 조정하거나 활성화해야 할 수도 있습니다. 현재 설정을 확인합니다:

```bash
cat /proc/cgroups
```

```ini
#subsys_name    hierarchy       num_cgroups     enabled
cpuset  7       6       1
cpu     4       77      1
cpuacct 4       77      1
blkio   8       76      1
memory  0       85      0
devices 2       76      1
freezer 6       2       1
net_cls 3       1       1
perf_event      9       1       1
net_prio        3       1       1
pids    5       83      1
```