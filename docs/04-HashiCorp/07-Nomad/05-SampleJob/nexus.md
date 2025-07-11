---
description: Nomad Sample
tag: ["Nomad", "Sample", "Job"]
---

# Nexus

```hcl
job "nexus" {
  datacenters = ["dc1"]

  group "nexus" {
    count = 1

    network {
      port "http" {
        to = 8081
        static = 8081
      }
    }

    task "nexus" {
      driver = "docker"

      config {
        image = "sonatype/nexus3"
        ports = ["http"]
      }
      
      env {
        INSTALL4J_ADD_VM_PARAMS = "-Xms2703m -Xmx2703m -XX:MaxDirectMemorySize=2703m -Djava.util.prefs.userRoot=/some-other-dir"  
      }
      
      resources {
        cpu    = 1000
        memory = 8000
      }
    }
  }
}
```
