# Plan: Strava 데이터 허브 구축 실행 계획

## 개요
Spec-prd002에 정의된 데이터베이스 스키마와 인증/동기화 로직을 구현합니다.

## 작업 목록 (Tasks)

### 1. 데이터베이스 구축 (Database Setup)
- [ ] **Task 1.1**: 마이그레이션 파일 생성 (`profiles`, `activities`, `sync_logs` 테이블).
    - 명령: `npx supabase migration new create_initial_schema`
    - SQL 작성: 테이블 정의 및 RLS 정책 포함.
- [ ] **Task 1.2**: 로컬 DB에 마이그레이션 적용 및 원격 DB 배포.
    - 명령: `npx supabase db reset` (로컬 테스트) -> `npx supabase db push` (원격 배포)
- [ ] **Task 1.3**: 타입 정의 업데이트.
    - 명령: `npx supabase gen types typescript --project-id <PROJECT_ID> > types/supabase.ts`

### 2. 인증 구현 (Authentication)
- [ ] **Task 2.1**: 로그인 버튼 컴포넌트 (`components/auth/login-button.tsx`) 구현.
    - Supabase `signInWithOAuth` 로직 적용 (scope: `activity:read_all` 필수).
- [ ] **Task 2.2**: 인증 콜백 처리 및 리다이렉트 설정.
    - `app/auth/callback/route.ts` 구현 (Supabase Auth 헬퍼 활용).

### 3. Strava API 연동 (Strava Integration)
- [ ] **Task 3.1**: Strava API 클라이언트 (`lib/strava/api.ts`) 구현.
    - axios 또는 fetch를 사용하여 Strava API 호출 함수 작성.
- [ ] **Task 3.2**: 동기화 로직 (`lib/strava/sync.ts`) 구현.
    - DB 적재(Upsert) 로직 및 `last_synced_at` 갱신 처리.

### 4. UI 및 통합 (UI & Integration)
- [ ] **Task 4.1**: 메인 대시보드(`app/page.tsx`)에 동기화 상태 표시 컴포넌트 추가.
- [ ] **Task 4.2**: 로그인 후 자동 동기화 트리거 (useEffect 또는 서버 액션 활용).

### 5. 검증 (Verification)
- [ ] **Task 5.1**: 전체 빌드 및 린트 테스트.
- [ ] **Task 5.2**: 실제 로그인 및 데이터 적재 테스트 (Supabase 대시보드에서 데이터 확인).
