# Spec: 마이그레이션 아키텍처 설계

## 1. 개요
PRD-001에 따라 기술 스택을 Supabase, TanStack Query, Zustand로 전환하기 위한 아키텍처 상세 설계입니다. Next.js App Router의 특성(Server/Client Component 분리)을 고려하여 각 라이브러리의 인스턴스 관리와 Provider 구조를 정의합니다.

## 2. 패키지 및 파일 구조 변경

### 2.1 삭제 및 정리
다음 파일 및 폴더는 더 이상 사용되지 않으므로 삭제합니다.
-   `prisma/` (폴더 전체)
-   `lib/prisma.ts`
-   `app/api/auth/` (NextAuth 라우트 폴더 전체)
-   `components/auth-button.tsx` (Supabase용으로 재작성 필요하므로 삭제 후 재생성 권장)

### 2.2 신규 폴더 구조
```text
/
├── utils/
│   └── supabase/
│       ├── client.ts   # 클라이언트 컴포넌트용 (Browser Client)
│       ├── server.ts   # 서버 컴포넌트/액션용 (Server Client)
│       └── middleware.ts # 미들웨어용 (선택 사항, 추후 인증 가드용)
├── components/
│   └── providers/
│       ├── query-provider.tsx  # TanStack Query Client Provider
│       └── theme-provider.tsx  # (기존 유지)
├── lib/
│   └── store/          # Zustand 스토어 위치
│       └── use-ui-store.ts
```

## 3. 상세 구현 설계

### 3.1 Supabase 클라이언트 (`@supabase/ssr`)
Next.js의 Cookie 기반 인증을 지원하기 위해 `@supabase/ssr` 패키지를 사용합니다.

*   **`utils/supabase/client.ts`**: `createBrowserClient` 사용. Singleton 패턴으로 브라우저에서 인스턴스 재사용.
*   **`utils/supabase/server.ts`**: `createServerClient` 사용. `cookies()` 훅을 주입하여 서버 사이드 세션 처리.

### 3.2 TanStack Query 설정
*   **`components/providers/query-provider.tsx`**:
    *   `'use client'` 지시어 필수.
    *   `useState`를 사용하여 `QueryClient` 인스턴스를 컴포넌트 생명주기 동안 한 번만 생성(Lazy Initialization)하여 데이터 유실 방지.
    *   `staleTime`: 기본 60초 설정 (불필요한 네트워크 요청 방지).

### 3.3 Zustand 스토어
*   **`lib/store/use-ui-store.ts`**:
    *   전역 UI 상태(예: 사이드바 토글, 모달 상태) 관리.
    *   Devtools 미들웨어 연결.

### 3.4 환경 변수 타입 (`env.d.ts`)
TypeScript 인텔리센스를 위해 `process.env` 타입을 확장합니다.
```typescript
namespace NodeJS {
  interface ProcessEnv {
    NEXT_PUBLIC_SUPABASE_URL: string;
    NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
  }
}
```

## 4. 데이터 모델링 (간략)
Prisma 스키마를 제거하고 Supabase Table로 대체합니다. (상세 스키마는 별도 Spec 필요, 여기서는 연결 방식만 정의)
*   기존 Prisma Schema의 `User`, `Account` 테이블은 Supabase Auth의 `auth.users`와 `public.users` 트리거 연동 방식으로 대체될 예정입니다.

## 5. 의존성 패키지
```bash
pnpm remove prisma @prisma/client next-auth @next-auth/prisma-adapter @types/react @types/react-dom
pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query @tanstack/react-query-devtools zustand ag-grid-react ag-grid-community
pnpm add -D @types/react@latest @types/react-dom@latest # React 18 호환성 유지 확인
```
