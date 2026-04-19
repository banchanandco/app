# 🥘 Banchan & Co — 재고 관리 웹앱

한식 식당을 위한 모바일 우선 재고 관리 시스템입니다.  
Firebase 기반으로 실시간 동기화되며, GitHub Pages를 통해 무료로 호스팅됩니다.

![PWA](https://img.shields.io/badge/PWA-지원-green)
![Firebase](https://img.shields.io/badge/Firebase-Firestore-orange)
![GitHub Pages](https://img.shields.io/badge/GitHub_Pages-호스팅-blue)

---

## 📱 주요 기능

| 페이지 | 기능 |
|--------|------|
| 🏠 홈 | 메인 대시보드, 빠른 메뉴 |
| 📋 재고 관리 | 입고 / 재고 / 출고 / 주문요망 / Urgent |
| 🛒 주문 관리 | 거래처별 주문 목록, 복사, 쇼핑리스트 전송 |
| 🛍 쇼핑 리스트 | 체크리스트, 주문리스트 연동, 메모장 |
| 📊 통계 | 입고/재고/출고 일간·주간·월간 통계 |
| 📅 스케줄 | 월별 스케줄 캘린더 |
| 🧮 원가계산 | 재료 단가 관리 (PIN 잠금) |
| 📖 레시피 | 레시피 관리, 원가 자동계산, 재고 반영 (PIN 잠금) |

---

## 🚀 설치 및 설정

### 1. Firebase 프로젝트 생성

1. [Firebase Console](https://console.firebase.google.com) 접속
2. **프로젝트 추가** → 이름 입력 → 만들기
3. **빌드 → Firestore Database** → 데이터베이스 만들기 → `asia-northeast3 (서울)` 선택
4. **빌드 → Authentication → 시작하기 → Google** 활성화
5. **프로젝트 설정(⚙️) → 웹 앱 추가(`</>`)** → `firebaseConfig` 값 복사

### 2. config.js 설정

`config.js` 파일을 열어 Firebase 설정값을 교체합니다:

```javascript
const FIREBASE_CONFIG = {
  apiKey: "여기에_입력",
  authDomain: "여기에_입력",
  projectId: "여기에_입력",
  storageBucket: "여기에_입력",
  messagingSenderId: "여기에_입력",
  appId: "여기에_입력"
};
```

### 3. Firestore Rules 설정

Firebase Console → Firestore → 규칙 탭에서 아래 내용으로 교체 후 게시:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /allowed_users/{email} {
      allow read: if request.auth != null;
    }
    match /inv_food/{doc}      { allow read, write: if true; }
    match /inv_veggie/{doc}    { allow read, write: if true; }
    match /inv_meat/{doc}      { allow read, write: if true; }
    match /inv_container/{doc} { allow read, write: if true; }
    match /inv_misc/{doc}      { allow read, write: if true; }
    match /inv_clean/{doc}     { allow read, write: if true; }
    match /inv_other/{doc}     { allow read, write: if true; }
    match /{document=**} {
      allow read, write: if request.auth != null &&
        exists(/databases/$(database)/documents/allowed_users/$(request.auth.token.email));
    }
  }
}
```

### 4. 허용 사용자 등록

Firebase Console → Firestore → 데이터 탭:

```
allowed_users (컬렉션)
  └── 사용자이메일@gmail.com (문서 ID)
        name: "홍길동"
```

### 5. GitHub Pages 배포

1. GitHub에 새 repository 생성 (Public)
2. 모든 파일 업로드
3. **Settings → Pages → Branch: main → Save**
4. `https://아이디.github.io/저장소명` 으로 접속

---

## 📁 파일 구조

```
/
├── config.js              ← Firebase 설정 (이 파일만 수정!)
├── index.html             ← 로그인 페이지
├── main.html              ← 홈 대시보드
├── inventory.html         ← 재고 관리
├── orders.html            ← 주문 관리
├── shopping.html          ← 쇼핑 리스트 & 메모장
├── statistics.html        ← 통계
├── schedule.html          ← 스케줄
├── cost.html              ← 원가계산 (PIN: 설정 필요)
├── recipe.html            ← 레시피 (PIN: 설정 필요)
├── manifest.json          ← PWA 설정
├── sw.js                  ← 서비스워커 (오프라인 지원)
├── Invoice_AppsScript.js  ← Google Sheets 인보이스 자동화
└── icons/                 ← 앱 아이콘
```

---

## 🗄️ Firestore 데이터 구조

```
allowed_users/{email}          - 허용 사용자
inv_food/{docId}               - 소스·양념 재고
inv_veggie/{docId}             - 야채 재고
inv_meat/{docId}               - 고기 재고
inv_container/{docId}          - 컨테이너 재고
inv_misc/{docId}               - 소모품 재고
inv_clean/{docId}              - 청소 재고
inv_other/{docId}              - 기타 재고
item_lists/{secId}             - 섹션별 품목 목록
item_conversions/{secId}       - 단위 변환 설정
vendors                        - 거래처 목록
order_config/item_vendors      - 아이템→거래처 매핑
order_config/pending_shopping  - 주문→쇼핑 전달 데이터
schedules/{year_month}         - 스케줄
cost_ingredients               - 원가 재료
recipes                        - 레시피
shopping_items                 - 쇼핑 리스트
memos                          - 메모
```

---

## 📊 Google Sheets 인보이스 자동화

`Invoice_AppsScript.js` 를 Google Sheets에 연동하면 인보이스 사진을 AI로 자동 분석합니다.

### 설정 방법

1. Google Sheets 새 파일 생성
2. **확장 프로그램 → Apps Script** 열기
3. `Invoice_AppsScript.js` 내용 전체 붙여넣기
4. 저장 후 **🥘 Banchan Invoice → 📋 초기 설정** 실행

### Google Drive 구조

```
Google Drive/
├── Invoice Photos/          ← 인보이스 사진 넣는 곳
└── 거래처별 Invoice/
    ├── RST/
    │   ├── 사진/            ← 분석 완료 사진 자동 이동
    │   └── 2026-04-10      ← Google Sheet 자동 저장
    └── H Mart/
        ├── 사진/
        └── 2026-04-10
```

---

## 📱 PWA 설치 (앱처럼 사용)

### iOS (Safari)
1. Safari에서 사이트 접속
2. 하단 공유 버튼 → **홈 화면에 추가**

### Android (Chrome)
1. Chrome에서 사이트 접속
2. 주소창 옆 메뉴 → **앱 설치** 또는 **홈 화면에 추가**

---

## 🔧 카테고리 구조

| ID | 한국어 | 이모지 |
|----|--------|--------|
| food | 소스,양념 | 🥩 |
| veggie | 야채 | 🥬 |
| meat | 고기 | 🍖 |
| container | 컨테이너 | 📦 |
| misc | 소모품 | 🪣 |
| clean | 청소 | 🧹 |
| other | 기타 | 📂 |

---

## 🛠️ 기술 스택

- **Frontend**: Vanilla HTML/CSS/JavaScript (프레임워크 없음)
- **Database**: Firebase Firestore (실시간 동기화)
- **Auth**: Firebase Authentication (Google OAuth)
- **Hosting**: GitHub Pages
- **AI**: Google Gemini API (인보이스 사진 분석)
- **Automation**: Google Apps Script (Sheets 연동)
- **Fonts**: Noto Sans KR, DM Mono

---

## 📝 라이선스

Private — Banchan & Co 전용
