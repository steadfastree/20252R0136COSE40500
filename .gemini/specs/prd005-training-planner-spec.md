# Spec: 훈련 플래너 및 캘린더 (Planner)

## Metadata
- **Related PRD**: PRD-005
- **Status**: Draft
- **Depends On**: PRD-002

## 1. 데이터베이스 스키마 (`public.plans`)
```sql
create type plan_status as enum ('scheduled', 'completed', 'missed', 'skipped');

create table public.plans (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) not null,
  date date not null,
  type text not null, -- 'Easy', 'Tempo', 'Interval', 'Long'
  target_distance float, -- km
  target_time int, -- seconds
  target_pace int, -- seconds/km
  status plan_status default 'scheduled',
  description text,
  created_at timestamptz default now()
);
```

## 2. 컴포넌트 구조 (`components/planner/`)
- `calendar-view.tsx`: 커스텀 그리드 (CSS Grid 활용).
- `plan-item.tsx`: 날짜 셀 안에 들어갈 작은 카드.
- `plan-form-modal.tsx`: 입력/수정 폼 (React Hook Form + Zod).

## 3. 서버 액션 (`actions/planner.ts`)
- `createPlan(data)`: 유효성 검사 후 DB Insert.
- `updatePlanDate(id, newDate)`: 드래그 앤 드롭 시 호출.

## 4. 상태 관리
- 캘린더의 `currentMonth` 상태만 Zustand 또는 URL Query Param으로 관리.