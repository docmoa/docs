---
meta:
  - name: description
    content: jenkins 101
tags: ["cicd", "jenkins"]
---

# 8. REST API

Jenkins는 외부 서비스와의 연동이나 정보 조회를 위한 API를 제공합니다.

## 8.1 Triggering builds via the REST API

Jenkins REST API 테스트를 위해서는 Jenkins에 인증 가능한 Token을 취득하고 curl이나 Postman 같은 도구를 사용하여 확인 가능 합니다. 우선 Token을 얻는 방법은 다음과 같습니다.

1. Jenkins에 로그인 합니다.

2. 우측 상단의 로그인 아이디에 마우스를 호버하면 드롭박스 버튼이 나타납니다. `설정`을 클릭합니다.

3. `API Token`에서 `Current token`을 확인합니다. 등록된 Token이 없는 경우 다음과 같이 신규 Token을 발급 받습니다.

   - `ADD NEW TOKEN`을 클릭합니다.

   - 이름을 기입하는 칸에 로그인 한 아이디를 등록합니다. (e.g. admin)
   - `GENERATE`를 클릭하여 Token을 생성합니다.

4. 이름과 Token을 사용하여 다음과 같이 curl로 접속하면 `Jenkins-Crumb` 프롬프트가 나타납니다.

   ```bash
   $ curl --user "admin:TOKEN" 'http://myjenkins.com/crumbIssuer/api/xml?xpath=concat(//crumbRequestField,":",//crumb)'
   
   Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605
   ```

5. `Crumb`를 확인했으면 다시 헤더 값에 `Jenkins-Crumb:`를 추가하여 `02-04.MultiStep` Job을 빌드하기 위해 다음과 같이 요청합니다.

   ```bash
   $ curl -X POST http://myjenkins.com/job/02-04.MultiStep/build --user gyulee:11479bdec9cada082d189938a3946348be --data-urlencode json='' -H "Jenkins-Crumb:89e1fd9c402824c89465f6b97f49b605"
   ```

API로 호출된 빌드가 수행되어 빌드 번호가 증가하는 것을 확인합니다.



## 8.2 Retriving build status via the REST API

빌드에 대한 결과를 REST API를 통해 요청하는 방법을 알아봅니다. 앞서 진행시의 Token값이 필요합니다. Json 형태로 출력되기 때문에 정렬을 위해 python이 설치 되어있다면  `mjson.tool`을 사용하여 보기 좋은 형태로 출력 가능합니다.

```bash
# Python이 설치되어있지 않은 경우
$ yum -y install python2

# Jenkins에 REST API로 마지막 빌드 상태 요청
$ curl  -s --user gyulee:11479bdec9cada082d189938a3946348be http://myjenkins.com/job/02-04.MultiStep/lastBuild/api/json | python2 -mjson.tool

{
    "_class": "org.jenkinsci.plugins.workflow.job.WorkflowRun",
    "actions": [
        {
            "_class": "hudson.model.CauseAction",
            "causes": [
                {
                    "_class": "hudson.model.Cause$UserIdCause",
                    "shortDescription": "Started by user GyuSeok.Lee",
                    "userId": "gyulee",
                    "userName": "GyuSeok.Lee"
                }
            ]
        },
        {},
        {
            "_class": "hudson.plugins.git.util.BuildData",
            "buildsByBranchName": {
                "master": {
                    "_class": "hudson.plugins.git.util.Build",
                    "buildNumber": 5,
                    "buildResult": null,
...
```