---
meta:
  - name: description
    content: "OpenShift 프로젝트 별로 특정 노드에 배포하기"
tags: ["openshift", "ocp"]
---

# OpenShift 3.x - 프로젝트 별로 특정 노드에 배포하기

> 원문 : [https://blog.openshift.com/deploying-applications-to-specific-nodes/](https://blog.openshift.com/deploying-applications-to-specific-nodes/)

Deployment나 Deployment Config에서 Nodeselect를 지정하는 방법 외에 Project 단위로 설정하는 방법을 설명합니다.



1. Node Label확인 

   ```bash
   ~$ oc get node --show-labels
   ```

   

2. Node에 Label 업데이트

   > Label 업데이트 ([링크](https://docs.openshift.com/container-platform/3.7/admin_guide/manage_nodes.html#updating-labels-on-nodes))

   ```bash
   ~$ oc label node [노드이름] region=primary
   ```

   primary는 구분자 입니다. 예로

   `region=tk` 이런식으로 테스트계 설정을 하게 됩니다.

   

   ex)

   To **add a label** to a node or pod:

   ```
   # oc label node node001.krenger.ch mylabel=myvalue
   # oc label pod mypod-34-g0f7k mylabel=myvalue
   ```

   To **remove a label** (in the example “mylabel”) from a node or pod:

   ```
   # oc label node node001.krenger.ch mylabel-
   # oc label pod mypod-34-g0f7k mylabel-
   ```

   

3. Master에 기본 NodeSelector Label 지정

   Master 노드의 `defaultNodeSelector` 설정을 변경하고 Master서비스를 재시작 합니다.

   `NodeSelector`가 없는 경우 Pod가 Deploy되는 Node 입니다. 

   대상 파일: `/etc/origin/master/master-config.yaml`

   ```yaml
   projectConfig:
     defaultNodeSelector: "region=primary” 
   ```

   **Master Node 재기동 필요**

   ```bash
   ~$ systemctl restart atomic-openshift-master
   ~$ systemctl restart atomic-openshift-node
   ```

   

4. 프로젝트 Node Selector 설정

   ```bash
   ~$ oc edit namespace [프로젝트이름]
   ```

   ```yaml
   ...
     annotations:
       openshift.io/node-selector: “region=primary"
       openshift.io/description: ""
       openshift.io/display-name: ""
       openshift.io/node-selector: “"
   ...    
   ```

   

**Appendix**

- 위 과정만으로 Project 에 대한 기본 Node Selector가 설정되어야 하며, 이같이 설정되지 않는 경우 각 Pod 별로, 혹은 template에서 설정해야합니다.

