---
meta:
  - name: description
    content: "no space left on device"
tags: ["rancher", "docker", "mac"]
---

# Rancher Desktop Disk Resize on MAC

> Private docker registry  
> Rancher Desktop  
> MacOS  
> Src :  <https://slack-archive.rancher.com/t/8508077/on-my-m1-mac-i-ve-started-getting-this-error-and-it-wont-go-#3e8d178c-aee8-46e6-b4cc-094c2339cbaa>

## issue
```bash
$ docker run abc
f631eb8a0078: Already exists
d04f82e55126: Already exists
0b1212f566e8: Already exists
8e7d076cd7f0: Already exists
62aa9a741295: Already exists
f3e65750a6be: Extracting  22.02GB/22.02GB
docker: failed to register layer: Error processing tar file(exit status 1): write /0000.dat: no space left on device.
See 'docker run --help'.
```

::: danger
Check the Rancher desktop stopped
:::

## Resize
```bash
$ /Applications/Rancher\ Desktop.app/Contents/Resources/resources/darwin/lima/bin/qemu-img resize $HOME/Library/Application\ Support/rancher-desktop/lima/0/diffdisk +10G

Image resized.
```