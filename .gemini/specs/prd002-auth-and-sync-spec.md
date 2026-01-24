# Spec: Strava 데이터 허브 및 인증 (Data Hub)

## Metadata
- **Related PRD**: PRD-002
- **Status**: In Progress
- **Depends On**: PRD-001

## 1. 개요
PRD-002 구현을 위한 Supabase 스키마, 인증 로직, API 클라이언트 설계입니다.

## 2. 데이터베이스 스키마 (Database Schema)

### 2.1 `public.profiles`
사용자 기본 정보를 저장합니다. `auth.users` 테이블과 1:1 관계입니다.
```sql
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  strava_id text unique,
  full_name text,
  avatar_url text,
  last_synced_at timestamptz,
  created_at timestamptz default now()
);
```

### 2.2 `public.activities`
활동 데이터를 저장합니다. JSONB를 활용하여 스키마 유연성을 확보합니다.
```sql
create table public.activities (
  id bigint primary key, -- Strava Activity ID
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  type text not null, -- 'Run', 'Ride', etc.
  distance float not null, -- meters
  moving_time int not null, -- seconds
  start_date timestamptz not null,
  map_polyline text,
  average_heartrate float,
  average_cadence float,
  raw_data jsonb, -- Full API response
  created_at timestamptz default now()
);
```

### 2.3 `public.sync_logs`
동기화 이력을 기록합니다.
```sql
create table public.sync_logs (
  id bigint generated always as identity primary key,
  user_id uuid references public.profiles(id) not null,
  status text not null, -- 'SUCCESS', 'FAILED'
  activities_count int default 0,
  error_message text,
  created_at timestamptz default now()
);
```

## 3. 모듈 및 파일 구조

### 3.1 API Client (`lib/strava/api.ts`)
Strava API를 호출하는 순수 함수 모음입니다.
```typescript
interface StravaClientConfig {
  accessToken: string;
}

export class StravaClient {
  constructor(private config: StravaClientConfig) {}
  
  async getActivities(after?: Date, before?: Date): Promise<StravaActivity[]> {
    // ... implementation
  }
}
```

### 3.2 동기화 서비스 (`lib/strava/sync.ts`)
비즈니스 로직을 담당합니다.
```typescript
export async function syncActivities(userId: string): Promise<SyncResult> {
  // 1. Get tokens from Supabase Auth
  // 2. Fetch from Strava (since last_synced_at)
  // 3. Upsert to DB
  // 4. Update profile & insert log
}
```

### 3.3 UI 컴포넌트 (`components/auth/`)
- `LoginButton.tsx`: Supabase `signInWithOAuth` 호출.
- `SyncIndicator.tsx`: 전역 UI 스토어의 `isSyncing` 상태를 구독하여 스피너 표시.

## 4. 인증 및 권한 (Auth & RLS)
- **RLS 필수 적용**: 모든 테이블(`profiles`, `activities`, `sync_logs`)은 `auth.uid() = user_id` 조건으로 본인 데이터만 접근 가능하게 설정.