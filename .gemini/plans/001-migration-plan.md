# Plan: 기술 스택 마이그레이션 실행 계획

## 개요
Spec-001에 정의된 아키텍처로 전환하기 위한 단계별 실행 계획입니다. 각 단계는 완료 후 커밋 가능한(Atomic Commit) 단위로 구성됩니다.

## 작업 목록 (Tasks)

### 1. 정리 (Cleanup)
- [ ] **Task 1.1**: Prisma 및 NextAuth 관련 패키지 제거.
    - 명령: `pnpm remove prisma @prisma/client next-auth @next-auth/prisma-adapter @auth/prisma-adapter`
- [ ] **Task 1.2**: 사용하지 않는 파일 및 폴더 삭제.
    - 대상: `prisma/`, `lib/prisma.ts`, `app/api/auth/`, `components/auth-button.tsx`, `components/providers.tsx` (내용 백업 확인 후 삭제)

### 2. 설치 (Install)
- [ ] **Task 2.1**: 신규 라이브러리 설치.
    - 명령: `pnpm add @supabase/supabase-js @supabase/ssr @tanstack/react-query @tanstack/react-query-devtools zustand ag-grid-react ag-grid-community`

### 3. Supabase 설정 (Setup Supabase)
- [ ] **Task 3.1**: Supabase 클라이언트 유틸리티 구현.
    - 파일 생성: `utils/supabase/server.ts`, `utils/supabase/client.ts`
    - Spec-001의 3.1 항목 준수.
- [ ] **Task 3.2**: 환경 변수 타입 정의 추가 (`env.d.ts` 또는 `types/node-env.d.ts`).

### 4. TanStack Query 설정 (Setup Query)
- [ ] **Task 4.1**: `QueryProvider` 컴포넌트 구현.
    - 파일 생성: `components/providers/query-provider.tsx`
    - `QueryClient` 생성 및 `ReactQueryDevtools` 포함.
- [ ] **Task 4.2**: Root Layout에 Provider 적용.
    - 파일 수정: `app/layout.tsx` (기존 `Providers` 컴포넌트 대체).

### 5. Zustand 설정 (Setup Zustand)
- [ ] **Task 5.1**: 예시용 UI 스토어 생성.
    - 파일 생성: `lib/store/use-ui-store.ts` (간단한 sidebarOpen 상태 등으로 테스트).

### 6. 검증 (Verification)
- [ ] **Task 6.1**: 전체 빌드 및 린트 검사.
    - 명령: `pnpm build && pnpm lint`
    - 오류 발생 시 수정 후 최종 커밋.

## 실행 가이드
각 Task를 완료할 때마다 `git commit`을 제안해야 합니다.
예: `chore: remove legacy auth and database packages`
