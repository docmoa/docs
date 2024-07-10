---
description: Terraform Enterprise SAML(ADFS)
tag: ["Terraform", "AD", "saml", "adfs"]
author: dyana(ddim)
---

# Terraform Enterprise SAML (ADFS)

> ADFS의 Group과 User가 생성되어 있으며  Terraform Enterprise가 구축되어 SAML연동이 필요한 상황일 때 본 가이드를 권장합니다.



## ADFS Management Settings

### 1) Gather ADFS Information 

Terraform Enterpirse SAML Configure 에 필요한 enpoints와 idp인증서 export를 위해 진행. 

![스크린샷 2024-07-09 오전 10.17.54](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.17.54.png)

- Server Manager > 오른쪽 상단 Tools > Active Directory Users and Computers 클릭

![image-20240709102309773](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709102309773.png)

- Service > Endpoints > Type이 `SAML 2.0/WS-Federation`인 URL Path 값은 Terraform Enterprise Single Sign-On URL인 https://ADFS-HOSTNAME/URL-PATH 에 필요하기에 기억해둡니다. 
  default URL Path : `/adfs/ls/`

![스크린샷 2024-07-09 오전 10.26.48](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.26.48.png)

- Service > Certificates > Token-signing > 오른쪽 버튼 클릭 > View Certificate 클릭

![스크린샷 2024-07-09 오전 10.28.23](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.28.23.png)

- Details > Copy to File.. 클릭

![스크린샷 2024-07-09 오전 10.29.12](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.29.12.png)

![스크린샷 2024-07-09 오전 10.29.28](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.29.28.png)

- Export File Format >  "Base-64 encoded X.509 (.CER)" 클릭 > Next

![스크린샷 2024-07-09 오전 10.30.27](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.30.27.png)

- Terraform Enterprise Identity Provider Settings의 IDP Certificate 값에 쓰이는 cert 





### 2) Configure Terraform Enterprise

- 접속 : https://TFE-HOSTNAME/app/admin/saml

![image-20240709103411478](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709103411478.png)

- SAML SEttings의 Enable SAML single sign-on 체크 
  SAML single sign-on 확인란을 활성화해야 합니다. 



![image-20240709103737289](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709103737289.png)

##### [Identity Provider Settings]

- Single Sign-On URL : Single-Sign-On 요청을 위한 Idp의 HTTP(S) 엔드포인트입니다.
  https://ADFS-HOSTNAME/URL-Path

- Single Log-Out URL : 단일 로그아웃 요청에 대한 Idp의 HTTP(S) 엔드포인트입니다.

  단일 로그아웃은 아직 지원되지 않습니다.
  https://ADFS-HOSTNAME/URL-Path?wa=wsignout1.0

- IDP Certificate : IdP 구성에서 제공되는 PEM 인코딩된 X.509 인증서입니다. 
  export한 idpcert.txt 값 입력  



![스크린샷 2024-07-09 오전 10.47.44](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2010.47.44.png)

##### [Attributes]

- Username Attribute Name : SSO를 통해 로그인하는 사용자의 Terraform Enterprise 사용자 이름을 결정하는 SAML 속성의 이름입니다.
- Site Admin Attribute Name : 사용자에게 사이트 관리자 권한이 있는지 여부를 결정하는 SAML 속성의 이름입니다. 
  사이트 관리자는 전체 Terraform Enterprise 인스턴스에 대한 설정 및 리소스를 관리할 수 있습니다. 



##### [Team Membership Management]

- Use SAML to manage team memberships 활성화
- Team Attribute Name : 팀 멤버십을 결정하는 SAML 속성의 이름입니다. 대소문자를 구분합니다. 
- Site Admin Role : (기본값 : site-admins 비활성화하려면 비워 둡니다.) 사이트 관리자 권한을 관리하는 또 다른 방법입니다. 이 이름을 가진 역할이 팀 속성 이름 특성 값에 있으면 사용자는 관리자입니다. 
  'Site admin attribute name'  설정을 사용하는 것을 권장하며 이 설정을 사용하는 경우 값을 삭제하여 'Site Admin Role'을 비활성화할 수 있습니다. 



##### [User Session] 

- API 토큰 세션 시간 초과 : Terraform Enterprise가 사용자에게 다시 로그인하도록 요구하기 전에 수락하는 시간(초) 입니다. 

Save SAML settings 클릭.



### 3) Terraform Enterprise 인증서 > Windows에 등록

![스크린샷 2024-07-09 오전 11.07.23](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.07.23.png)

- MMC > Trusted Root Certification... > Certificates > All Tasks > import

![스크린샷 2024-07-09 오전 11.09.00](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.09.00.png)



### 4) Configure ADFS

Configure the Relying Party(RP) Trust

![image-20240709111515462](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709111515462.png)



- ADFS Management > Relying Party Trusts 클릭 

![스크린샷 2024-07-09 오전 11.15.56](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.15.56.png)

- Start 클릭 > Import data about the relying party published online or on a local network
  Federation metadata address (host name or URL): `https://TFE-HOSTNAME/users/saml/metadata`
  (Terraform Enterprise의 Identity Provider Configuration의 Metadata(Audience)URL)



![스크린샷 2024-07-09 오전 11.19.34](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.19.34.png)

- RP 신뢰를 식별하는 데 사용되는 이름을 입력한 후 Next 클릭



![스크린샷 2024-07-09 오전 11.20.16](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.20.16.png)

- 엑세스 제어 정책 선택 화면에서 보안 정책과 일치하는 정책을 선택하고 Next 클릭

![스크린샷 2024-07-09 오전 11.21.07](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.21.07.png)

- Next 클릭

![스크린샷 2024-07-09 오전 11.21.30](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.21.30.png)



### 5) Configure Claim Issuance

##### 5-1) Send LDAP Attributes as Claims

TFE-HOSTNAME 을 위한 Claim Issuance Policy 추가 

![스크린샷 2024-07-09 오전 11.24.39](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.24.39.png)

- Add Rule 클릭

![스크린샷 2024-07-09 오전 11.25.43](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.25.43.png)

- Claim rule template : Send LDAP Attributes as Claims 

![스크린샷 2024-07-09 오전 11.27.16](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.27.16.png)

- Claim rule name : 클레임 규칙을 식별하는 데 사용되는 이름으로 설정
- Attribute store : Active Directory
- LDAP Attribute : E-Mail-Addresses
- Outgoing Claim Type : E-Mail Address



##### 5-2) Transform an Incoming Claim



![스크린샷 2024-07-09 오전 11.29.07](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.29.07.png)

- Add Rule 클릭 
- Claim rule template : Transform an Incoming Claim

![스크린샷 2024-07-09 오전 11.30.38](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%8C%E1%85%A5%E1%86%AB%2011.30.38.png)

- Claim rule name : 클레임 규칙을 식별하는 데 사용되는 이름으로 설정
- Incoming Claim type  : E-Mail Address
  Imcoming Claim type은 사용자가 인증 시 ADFS에 전달되는 클레임 중 이메일 주소를 나타냅니다.
  일반적으로 이는 사용자의 이메일 주소를 포함하는 클레임 유형을 의미합니다.
- Outgoing Claim type  : Name ID
  Outgoing Claim type은 ADFS가 Relying Party에 전달할 때 클레임을 식별하는 데 사용되는 속성으로 각 시스템 간의 클레임 공유 및 상호 운용성을 위한 것이며 NameID는 이를 식별하는 데 사용되는 주요 속성 중 하나입니다. 
- Outgoing name ID format : Email



##### 5-3) Send Group Membership as a Calim

![스크린샷 2024-07-09 오후 1.28.31](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%201.28.31.png)

![image-20240709133746608](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709133746608.png)

- Claim rule name : 클레임 규칙을 식별하는 데 사용되는 이름으로 설정

- User's group :  Terraform Enterprise 관리자가 모두 포함된 AD 사용자 그룹 

- Outgoing claim type : Relying Party에 보낼 클레임의 유형 지정 

  MemberOf

  ![스크린샷 2024-07-09 오후 1.31.40](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%201.31.40.png)

- Outgoing Claim Value : 해당 그룹에 대한 클레임 값을 지정 
  Admin 또는 특정 그룹의 식별자(GUID)를 지정할 수 있습니다. 
  Outgoing Claim value와 관련하여 
  Terraform Enterprise Team 생성
  ![image-20240709133907002](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/image-20240709133907002.png)
  - SSO team ID란 IdP에서 정의된 특정 그룹의 멤버들이 Terraform Enterprise에 로그인할 때, 해당 그룹의 식별자를 통해 자동으로 팀에 할당되도록 합니다.
  - 팀 권한 및 엑세스를 중앙에서 관리할 수 있으며 사용자들이 IdP 그룹에 속함으로써 자동으로 적절한 권한이 부여됩니다.





# Trouble Shooting

##### 1) ADFS 구축 후 https://ADFS-HOSTNAME/adfs/ls/idpinitiatedsignon.aspx 들어가지지 않는 경우

Windows Powershell 을 통해 다음 명령어 입력

```bash
Set-AdfsProperties -EnableIdpInitiatedSignonPage $true
```



##### 2) Time Zone Error![스크린샷 2024-07-09 오후 1.45.36](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%201.45.36.png)

Time Zone이 맞지않아 발생하는 에러로 Terraform Enterprise의 Docker-compose.yaml에 TZ 추가

```bash
TZ: "Asia/Seoul"
```

Windows Date & time 에서 Time zone 동일하게 설정



##### 3) Relying Party Meatadata error

![스크린샷 2024-07-09 오후 1.50.06](https://raw.githubusercontent.com/sibiniiii/my-images/main/img/%E1%84%89%E1%85%B3%E1%84%8F%E1%85%B3%E1%84%85%E1%85%B5%E1%86%AB%E1%84%89%E1%85%A3%E1%86%BA%202024-07-09%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%201.50.06.png)

ADFS > Service > Device Registration Refresh 
