# Spec: 훈련 부하 및 퍼포먼스 분석 엔진 (Analytics Engine)

## Metadata
- **Related PRD**: PRD-003
- **Status**: Draft
- **Depends On**: PRD-002 (데이터 구조 참조용, 구현은 독립 가능)

## 1. 개요
러닝 데이터를 입력받아 VDOT, ACWR, 예측 기록 등을 계산하는 순수 함수(Pure Function) 기반의 분석 라이브러리 설계입니다.

## 2. 파일 구조 및 모듈
`lib/analytics/` 폴더 내에 기능별로 파일을 분리합니다.

```text
lib/analytics/
├── types.ts            # 분석 관련 타입 정의 (Activity, Prediction 등)
├── vdot.ts             # VDOT 계산 및 페이스 테이블
├── prediction.ts       # 앙상블 모델 (Tanda + Riegel)
├── load.ts             # ACWR 및 부하 계산
├── metrics.ts          # 효율성 및 꾸준함 지수
└── index.ts            # 외부 노출용 진입점 (Barrel file)
```

## 3. 알고리즘 명세

### 3.1 VDOT (Jack Daniels)
*   **입력**: 거리(meters), 시간(seconds).
*   **로직**:
    1.  입력된 거리/시간을 기반으로 '속도(Velocity)' 계산.
    2.  속도 대비 산소 소비량(VO2) 추정 공식 적용.
    3.  VDOT 값 도출.
    4.  Lookup Table 또는 역산 공식을 통해 예상 기록 반환.

### 3.2 앙상블 예측 (Ensemble)
*   **Tanda**: `MarathonTime = 17.1 + 140 * exp(-0.0053 * WeeklyKm) + 0.55 * Pace(sec/km)`
*   **Riegel**: `T2 = T1 * (D2 / D1)^1.06`
*   **가중치**:
    *   Full: Tanda(0.6) + Riegel(0.4)
    *   Half: Tanda(0.4) + Riegel(0.6)

### 3.3 ACWR (Load Management)
*   **공식**: `Acute Load (7일 이동평균) / Chronic Load (28일 이동평균)`
*   **부하 기준**: 거리(Distance)를 우선 사용하되, 추후 심박수 기반 TRIMP로 확장 가능하도록 인터페이스 설계.

## 4. 테스트 전략
*   데이터베이스 없이 동작하는 '순수 로직'이므로 `vitest`를 사용하여 단위 테스트를 수행합니다.
*   **Mock Data**: 다양한 유형의 러너(초보, 엘리트, 불규칙) 데이터를 JSON으로 준비하여 검증.
