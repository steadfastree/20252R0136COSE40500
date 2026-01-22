# PRD: 기술 스택 마이그레이션 및 설정

## 1. 배경 및 목표 (Context & Goals)
이 프로젝트는 실무 환경의 예행연습으로서, 특정 기술 스택을 도입하고 Next.js의 기능을 최대한 활용하는 것을 목표로 합니다. 기존의 Prisma/NextAuth/SQLite 기반 구조에서 **Supabase 중심 아키텍처 (Auth & DB)**로 전환하고, 최신 프론트엔드 상태 관리 도구들을 도입합니다.

### 핵심 목표
1.  **제거 (Remove)**: Prisma 및 NextAuth.js 의존성 제거.
2.  **통합 (Integrate)**: Supabase를 인증(Strava OAuth) 및 데이터베이스(PostgreSQL) 솔루션으로 도입.
3.  **도입 (Adopt)**:
    *   **TanStack Query (v5)**: 서버 상태 관리 및 캐싱.
    *   **Zustand**: 클라이언트 UI 상태 관리.
    *   **AG Grid (Community)**: 데이터 시각화 및 그리드.
4.  **패키지 관리**: `pnpm`을 유일한 패키지 매니저로 확정 및 정리.

## 2. 요구사항 (Requirements)

### 2.1 패키지 관리
-   `pnpm`만 사용하도록 강제합니다.
-   남아있는 `npm` 관련 파일(`package-lock.json`, `node_modules`)이 있다면 제거합니다.

### 2.2 인증 및 데이터베이스 (Supabase)
-   **삭제 대상**: `prisma`, `@prisma/client`, `next-auth`, `@next-auth/prisma-adapter`.
-   **설치 대상**: `@supabase/supabase-js`, `@supabase/ssr`.
-   **설정**: 서버 컴포넌트(SSR)와 클라이언트 컴포넌트 각각을 위한 Supabase 클라이언트 유틸리티 함수 생성.
-   **환경 변수**: `.env.local`에 `NEXT_PUBLIC_SUPABASE_URL` 및 `NEXT_PUBLIC_SUPABASE_ANON_KEY` 추가 필요.

### 2.3 상태 관리 및 데이터 페칭
-   **설치 대상**: 
    *   `@tanstack/react-query`, `@tanstack/react-query-devtools`.
    *   `zustand`.
-   **설정**: 루트 레이아웃 또는 별도 Provider 컴포넌트에 `QueryClientProvider` 설정.

### 2.4 UI 컴포넌트
-   **설치 대상**: `ag-grid-react`, `ag-grid-community`.
-   **테마**: AG Grid 스타일(Quartz 테마 권장) import 설정.

## 3. 성공 기준 (Success Metrics)
-   `pnpm build`가 타입 에러 없이 성공해야 함.
-   사용하지 않는 파일들(`prisma/schema.prisma`, `app/api/auth/[...nextauth]`)이 완전히 삭제되어야 함.
-   테스트 페이지에서 Supabase 클라이언트가 정상 동작하고, React Query Provider가 활성화되어 있어야 함.