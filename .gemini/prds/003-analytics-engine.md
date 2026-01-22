# PRD: 훈련 부하 및 퍼포먼스 분석 엔진 (Core Analytics Engine)

## 1. 개요 (Overview)
Strava에서 수집된 활동(Activities) 데이터를 기반으로, 러너의 현재 상태를 진단하고 미래의 퍼포먼스를 예측하며 부상을 예방하는 핵심 분석 로직을 구현합니다. 이 엔진은 단순한 통계 제공을 넘어, **'앙상블 모델'**과 **'효율성 지표'**를 통해 유료 서비스 수준의 인사이트를 제공하는 것을 목표로 합니다.

## 2. 핵심 기능 및 알고리즘

### 2.1 레이스 기록 예측 (Race Prediction)
사용자가 두 가지 모델 중 선택하거나 비교할 수 있도록 지원합니다.
1.  **VDOT 모델 (Jack Daniels)**
    *   최근 활동 중 최고의 퍼포먼스(Best Effort)를 찾아 VDOT 점수를 산출.
    *   해당 점수를 기반으로 5K, 10K, Half, Full 예상 기록 제공.
2.  **하이브리드 앙상블 모델 (Hybrid Ensemble)**
    *   **Tanda (훈련량 기반)**: 주간 마일리지와 평균 페이스로 기초 체력 평가 (풀코스 가중치 ↑).
    *   **Riegel (최고 기록 기반)**: 단일 최고 기록으로 잠재 스피드 평가 (하프 가중치 ↑).
    *   두 모델의 가중 평균을 통해 훈련 성향(거리주 vs 인터벌)에 따른 편차 보정.

### 2.2 부하 관리 및 부상 예방 (Load & Injury Prevention)
*   **ACWR (Acute:Chronic Workload Ratio)**
    *   **Acute Load (급성)**: 최근 7일간의 훈련 부하(거리 또는 TRIMP).
    *   **Chronic Load (만성)**: 최근 28일간의 평균 훈련 부하.
    *   **비율 분석**: 0.8~1.3(안전), >1.5(부상 위험) 등 구간별 상태 진단.

### 2.3 성장 및 습관 지표 (Advanced Metrics)
*   **효율성 지수 (Efficiency Index)**
    *   공식: `Speed (m/min) / Heart Rate (bpm)`
    *   의미: 같은 심박수에서 얼마나 빠르게 달릴 수 있는가? (심폐지구력 향상 추적)
*   **꾸준함 점수 (Consistency Score)**
    *   최근 4주간 주당 훈련 횟수의 표준편차 및 연속 훈련일(Streak) 분석.
    *   "불규칙한 고강도"보다 "규칙적인 저강도"를 긍정적으로 평가.

## 3. 기술적 요구사항 (Requirements)

### 3.1 입력 데이터 (Input)
Strava API에서 가져온 `Activity` 객체 배열. 필수 필드:
-   `distance` (거리)
-   `moving_time` (이동 시간)
-   `start_date` (시작 날짜)
-   `type` (활동 타입 - Run 필터링)
-   `average_heartrate` (평균 심박수 - 없을 경우 예외 처리)

### 3.2 출력 데이터 (Output)
프론트엔드에서 즉시 렌더링 가능한 JSON 구조.
```typescript
interface AnalyticsResult {
  predictions: {
    vdot: { score: number, raceTimes: RaceTimes };
    ensemble: { modelUsed: string, raceTimes: RaceTimes };
  };
  acwr: {
    ratio: number;
    status: 'Recovery' | 'Optimal' | 'High' | 'Danger';
    history: { date: string, ratio: number }[];
  };
  metrics: {
    efficiency: { date: string, index: number }[]; // 최근 6개월 추세
    consistency: { score: number, streak: number };
  };
}
```

### 3.3 구현 위치
*   `lib/analytics/`: 핵심 로직 폴더.
    *   `prediction-models.ts`: Tanda, Riegel, VDOT 로직.
    *   `load-manager.ts`: ACWR 계산.
    *   `metrics.ts`: 효율성 및 꾸준함 계산.

## 4. 검증 계획 (Test Plan)
*   **단위 테스트**: 각 공식(Tanda, Riegel 등)이 알려진 입력값에 대해 정확한 결과를 뱉는지 `vitest`로 검증.
*   **엣지 케이스**: 심박수 데이터가 없는 활동, 훈련 기록이 5개 미만인 경우 등 방어 로직 확인.
