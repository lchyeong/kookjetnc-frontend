# Agency React Starter

Vite + React + TypeScript + SCSS + React Query + MSW 기반의 범용 프론트엔드 스타터입니다. 현재 저장소는 서비스 고유 코드 대신, 다른 외주 프로젝트에 바로 이식할 수 있는 공통 코어만 남기도록 정리되어 있습니다.

## 포함된 코어

- `src/pages`: 스타터 홈, 컴포넌트 플레이그라운드, 공통 에러 페이지
- `src/components`: `Button`, `TextField`, `Modal`, `Toast`, `LoadingSpinner`, `PlaceholderPage`
- `src/query`, `src/api`, `src/mocks`: 비동기 데이터 흐름 예제 1세트
- `src/styles`: 토큰, 믹스인, 전역 스타일
- `src/app`: `QueryClientProvider`, `RouterProvider`, 에러 바운더리

## 시작 방법

```bash
npm install
npm run dev
```

기본 환경변수는 아래 3개만 사용합니다.

```bash
VITE_APP_NAME=Agency Starter
VITE_API_URL=https://api.example.com
VITE_ENABLE_MOCK=true
```

## Playground

`/playground` 화면에는 아래 예제가 들어 있습니다.

- 공통 버튼과 토스트 상태
- 텍스트 입력/텍스트 영역 폼
- 포커스 트랩이 포함된 모달
- `React Query + axios + MSW` 목록 조회 예제

이 화면은 차기 프로젝트에서 가장 먼저 교체될 데모 표면입니다.

## 검증 명령

```bash
npm test
npm run typecheck
npm run lint
npm run lint:style
npm run build
```

## 교체 우선순위

1. `src/pages/HomePage`, `src/pages/PlaygroundPage`를 새 프로젝트 화면으로 교체
2. `src/mocks/data/exampleItems.ts`와 `src/api/exampleItems.ts`를 실제 API 계약으로 교체
3. `src/styles/tokens/*`에서 브랜드 토큰과 타이포를 프로젝트별로 조정
