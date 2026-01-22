# PRD: Strava 데이터 허브 및 인증 (Data Hub)

## 1. 개요
사용자의 Strava 계정을 안전하게 연결하고, 흩어진 훈련 데이터를 중앙(Supabase)으로 동기화하여 '나만의 러닝 데이터 허브'를 구축합니다. 이 허브는 이후의 모든 분석 및 추천 기능의 기반이 됩니다.

## 2. 사용자 시나리오 (User Stories)
- 사용자는 "Connect with Strava" 버튼 하나로 가입 및 로그인을 할 수 있다.
- 사용자는 로그인 직후, 자신의 최근 러닝 기록들이 자동으로 대시보드에 채워지는 것을 경험한다. (Magic Moment)
- 사용자는 매번 데이터를 수동으로 불러올 필요 없이, 앱에 접속할 때 최신 데이터가 동기화되기를 기대한다.

## 3. 핵심 기능 요구사항

### 3.1 인증 (Authentication)
- **Supabase Auth**의 Strava Provider를 사용한다.
- 로그인 성공 시 Supabase의 `auth.users`에 계정이 생성되고, `public.profiles` 테이블에 기본 정보(이름, 프로필 사진)가 동기화되어야 한다.
- Strava의 Access Token과 Refresh Token은 Supabase Auth가 관리하는 세션 내에서 안전하게 처리되어야 한다. (별도 테이블 저장 불필요 여부 확인)

### 3.2 데이터 모델링 (Data Modeling)
- **Activities 테이블**: Strava의 `DetailedActivity` 객체를 저장.
    - 핵심 필드는 컬럼으로 분리 (`id`, `user_id`, `name`, `distance`, `moving_time`, `start_date`, `type`).
    - 나머지 방대한 데이터는 `raw_data` (JSONB) 컬럼에 원본 그대로 저장하여 유연성 확보.
    - `id`는 Strava Activity ID를 PK로 사용하여 중복 저장을 방지(Upsert).

### 3.3 데이터 동기화 (Data Sync Pipeline)
- **최초 동기화 (Initial Sync)**:
    - 회원가입 직후 트리거 또는 클라이언트 요청으로 최근 90일(약 3개월) 간의 데이터를 가져온다.
- **증분 동기화 (Incremental Sync)**:
    - 사용자가 앱에 접속할 때마다 마지막 동기화 시점(`last_synced_at`) 이후의 데이터만 요청한다.
- **API 제한 관리**: Strava API Rate Limit(15분 100회, 하루 1000회)을 고려하여 불필요한 요청을 최소화한다.

## 4. UI/UX 요구사항
- **로그인 페이지**: 심플하고 신뢰감을 주는 디자인. 서비스의 가치 제안(Value Prop)이 명시되어야 함.
- **동기화 상태 표시**: 데이터가 로딩 중일 때 스피너나 프로그레스 바를 통해 진행 상황을 안내.

## 5. 성공 기준
- Strava 계정으로 로그인이 원활하게 수행됨.
- 로그인 후 Supabase `activities` 테이블에 데이터가 정상적으로 적재됨.
- 재로그인 시 중복 데이터가 생성되지 않고 업데이트됨.
