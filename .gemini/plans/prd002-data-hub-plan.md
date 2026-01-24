# Plan: Strava 데이터 허브 구축 실행 계획

## Metadata
- **Related Spec**: Spec-prd002
- **Priority**: High

## 작업 목록 (Tasks)

### 1. 데이터베이스 구축 (DB Setup)
- [ ] **Task 1.1**: 마이그레이션 파일 생성.
    - 파일: `supabase/migrations/<timestamp>_init_schema.sql`
    - 내용: `profiles`, `activities`, `sync_logs` 테이블 생성 및 RLS 정책 적용 SQL 작성.
- [ ] **Task 1.2**: 원격 DB 배포 및 타입 생성.
    - 명령: `npx supabase db push` 후 `npx supabase gen types typescript ... > types/supabase.ts`

### 2. 인증 UI 구현 (Auth UI)
- [ ] **Task 2.1**: 로그인 버튼 컴포넌트 구현.
    - 파일: `components/auth/login-button.tsx`
    - 로직: `supabase.auth.signInWithOAuth({ provider: 'strava', options: { scopes: 'activity:read_all' } })`
- [ ] **Task 2.2**: 인증 콜백 라우트 구현.
    - 파일: `app/auth/callback/route.ts`
    - 로직: Authorization Code를 세션으로 교환(`exchangeCodeForSession`).

### 3. 백엔드 로직 구현 (Backend Logic)
- [ ] **Task 3.1**: Strava API 클라이언트 구현.
    - 파일: `lib/strava/api.ts`
    - 기능: `fetchActivities(token, after)` 구현.
- [ ] **Task 3.2**: 동기화 서비스 로직 구현.
    - 파일: `lib/strava/sync.ts`
    - 기능: 마지막 동기화 시간 조회 -> API 호출 -> DB Upsert -> 로그 기록 트랜잭션 처리.

### 4. UI 통합 및 검증 (Integration)
- [ ] **Task 4.1**: 로그인 상태에 따른 UI 분기 처리.
    - 파일: `app/page.tsx`
    - 로직: 비로그인 시 랜딩 페이지, 로그인 시 대시보드(스켈레톤) 표시.
- [ ] **Task 4.2**: 자동 동기화 트리거 연동.
    - 파일: `components/dashboard/dashboard-shell.tsx` (신규 생성)
    - 로직: `useEffect`로 컴포넌트 마운트 시 `syncActivities` 서버 액션 호출.