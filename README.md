# new-project-manager
프로젝트 매니저를 계승 및 최신화하는 프로젝트

## 현재 앱 실행

Node.js/Express 앱과 MariaDB는 Docker Compose로 실행한다. `config/secret.example.json`을 `config/secret.json`으로, `.env.example`을 `.env`로 복사한 뒤 `auth_key`, `SESSION_SECRET`, `AUTHENTIK_CLIENT_SECRET`을 각각 안전한 값으로 설정한다. `docker compose up -d --build`를 실행하면 앱은 `http://localhost:3050`에서 열린다.

Authentik OAuth2/OIDC provider에는 `https://pm.casper.or.kr/auth/oidc/callback`을 Strict Redirect URI로 등록하고 `openid`, `profile`, `email` scope를 허용한다. 개발용으로 localhost에서 로그인하려면 Authentik에 `http://localhost:3050/auth/oidc/callback`을 추가하고 `.env`의 `AUTHENTIK_CALLBACK_URL`을 같은 주소로 바꾼다. 비밀 설정 파일은 Git에서 제외된다.
