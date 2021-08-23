---
meta:
  - name: description
    content: Alibaba Cloud CLI
  - name: description
    content: aliyun configure
tags: ["alibaba", "aliyun"]
---

# Alibaba CLI 설정

## 1. CLI 설치
### 1.1 Download 방식
- Install guide : <https://partners-intl.aliyun.com/help/doc-detail/139508.htm>
- Release Download Page : <https://github.com/aliyun/aliyun-cli/releases>
    - CLI 릴리즈 페이지에서 OS에 맞는 파일을 다운로드하여 사용

### 1.2 MAC - brew 설치
- Install guide : <https://formulae.brew.sh/formula/aliyun-cli>
    ```bash
    brew install aliyun-cli
    ```



## 2. 구성 설정

인증 메커니즘이 4가지이며 구성 설정시 `--mode` 에 Credential type을 넣어서 구성하게 됨

| Credential type | Limit                                                        | Interactive credential configuration (fast)                  | Non-interactive credential configuration                     |
| :-------------- | :----------------------------------------------------------- | :----------------------------------------------------------- | :----------------------------------------------------------- |
| AK              | Use an AccessKey ID and an AccessKey secret to authorize access. | [Configure AccessKey credential](https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-5pj-p7j-06z) | [Configure AccessKey credential](https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-hhx-jpx-95g) |
| StsToken        | Use a Security Token Service (STS) token to authorize access. | [Configure STS token credential](https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-bdk-377-tnm) | [Configure STS token credential](https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-mek-l1j-xib) |
| RamRoleArn      | Use the role of a Resource Access Management (RAM) user to authorize access. | [Configure RamRoleArn credential](https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-h4x-fnh-5yj) | [Configure RamRoleArn credential](https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-uyo-8pk-uow) |
| EcsRamRole      | Use the RAM role of an Elastic Compute Service (ECS) instance to authorize password-free access. | [Configure EcsRamRole credential](https://partners-intl.aliyun.com/help/doc-detail/121258.htm#section-pq4-04b-7an) | [Configure EcsRamRole credential](https://partners-intl.aliyun.com/help/doc-detail/121259.htm#section-874-dbh-9k0) |



### 2.1 AK 생성

AccessKey 방식의 인증 정보가 없는 경우 아래와 같이 생성

- Alibaba Cloud 홈페이지의 우측 상단(변경될 수 있음) 클릭하여 `Accesskey Management` 클릭
- `AccessKey Pair` 항목에서 `Create AccessKey Pair` 를 클릭하여 AK(AccessKey)를 신규로 생성



### 2.2 CLI 구성

aliyun cli의 `configure` 를 실행

- `--mode` 에는 Credential Type을 지정
- `--profile` 에는 사용할 이름을 사용자가 지정, `default`는 기본 값

```bash
$ aliyun configure --mode AK --profile myprofile
Configuring profile 'myprofile' in 'AK' authenticate mode...
Access Key Id []: LTAI5**********************t88V
Access Key Secret []: *******************************
Default Region Id []: ap-southeast-1
Default Output Format [json]: json (Only support json)
Default Language [zh|en] en: en
Saving profile[gslee] ...Done.

Configure Done!!!
..............888888888888888888888 ........=8888888888888888888D=..............
...........88888888888888888888888 ..........D8888888888888888888888I...........
.........,8888888888888ZI: ...........................=Z88D8888888888D..........
.........+88888888 ..........................................88888888D..........
.........+88888888 .......Welcome to use Alibaba Cloud.......O8888888D..........
.........+88888888 ............. ************* ..............O8888888D..........
.........+88888888 .... Command Line Interface(Reloaded) ....O8888888D..........
.........+88888888...........................................88888888D..........
..........D888888888888DO+. ..........................?ND888888888888D..........
...........O8888888888888888888888...........D8888888888888888888888=...........
............ .:D8888888888888888888.........78888888888888888888O ..............
```

구성 완료 후 home 디렉토리의 `.aliyun` 디렉토리 내의 `config.json`에서 구성된 정보를 확인 가능

```json
{
    "current": "myprofile",
    "profiles": [
        {
            "name": "default",
            ...
        },
        {
            "name": "gslee",
            "mode": "AK",
            "access_key_id": "LTAI5**********************t88V",
            ...
            "region_id": "ap-southeast-1",
            "output_format": "json",
            "language": "en",
            ...
        }
    ],
    "meta_path": ""
}
```

### 2.3 CLI 사용 예제
Region 목록 확인
::: tip
(profile이 `default`인 경우 `--profile or -p` 생략 가능 
:::
```bash
$ aliyun -p myprofile ecs DescribeRegions 
{
        "Regions": {
                "Region": [
                        {
                                "LocalName": "华北1（青岛）",
                                "RegionEndpoint": "ecs.aliyuncs.com",
                                "RegionId": "cn-qingdao"
                        },
                        {
                                "LocalName": "华北2（北京）",
                                "RegionEndpoint": "ecs.aliyuncs.com",
                                "RegionId": "cn-beijing"
                        },
                        ...생략...
                ]
        },
        "RequestId": "2304DF19-CABF-54DF-BDC6-F889C3A73E4F"
}
```
