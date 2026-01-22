# Spec: Strava 데이터 허브 및 인증 (Data Hub)

## Metadata
- **Related PRD**: PRD-002
- **Status**: In Progress
- **Depends On**: PRD-001 (Tech Stack Migration)

## 1. 개요
PRD-002의 요구사항을 충족하기 위해 Supabase Auth와 Database를 활용한 데이터 허브 구축 설계입니다. Strava OAuth 인증을 처리하고, 활동 데이터를 효율적으로 저장 및 동기화하는 구조를 정의합니다.

## 2. 데이터베이스 스키마 (Database Schema)

### 2.1 `public.profiles`
Supabase Auth의 `auth.users` 테이블과 연동되어 사용자 프로필 정보를 저장합니다.
- `id`: UUID (Primary Key, References `auth.users.id`)
- `strava_id`: String (Unique, Strava 사용자 ID)
- `full_name`: String
- `avatar_url`: String
- `created_at`: Timestamptz
- `last_synced_at`: Timestamptz (마지막 데이터 동기화 시점)

### 2.2 `public.activities`
Strava의 활동 데이터를 저장합니다. 핵심 필드는 쿼리 성능을 위해 컬럼으로 분리하고, 전체 데이터는 유연성을 위해 JSONB로 저장합니다.
- `id`: BigInt (Primary Key, Strava Activity ID)
- `user_id`: UUID (References `public.profiles.id`)
- `name`: String
- `type`: String (Run, Ride, Swim 등)
- `distance`: Float (미터 단위)
- `moving_time`: Integer (초 단위)
- `start_date`: Timestamptz (UTC)
- `map_polyline`: Text (지도 경로)
- `raw_data`: JSONB (Strava API 응답 원본 전체)
- `created_at`: Timestamptz

### 2.3 `public.sync_logs`
데이터 동기화 이력을 추적하여 디버깅 및 상태 관리에 활용합니다.
- `id`: BigInt (PK, Auto Increment)
- `user_id`: UUID (References `public.profiles.id`)
- `status`: String ('SUCCESS', 'FAILED')
- `message`: Text
- `activities_count`: Integer (동기화된 활동 수)
- `created_at`: Timestamptz

## 3. 인증 및 권한 (Auth & RLS)

### 3.1 RLS (Row Level Security) 정책
- `profiles`:
    - `SELECT`: 본인 데이터만 조회 가능 (`auth.uid() = id`).
    - `UPDATE`: 본인 데이터만 수정 가능.
- `activities`:
    - `SELECT`: 본인 데이터만 조회 가능 (`auth.uid() = user_id`).
    - `INSERT/UPDATE`: 본인 데이터만 가능.

### 3.2 Strava Token 관리
- Supabase Auth는 기본적으로 Provider의 Access Token을 세션에 포함시킵니다.
- Refresh Token의 경우, Supabase Auth 설정에서 'Provider 토큰 저장' 옵션을 활성화해야 합니다.
- 서버 사이드 로직에서 `supabase.auth.getSession()`을 통해 토큰을 획득하여 Strava API를 호출합니다.

## 4. API 및 동기화 로직

### 4.1 Strava API 유틸리티 (`lib/strava/api.ts`)
- `fetchActivities(accessToken: string, after?: number)`: Strava API 호출 래퍼.
- Rate Limit 처리를 위한 에러 핸들링 포함.

### 4.2 동기화 서비스 (`lib/strava/sync.ts`)
- `syncUserActivities(userId: string, accessToken: string)`:
    1. `profiles`에서 `last_synced_at` 조회.
    2. 해당 시점 이후의 활동을 Strava API에서 Fetch.
    3. `activities` 테이블에 Upsert.
    4. `profiles.last_synced_at` 갱신 및 `sync_logs` 기록.

## 5. UI 컴포넌트 구조
- **`components/auth/login-button.tsx`**: Supabase `signInWithOAuth` 호출.
- **`components/sync/sync-status.tsx`**: 동기화 진행 상태(로딩 스피너) 및 마지막 업데이트 시간 표시.
