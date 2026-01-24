# Spec: 훈련 부하 및 퍼포먼스 분석 엔진 (Analytics Engine)

## Metadata
- **Related PRD**: PRD-003
- **Status**: Draft
- **Depends On**: PRD-002

## 1. 개요
순수 함수(Pure Function)로 구성된 분석 라이브러리 설계입니다. `lib/analytics/` 내부에 위치하며, 외부 의존성 없이 동작합니다.

## 2. 모듈 구조 (`lib/analytics/`)

### 2.1 `types.ts`
```typescript
export interface AnalysisActivity {
  id: number;
  date: Date;
  distance: number; // meters
  duration: number; // seconds
  type: 'Run' | 'Ride' | string;
  avgHr?: number;
}

export interface PredictionResult {
  vdot: number;
  raceTimes: {
    k5: number; // seconds
    k10: number;
    half: number;
    full: number;
  };
  ensemble?: {
    full: number;
    half: number;
    model: 'Tanda' | 'Riegel' | 'Hybrid';
  };
}
```

### 2.2 `vdot.ts`
```typescript
export function calculateVDOT(activities: AnalysisActivity[]): number {
  // 1. Filter recent runs (last 42 days)
  // 2. Calculate VDOT for each run
  // 3. Return max VDOT
}
```

### 2.3 `load.ts` (ACWR)
```typescript
export function calculateACWR(activities: AnalysisActivity[], targetDate: Date = new Date()): { ratio: number; acute: number; chronic: number } {
  // 1. Calculate daily load (distance)
  // 2. Calculate 7-day avg (Acute)
  // 3. Calculate 28-day avg (Chronic)
  // 4. Return ratio
}
```

### 2.4 `metrics.ts`
```typescript
export function calculateEfficiency(activities: AnalysisActivity[]): { date: string; value: number }[] {
  // Filter runs with HR data -> Calculate Speed/HR -> Return time series
}
```

## 3. 테스트 계획
- **Tool**: Vitest
- **File**: `lib/analytics/__tests__/analytics.test.ts`
- **Cases**:
    - 빈 배열 입력 시 처리.
    - 극단적인 값(초인적인 속도 등) 필터링.
    - 날짜 정렬이 안 된 데이터 입력 시 처리.