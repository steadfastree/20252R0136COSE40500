# PRD: Strava 데이터 허브 및 인증 (Data Hub)

## Metadata
- **Status**: In Progress
- **Depends On**: PRD-001 (Tech Stack Migration)
- **Unblocks**: PRD-003, PRD-004, PRD-005, PRD-006

## 1. 개요 (Overview)
사용자의 Strava 계정을 안전하게 연결하고, 활동 데이터를 중앙(Supabase)으로 동기화하여 서비스의 데이터 기반을 구축합니다.

### 목적 (Why)
- **데이터 소유권**: Strava API에 의존하지 않고, 자체 DB에 데이터를 저장하여 빠른 조회와 가공을 가능하게 함.
- **분석 기반 마련**: ACWR, VDOT 등 복잡한 연산을 수행하기 위해 Raw Data를 확보해야 함.

## 2. 사용자 시나리오 (User Stories)
1.  **신규 사용자**: "Connect with Strava" 버튼을 클릭하여 별도 가입 절차 없이 로그인하고, 최근 3개월간의 데이터를 자동으로 불러온다.
2.  **기존 사용자**: 앱을 켤 때마다 자동으로 최신 기록이 동기화되어, 방금 뛰고 온 기록을 즉시 확인할 수 있다.
3.  **데이터 관리**: 동기화 상태(성공/실패/진행중)를 UI에서 확인할 수 있다.

## 3. 핵심 기능 요구사항 (Features)

### 3.1 인증 (Authentication)
-   **Supabase Auth**: Strava OAuth Provider 연동.
-   **세션 관리**: 로그인 시 Access Token, Refresh Token을 안전하게 저장 및 관리. (Supabase Auth 내부 메커니즘 활용)
-   **프로필 생성**: 회원가입 시 `public.profiles` 테이블에 Strava 프로필 정보(이름, 사진) 자동 저장.

### 3.2 데이터 동기화 (Data Synchronization)
-   **최초 동기화**: 가입 시점 기준 과거 90일 활동 데이터 Fetching.
-   **증분 동기화**: 마지막 동기화 시점(`last_synced_at`) 이후의 데이터만 Fetching.
-   **데이터 저장**:
    -   핵심 필드: 거리, 시간, 날짜, 타입, 이름, ID.
    -   원본 보존: Strava API의 전체 JSON 응답을 `raw_data` 컬럼에 저장 (향후 분석 확장성 고려).
-   **API Rate Limit 고려**:
    -   불필요한 중복 호출 방지.
    -   15분당 100회 요청 제한을 넘지 않도록 로직 설계.

### 3.3 동기화 로그 (Sync Logging)
-   동기화 성공/실패 여부, 가져온 활동 개수, 에러 메시지를 `sync_logs` 테이블에 기록.

## 4. 성공 기준 (Success Metrics)
-   [ ] Strava 계정으로 로그인이 정상적으로 수행되고 세션이 유지됨.
-   [ ] 로그인 후 `activities` 테이블에 데이터가 중복 없이 적재됨 (Upsert 검증).
-   [ ] 앱 재접속 시 새로운 활동 데이터가 자동으로 추가됨.
-   [ ] 동기화 과정의 로그가 `sync_logs` 테이블에 남음.