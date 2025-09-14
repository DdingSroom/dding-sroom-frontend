# 🏫 dding-sroom-frontend
[2025-MJU] 명지대학교 학생회관 4층 스터디룸 대여 서비스 - **띵스룸 (Frontend)**

---

## 1. 서비스 개요

> **띵스룸(DdingsRoom)**  
> 명지대학교 학생회관 4층에 위치한 **1~5번 스터디룸을 쉽고 편리하게 예약**할 수 있도록 개발된 스터디룸 대여/관리 서비스입니다.

- 기존 **도서관 스터디룸 예약 앱**과 유사한 UI/UX 및 프로세스를 반영  
- 학생회관에서도 도서관과 동일한 방식으로 예약 가능  
- 예약 시스템을 통해 **공정한 사용 환경** 보장  
- **2025년 8월 17일 ~ 8월 31일 시범 운영**을 거쳐, 명지대학교 **학생지원팀의 승인 하에 9월 1일부터 공식 운영** 시작  

---

## 2. 기존 문제점과 한계

자유롭게 드나들 수 있었던 기존 ‘학생회관 스터디룸’에서는 다음과 같은 문제가 있었습니다.

| 문제점 | 상세 내용 |
| --- | --- |
| 장시간 자리 차지 | 일부 사용자가 장시간 자리를 차지해 대다수 학생이 사용 불가 |
| 음식물 섭취 & 정리 미흡 | 음식물 섭취 후 뒷정리 부족 → 위생 저하 |
| 짐을 두고 방치 | 개인이 짐을 두고 장기간 독점 사용 → 공정성 저해 |

---

## 3. 띵스룸이 제시한 해결책

띵스룸은 **도서관 앱 수준의 스마트한 예약 시스템**을 학생회관에 그대로 도입했습니다.

- **명확한 예약 시스템 도입**  
  예약 없이는 사용 불가 → 모든 학생이 동등하게 이용
- **시간별 사용 관리**  
  예약 시간 준수 → 불필요한 독점 방지
- **예약 내역 기반 관리**  
  사용 내역 및 시간 확인·조정 가능
- **건의하기 기능**  
  보드마카 부족·위생 문제 등 불편사항을 쉽게 전달  
  사용자 의견 기반 개선 가능

---

## 4. 주요 기능 소개

### 🔑 회원가입
학교 이메일(@mju.ac.kr) 인증 → 비밀번호/닉네임 설정 → 개인정보 처리방침 동의 후 완료  
<img src="./images/signup.png" width="500"/>

---

### 🔓 로그인
가입한 이메일/비밀번호 입력 후 로그인 → 홈으로 이동  
<img src="./images/login.png" width="500"/>

---

### 🗓️ 예약하기
오늘/내일 탭에서 원하는 방과 시간 선택 → 예약 단위: 1~2시간 → 연속 예약 제한  
<img src="https://github.com/user-attachments/assets/e56322fb-4d72-401a-bdff-0c9e97d0dfc3" width="500"/>
<img src="https://github.com/user-attachments/assets/5c23d7e6-8aa8-4954-a2bd-ec07391f88bc" width="500"/>
<img src="https://github.com/user-attachments/assets/125b6b9f-7b3c-4c5e-954a-2f9c2ed46f98" width="500"/>
<img src="https://github.com/user-attachments/assets/ca4f5fcf-42f1-4ae5-b108-8d1395d95148" width="500"/>

---

### 👤 마이페이지
내 예약 내역 확인 및 취소, 닉네임/비밀번호 변경, 로그아웃/회원탈퇴  
<img src="./images/mypage.png" width="500"/>

---

### 💬 커뮤니티
자유글, 질문/답변, 공간 후기 공유  
<img src="./images/community.png" width="500"/>

---

### 📝 건의하기
스터디룸 내 불편사항(위생, 보드마카 부족 등)을 간편하게 전달  
<img src="./images/suggestion.png" width="500"/>

---

### 📢 공지사항
관리자가 등록한 공지가 실시간으로 사용자 화면에 반영  
<img src="./images/notice.png" width="500"/>

---

### 🛠️ 관리자 페이지
학사지원팀 전용 페이지 → 예약 현황, 유저 관리, 건의사항 확인, 공지 등록 가능  
<img src="./images/admin.png" width="500"/>

---

## 5. 예약 프로세스

- 학생 1명이 스터디룸을 예약 가능  
- 예약 단위: **1시간 또는 2시간**  
- 동일 룸에서 연속 예약 불가  
- 예약 가능 범위: **당일 및 익일**  

---

## 6. 기술 스택 (Frontend)

- **Framework:** ![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
- **Language:** ![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
- **State Management:** ![Zustand](https://img.shields.io/badge/Zustand-764ABC?style=for-the-badge&logo=react&logoColor=white)
- **Styling:** ![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
- **Deploy:** ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)  

---

## 7. 프로젝트 배포 및 링크

- 공식 서비스 페이지: [https://www.ddingsroom.com/](https://www.ddingsroom.com/)  
- 운영 현황: **2025년 8월 17일 ~ 8월 31일 시범 운영 완료 후, 9월 1일부터 정식 운영 중**

---

## 👥 팀원 소개

| 역할 | 이름 | GitHub |
| --- | --- | --- |
| ✏️ Product Manager | 정유진 | [GitHub 바로가기](https://github.com/hello-yujin) |
| ✏️ Product Manager | 최은택 | [GitHub 바로가기](https://github.com/euntaek4187) |
| 🎨 Frontend | 정유진 | [GitHub 바로가기](https://github.com/hello-yujin) |
| 🔧 Backend | 최은택 | [GitHub 바로가기](https://github.com/euntaek4187) |
| 🔧 Backend | 정경훈 | [GitHub 바로가기](https://github.com/agi040922) |
| 🔧 Backend | 김예본 | [GitHub 바로가기](https://github.com/kyb65) |
| 🔧 Backend | 최진원 | [GitHub 바로가기](https://github.com/jinwon0107) |

---
