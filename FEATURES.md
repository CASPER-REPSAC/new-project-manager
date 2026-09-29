# Feature Specification (Frontend Pages)

코드(views/, router/, feature/, static/js/) 기준으로 작성한 페이지별 상세 기능 명세.
"(추정)"으로 표시된 항목은 코드만으로 의도가 확정되지 않아 해석을 붙인 부분이다.

---

## 1. `/` — 메인 페이지 (`views/index.ejs`)

### 라우트 / 서버 데이터
- `GET /` → `router/index.js`
- `res.render("index", {...})` 전달값
  - `require` — `getRequireData()` 결과: `web_theme`, `check`, `is_login`, `feed`
  - `user_auth` — `getAuth()`: `"guest"` 또는 `"casper"`
  - `comment` — `getRecentCommentAndReply()`: 최근 3개월 댓글+답글 UNION, 최신 10개, 70자 초과 시 말줄임
  - `popular` — `getPopularProjects()`: `like_count >= 1` 기준 상위 12개, `DESC`

### UI 구성
- 좌측(8칸): `.project-list`(빈 컨테이너, JS로 채움) + "Load More Posts" 버튼
- 우측(4칸) 사이드바: "Recent Comments" / "Popular Projects" 토글 버튼 + 리스트 2개(서버 렌더, 하나는 초기 `display:none`)
- 공통 헤더: 로고, GitHub 이슈 링크, 로그인 상태별 버튼(로그인/로그아웃/Write/Mailing), guest면 "Auth" 모달 버튼

### 클라이언트 동작
- `static/js/api/index.js` — 로드 시 `getContent(1)`, "Load More" 클릭마다 `idx` 증가시켜 `/api/index?idx=` 반복 호출, 데이터 없으면 "No Data..." 1초 표시
- `static/js/HTML.js` — `projectBoxHTML()`(썸네일 빈값이면 base64 fallback), `commentBoxHTML()` 등 템플릿 함수(여러 페이지 공용)
- `static/js/api/darkmode.js` — 클릭 시 `<html web-theme>` 속성 변경 + localStorage 저장 + `/api/theme` 호출
- `static/js/api/auth.js` — 모달 토큰값을 `/api/auth`로 POST
- `static/js/api/feed.js` — 메일 수신 토글, `/feed?feed=0|1` 호출

### 호출 API
| Method | Path | 설명 |
|---|---|---|
| GET | `/api/index?idx=N` | `(idx-1)*10` OFFSET, 10개씩 최신순 반환 |
| GET | `/api/theme?data=dark\|light` | 세션에 `user_theme` 저장(DB 미반영) |
| POST | `/api/auth` | `token == secret.auth_key`면 guest→casper 승격 |
| GET | `/feed?feed=0\|1` | 로그인 필요, 신규 글 메일 알림 수신 여부 갱신 |

### 권한별 차이
- 비로그인: Login 버튼만
- 로그인+guest: Auth 모달 버튼 노출
- 로그인+casper: Auth 버튼 숨김, Write/Logout/Mailing 노출

### 특이사항
- **다크모드 토글 UI가 `header.ejs`에서 주석 처리**되어 있어 `darkmode.js`의 이벤트 핸들러가 바인딩될 대상이 없음 — 기능 사실상 비활성 상태
- `getUserTheme()`은 세션값 없으면 무조건 `"dark"` 반환 → 위 이유로 항상 dark로 렌더됨
- `/api/index`의 `idx`는 `Number()` 강제 변환 후 0/NaN이면 1로 폴백하나 음수 등 범위 검증은 없음

---

## 2. `/write` — 글쓰기 페이지 (`views/write.ejs`)

### 라우트 / 서버 데이터
- `GET /write` → `router/write.js`: `checkAuth()`(로그인 + casper 권한) 실패 시 alert 후 `/`로 리다이렉트
- `POST /write` — 동일 파일에서 폼 제출 처리(JSON 응답, 뷰 재렌더 아님)

### UI 구성 (3단계)
1. 프로젝트 유형 선택(캐스퍼/개인)
2. PDF 업로드
3. 상세정보 — 제목/부제/발표일/PDF 미리보기+썸네일 선택/섹션 반복 입력(설명+페이지범위)/의견/태그(`jquery.tagsinput.js`)/제출

### 클라이언트 동작
- `static/js/write.js` — 유형 선택, 섹션 추가/삭제(최소 1개 강제), 썸네일 선택, `getWriteData()`(클라이언트 검증: 제목/날짜/썸네일/의견/태그/섹션값/`checkRange()` 페이지 범위) → `sendToWrite()`
- `static/js/uploadEvent.js` — 파일 change 시 확장자 검사(pdf) → `FormData`로 `/api/upload` → 성공 시 `initPDF()` 호출
- `static/js/previewPDF.js` — pdf.js로 전체 페이지 캔버스 렌더링
- `static/js/feature/pdfToImg.js` — pdf.js 캔버스 렌더링 공용 함수(post/write/modify 공유)

### 호출 API
| Method | Path | 설명 |
|---|---|---|
| POST | `/api/upload` | `checkAuth` 필요, PDF만(확장자+MIME), 5MB 제한, `uuidv4()` 저장, `tmp_post_attach` upsert |
| POST | `/write` | 서버측 재검증 후 `post`/`post_attach` INSERT, `tmp_post_attach` 삭제, `feed=1` 사용자 전체에 Gmail 알림 발송 |

### 권한별 차이
- 비로그인/guest → `checkAuth()`에서 즉시 차단, 페이지 자체가 렌더되지 않음

### 특이사항
- 메일 발송(`router/feed/mailer.js`)은 `config/credentials.json`, `config/token.json` 필요 — 없으면 로그만 남기고 요청은 성공 응답(비동기 실패 무시)
- 작성 취소 시 `tmp_post_attach`에 남은 임시 업로드 파일을 정리하는 로직 없음 → 고아 파일 발생 가능

---

## 3. `/post/:idx` — 게시글 상세 (`views/post.ejs`)

### 라우트 / 서버 데이터
- `GET /post/:idx` → `router/post.js`. 글 없으면 alert+리다이렉트
- 전달값: `post_data`(contents는 `JSON.parse`됨), `post_attach`, `user_info.is_post_owner`, `comment_data`(댓글+`reply_comment` 배열), `count`, `side_posts`(이전/다음 `post_idx`)

### UI 구성
- 좋아요 화살표+카운트, 제목/부제/작성자(프로필 링크)/발표일/태그/다운로드
- 섹션별: 좌측 PDF 캔버스, 우측 설명 텍스트
- My Opinion, 소유자 전용 수정/삭제 버튼
- 댓글+답글(들여쓰기), 이전글/다음글 버튼(해시 앵커로 스크롤)

### 클라이언트 동작
- `pdfToImg.js`의 `showPDF()` — 섹션별 `start~end` 범위로 pdf.js 렌더링, 클릭 시 모달(이전/다음 페이지 이동)
- `static/js/modal.js` — ekko-lightbox + PDF 모달 리사이즈/재렌더
- `commentEvent.js` → `POST /api/comment`, `replyEvent.js` → `POST /api/reply`
- `api/delete.js` → `DELETE /api/post/:idx`, `api/like.js` → `GET /api/like/:idx`

### 호출 API
| Method | Path | 설명 |
|---|---|---|
| POST | `/api/comment` | 로그인 필요, 내용/글 존재 검증 후 INSERT |
| POST | `/api/reply` | 로그인 필요, 댓글/글 존재 검증 후 INSERT |
| DELETE | `/api/post/:idx` | 로그인+소유자 검증, 첨부파일 삭제 + post/comment/reply/attach/like 전체 삭제 |
| GET | `/api/like/:idx` | 로그인 필요, 중복 방지 후 count+1 |

### 권한별 차이
- 비로그인: 댓글/답글 작성 폼 미노출(기존 댓글 열람은 가능)
- 소유자만 수정/삭제 버튼 노출

### 특이사항
- 이전/다음 글은 작성일이 아닌 `post_idx` 대소 비교 기준
- `router/api/comment.js`에 주석 처리된 `checkAuth` 흔적 존재 — guest도 댓글/답글 작성 가능하도록 의도적으로 완화된 것으로 보임
- 댓글/답글 삭제 API는 없음(작성만 가능)

---

## 4. `/modify/:idx` — 게시글 수정 (`views/modify.ejs`)

### 라우트 / 서버 데이터
- `GET /modify/:idx` → `router/modify.js`: 비로그인 401, `idx` 비정상 403, 소유자 아니면 403. 통과 시 `req.session.post_idx` 저장
- `POST /modify` — 세션의 `post_idx`와 body 일치 검증 → 소유자 재검증 → 서버측 재검증(write와 동일 로직) → UPDATE

### UI 구성
- write.ejs와 유사하나 3단계 없이 상세정보 폼 바로 표시, hidden input으로 기존 데이터 프리필

### 클라이언트 동작
- `static/js/modify.js` — `init()`에서 기존 PDF 재렌더, hidden input JSON을 파싱해 섹션 필드 복원, 태그 복원(`tagsInput().addTag()`)
- `.btn-modify-submit` → `getWriteData()`(write.js 공용 검증 재사용) + `post_idx` → `POST /modify`

### 호출 API
- `POST /modify` — title/subtitle/contents/opinion/project_date/type/tag/thumbnail UPDATE(첨부파일 경로 UPDATE 로직 없음 — PDF 자체는 교체 불가)

### 권한별 차이
- 비로그인 401, 소유자 아니면 403 (소유자 전용 페이지)

### 특이사항
- `req.session.post_idx` 방식으로 다른 글의 `/modify/:idx`를 새로 GET하지 않고 예전 세션값으로 POST하면 실패 처리(보호 로직으로 보임)
- `uploadEvent.js`가 로드되지만 modify.ejs에는 대응하는 `<input type=file>`이 없어 실제 파일 재업로드 경로는 불명확
- `post_data.contents`가 서버에서 문자열화되어 내려오고 클라이언트에서 다시 파싱하는 이중 직렬화 구조 — 리팩토링 시 정리 후보

---

## 5. `/profile/:writer` — 프로필 페이지 (`views/profile.ejs`)

### 라우트 / 서버 데이터
- `GET /profile/:user_id` → `router/profile.js`: 없는 user_id면 alert+리다이렉트
- 전달값: `total`(좋아요 총합/프로젝트 수/댓글+답글 수), `tags`(작성 글 태그 전체, 중복 제거)
- `POST /profile/:user_id` — `option`(`summary`/`all_projects`/`all_comments`/`popular_projects`)별로 다른 쿼리 결과를 JSON 반환

### UI 구성
- 좌측: Summary/All Projects/All Comments/Popular Projects 탭 + 결과 영역
- 우측: 프로필 박스(이름, 통계, 태그 뱃지)

### 클라이언트 동작
- `static/js/api/profile.js` — 로드 시 기본 Summary 탭 조회, 탭 클릭마다 재조회 후 `projectBoxHTML`/`commentBoxHTML`로 렌더

### 호출 API
| option | 내용 |
|---|---|
| `summary` | 최근 글 4개 + 최근 3개월 댓글/답글 4개 |
| `all_projects` | 전체 글 |
| `all_comments` | 전체 댓글/답글(기간 제한 없음) |
| `popular_projects` | `like_count >= 1`, **좋아요 오름차순** |

### 권한별 차이
- 없음(로그인 불필요, 누구나 조회 가능 — README의 "선배님들 염탐 가능" 취지와 일치)

### 특이사항
- **정렬 방향 불일치**: 메인 페이지의 `getPopularProjects()`는 `DESC`인데 profile의 `popular_projects`는 오름차순(`ASC`) — 리팩토링 시 확인/통일 필요

---

## 6. `/404` — 캐치올 (`views/404.ejs`)

- `app.js`의 `app.get("*", ...)`가 처리, 서버 데이터 없음
- "4👻4" + "Page Not Found" 정적 텍스트만 표시
- 공용 `head.ejs`/`header.ejs`를 사용하지 않는 독립 레이아웃 → 오늘 추가한 GSAP 등 공용 스크립트도 이 페이지엔 로드되지 않음
- 클라이언트 JS·API 호출 없음

---

## 7. 공통 프래그먼트 (`views/fragment/`)

| 파일 | 용도 |
|---|---|
| `head.ejs` | 모든 뷰(404 제외) 공통 `<head>`. jQuery(slim)+Bootstrap4+FontAwesome+Google Fonts CDN. **GSAP 3.13.0 core + ScrollTrigger CDN 추가됨** |
| `header.ejs` | 로고, GitHub 이슈 링크, 로그인 상태별 버튼 그룹, 히어로 이미지. 다크모드 토글 UI는 주석 처리 상태 |
| `footer.ejs` | "open source" 링크만 있는 최소 구조 |

---

## 참고: README와의 불일치

`README.md`의 Project structure는 `feature/checkOauth.js`, `feature/checkTheme.js`를 언급하지만 실제로는 `feature/check.js` 하나에 `isLogin`/`getAuth`/`checkAuth`/`getUserTheme`/`isPostOwner`/`getFeed`가 모두 통합되어 있음. README가 과거 버전 기준으로 갱신되지 않은 것으로 보인다.

## 리팩토링 후보 (이번 분석에서 발견된 것)

1. 다크모드 토글 UI 부재로 `darkmode.js` 관련 코드가 죽어 있음 — 기능 복원 또는 코드 제거 결정 필요
2. `profile.js`의 `popular_projects` 정렬 방향이 메인 페이지와 반대(ASC vs DESC)
3. `modify.ejs`의 `contents` 이중 직렬화(서버 stringify → 클라이언트 재파싱)
4. 글쓰기 취소 시 `tmp_post_attach` 고아 파일 미정리
5. `modify.ejs`에 파일 재업로드 UI가 없는데 관련 스크립트(`uploadEvent.js`)만 로드됨
