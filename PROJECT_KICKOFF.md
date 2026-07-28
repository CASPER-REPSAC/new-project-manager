---
marp: true
theme: default
paginate: true
header: 프로젝트 허브
footer: Project Kickoff · 2026-07-28
---

<style>
section {
  font-family: "Pretendard Variable", Pretendard, "Noto Sans KR", sans-serif;
  background: #f7f8fa;
  color: #111827;
  padding: 60px 72px;
  font-size: 26px;
  line-height: 1.45;
}
h1 {
  color: #111827;
  font-size: 48px;
  line-height: 1.2;
  margin-bottom: 28px;
}
h2 {
  color: #374151;
  font-size: 32px;
}
strong {
  color: #2563eb;
}
table {
  width: 100%;
  font-size: 22px;
}
th {
  background: #dbeafe;
}
code {
  color: #0891b2;
}
section.lead {
  background: #111827;
  color: #f7f8fa;
}
section.lead h1 {
  color: #ffffff;
  font-size: 72px;
}
section.lead h2 {
  color: #bfdbfe;
}
</style>

<!-- _class: lead -->
<!-- _header: "" -->
<!-- _footer: "" -->

# 프로젝트 허브

## 발표 자료·문서·협업을 하나의 흐름으로

Project Kickoff · 2026-07-28

---

# 자료는 모였지만, 맥락은 흩어져 있다

- 발표 자료, 소스, 회의록과 일정이 **서로 다른 공간**에 존재한다.
- PDF의 특정 슬라이드에 대한 질문과 답변을 **다시 찾기 어렵다**.
- 프로젝트 상태와 문서 상태가 분리되어 **중복 관리**가 발생한다.
- 검색, 권한, 변경 이력이 도구마다 달라 **팀 지식이 축적되지 않는다**.

**우리가 만드는 것은 파일 보관함이 아니라 프로젝트 지식의 연결점이다.**

---

# 하나의 제품 안에서 두 작업 모드를 연결한다

| 프로젝트 매니저 | 공통 기반 | 마크다운 공간 |
| --- | --- | --- |
| 프로젝트 탐색·비교 | SSO·통합 검색 | 블록 문서 작성 |
| PDF 발표 자료 검토 | 알림·권한 | 데이터베이스 5대 뷰 |
| Q&A와 피드백 | URL 기반 상태 복원 | 실시간 공동 편집 |
| 작성자·기술 스택 필터 | 연결 문서·마일스톤 | 이력·백링크·공개 |

**쇼케이스의 발견 경험과 워크스페이스의 실행 경험을 끊김 없이 이어준다.**

---

# MVP는 네 개의 수직 기능으로 자른다

1. **접속과 공간**
   - SSO, 워크스페이스, 컬렉션, 문서 트리
2. **작성과 협업**
   - 블록 에디터, 중첩 페이지, 댓글, 동시 편집
3. **구조화와 조회**
   - 데이터베이스 속성, Table·Board·Calendar·Gallery·List
4. **발표와 피드백**
   - 프로젝트 등록, PDF 뷰어, 딥링크, Q&A

각 기능은 UI·API·DB·권한·테스트까지 **끝까지 연결**한다.

---

# 첫 사용자 여정이 제품의 기준이 된다

**검색·필터**
→ 프로젝트 선택
→ PDF 검토
→ `#p12` 질문
→ 관련 문서 확인
→ 일정·상태 갱신

- 필터, 뷰 모드, PDF 페이지와 활성 탭은 URL로 복원한다.
- 댓글과 슬라이드, 프로젝트와 문서, 마일스톤과 데이터베이스를 직접 연결한다.
- 저장·업로드·동기화·권한 상태를 사용자가 추측하게 만들지 않는다.

---

# 12주는 기반 → 코어 → 통합 → 안정화로 진행한다

| 단계 | 기간 | 핵심 결과 |
| --- | --- | --- |
| Phase 0 | Week 1–2 | 요구사항, UX, 아키텍처, 개발 환경 |
| Phase 1 | Week 3 | SSO, 워크스페이스, 컬렉션 |
| Phase 2 | Week 4–7 | 에디터, 중첩 페이지, 실시간 협업 |
| Phase 3 | Week 6–9 | 데이터베이스와 5대 뷰 |
| Phase 4 | Week 8–10 | 프로젝트 탐색, PDF, Q&A |
| Phase 5 | Week 11–12 | 검색, 권한, 연동, QA·배포 |

Phase 2–4는 병렬로 진행하되 공통 상태·권한 규칙을 먼저 고정한다.

---

# 4명이 도메인을 끝까지 소유한다

| 역할 | 책임 영역 |
| --- | --- |
| Dev 1 · Tech Lead | 인증, 코어 백엔드, 실시간 서버, CI/CD |
| Dev 2 · Editor Lead | 블록 에디터, 중첩 페이지, 문서 이력 |
| Dev 3 · UI & DB Lead | 디자인 시스템, 데이터베이스, 다중 뷰 |
| Dev 4 · PM Feature | 프로젝트 매니저, PDF, Q&A, 통합 검색 |

- 검증된 오픈소스 코어를 감싸고 제품 규칙은 adapter·plugin 계층에 둔다.
- AI가 만든 코드는 담당자가 검토하고 테스트와 함께 병합한다.
- 스키마와 API 명세를 단일 진실 공급원으로 유지한다.

---

# 완료의 기준은 “보임”이 아니라 “연결됨”이다

- 핵심 흐름이 UI·API·DB·권한·오류 처리까지 동작한다.
- 단위 테스트 또는 E2E 테스트가 대표 사용자 여정을 보호한다.
- `lint`, `typecheck`, `test`, `build`, migration 검증을 통과한다.
- loading, empty, error, permission, offline 상태가 존재한다.
- 데스크톱·태블릿·모바일과 키보드 흐름을 검증한다.
- PDF 딥링크와 관련 문서 이동이 실제 맥락을 유지한다.

---

<!-- _class: lead -->
<!-- _header: "" -->
<!-- _footer: "" -->

# 오늘 확정할 것

## 범위 · 기술 선택 · 소유권 · 첫 번째 데모

1. Phase 0 산출물과 승인 기준 확정
2. 에디터·실시간 협업·검색 엔진 후보 결정
3. 공통 스키마와 권한 모델 담당자 지정
4. Week 3 데모: **로그인 → 프로젝트 목록 → 문서 트리**

