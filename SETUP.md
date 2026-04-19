# ⚡ 빠른 설치 가이드

## 30분 안에 완료하는 설치 순서

---

### ✅ Step 1 — Firebase 프로젝트 만들기 (10분)

1. **https://console.firebase.google.com** 접속 (본인 구글 계정)
2. **프로젝트 추가** 클릭
3. 프로젝트 이름 입력 → **계속** → **프로젝트 만들기**

#### Firestore 데이터베이스 활성화
4. 왼쪽 메뉴 **빌드 → Firestore Database**
5. **데이터베이스 만들기** 클릭
6. **프로덕션 모드** 선택 → 다음
7. 리전: **asia-northeast3 (서울)** 선택 → **완료**

#### Google 로그인 활성화
8. 왼쪽 메뉴 **빌드 → Authentication**
9. **시작하기** → **Google** 클릭 → 활성화 → **저장**

#### 웹 앱 등록 및 설정값 복사
10. 왼쪽 상단 ⚙️ **프로젝트 설정** 클릭
11. 하단 **내 앱** 섹션에서 **`</>`** (웹) 아이콘 클릭
12. 앱 닉네임 입력 → **앱 등록**
13. 아래와 같은 `firebaseConfig` 값이 나옴 → **복사**

```javascript
const firebaseConfig = {
  apiKey: "AIzaSy...",
  authDomain: "my-project.firebaseapp.com",
  projectId: "my-project",
  storageBucket: "my-project.firebasestorage.app",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
};
```

---

### ✅ Step 2 — config.js 수정 (2분)

`config.js` 파일을 열어서 Step 1에서 복사한 값으로 교체:

```javascript
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSy...",        // ← 교체
  authDomain:        "my-project.firebaseapp.com",  // ← 교체
  projectId:         "my-project",       // ← 교체
  storageBucket:     "my-project.firebasestorage.app",  // ← 교체
  messagingSenderId: "123456789",        // ← 교체
  appId:             "1:123456789:web:abcdef"  // ← 교체
};
```

---

### ✅ Step 3 — Firestore Rules 설정 (3분)

Firebase Console → **Firestore Database → 규칙** 탭 클릭

아래 내용 전체 복사 후 붙여넣기 → **게시**:

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

---

### ✅ Step 4 — 허용 사용자 등록 (2분)

Firebase Console → **Firestore Database → 데이터** 탭

1. **컬렉션 시작** 클릭
2. 컬렉션 ID: `allowed_users` 입력 → 다음
3. 문서 ID: 본인 이메일 주소 입력 (예: `john@gmail.com`)
4. 필드 추가: `name` / 문자열 / 본인 이름
5. **저장**

추가 사용자가 있으면 같은 방법으로 반복

---

### ✅ Step 5 — GitHub 업로드 (5분)

1. **https://github.com** 에서 새 repository 만들기
   - 이름 입력 (예: `banchan-app`)
   - **Public** 선택
   - **Create repository**

2. 모든 파일 업로드
   - **Add file → Upload files**
   - 전체 파일 드래그 & 드롭
   - **Commit changes**

3. GitHub Pages 활성화
   - **Settings → Pages**
   - Branch: **main** → **Save**

4. 잠시 후 접속:
   ```
   https://아이디.github.io/저장소명
   ```

---

### ✅ Step 6 — 앱으로 설치 (선택사항, 1분)

**iPhone (Safari)**
- 사이트 접속 → 하단 공유 버튼 → **홈 화면에 추가**

**Android (Chrome)**
- 사이트 접속 → 메뉴 → **앱 설치**

---

## ❓ 문제 해결

| 문제 | 해결 |
|------|------|
| 로그인이 안 돼요 | `allowed_users`에 이메일 추가됐는지 확인 |
| 데이터가 안 저장돼요 | Firestore Rules 게시됐는지 확인 |
| 페이지가 안 열려요 | GitHub Pages가 활성화됐는지 확인 |
| 앱 아이콘이 없어요 | `icons/` 폴더도 같이 업로드했는지 확인 |

---

## 📞 지원

문제가 있으면 원본 제작자(Josh)에게 문의하세요.
