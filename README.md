# Kookje TNC Frontend

공지사항과 자료실 중심 사이트를 위한 React/Vite 프론트엔드 골격입니다. 기존 템플릿성 화면과 레퍼런스 자산을 걷어내고, 실제 콘텐츠와 API 연동을 붙이기 쉬운 최소 구조만 남겼습니다.

## 현재 구조

- `src/pages`: 홈, 회사 소개, 공지사항, 자료실, 공통 에러 페이지
- `src/app`: 앱 프로바이더, 라우터 연결, 에러 바운더리
- `src/components`: 공용 버튼, 토스트, 입력 컴포넌트
- `src/data`: 프론트 샘플 콘텐츠
- `src/styles`: 디자인 토큰, 믹스인, 전역 스타일

## 시작

```bash
nvm use
npm install
npm run dev
```

이 저장소는 Node.js `24.14.1` 기준으로 맞춰져 있습니다. 현재 도구 체인은 `vite@8`, `vitest@4`, `jsdom@29` 조합이며, Node.js `23.x`를 공식 지원 범위에 포함하지 않으므로 `23.x`에서는 `EBADENGINE` 오류가 발생합니다.

`nvm`을 사용하지 않는 경우에도 Node.js 버전을 `24.14.1`로 맞춘 뒤 설치를 진행해 주세요.

환경변수 예시:

```bash
VITE_APP_NAME=Kookje TNC
VITE_API_URL=http://localhost:8080
```

## 검증 명령

```bash
npm test
npm run typecheck
npm run lint
npm run lint:style
npm run build
```

## 다음 단계

1. `src/data/siteContent.ts`를 실제 백엔드 API 연동으로 교체
2. 회사 소개/공지사항/자료실의 실제 콘텐츠 모델 반영
3. 관리자 기능과 작성/수정 플로우 연결
