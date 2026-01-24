# PRD: 훈련 부하 및 퍼포먼스 분석 엔진 (Analytics Engine)

## Metadata
- **Status**: Draft
- **Depends On**: PRD-002
- **Unblocks**: PRD-004

## 1. 개요
Strava 활동 데이터를 입력받아 과학적인 러닝 지표(VDOT, ACWR, 예측 기록 등)를 산출하는 핵심 분석 라이브러리입니다.

## 2. 핵심 기능

### 2.1 VDOT 및 예측 모델
-   **VDOT 계산**: 최근(42일 이내) 활동 중 '최고의 퍼포먼스(Best Effort)'를 찾아 VDOT 점수 산출.
-   **하이브리드 예측**:
    -   Tanda (훈련량 기반): 마라톤 예측에 60% 가중치.
    -   Riegel (최고 기록 기반): 하프 이하 예측에 60% 가중치.
    -   최종 결과: 두 모델의 가중 평균값 제공.

### 2.2 부하 관리 (ACWR)
-   **ACWR 공식**: `Acute Load (7일) / Chronic Load (28일)`.
-   **부하 기준**: 거리(Distance) 기반 부하 계산 (심박수 기반 TRIMP는 V2 고려).
-   **상태 진단**:
    -   < 0.8: 회복 필요 (Undertraining)
    -   0.8 - 1.3: 최적 (Optimal)
    -   1.3 - 1.5: 주의 (High)
    -   > 1.5: 위험 (Danger)

### 2.3 성장 및 습관 지표
-   **효율성 지수 (Efficiency)**: `Speed / HR`. (단, 심박 데이터가 있는 활동만 계산)
-   **꾸준함 점수 (Consistency)**: 주간 훈련 빈도의 분산(Variance) 역산. (규칙적일수록 점수 높음)

## 3. 데이터 요구사항
-   입력: `Activity[]` (PRD-002의 `activities` 테이블 스키마 준수).
-   출력: `AnalysisResult` 객체 (Spec 참조).

## 4. 성공 기준
-   [ ] 제공된 테스트 데이터셋(초보/중수/고수)에 대해 VDOT 오차가 ±1 이내여야 함.
-   [ ] 훈련 데이터가 부족한 경우(0건 또는 5건 미만)에도 에러 없이 기본값 또는 '분석 불가' 메시지를 반환해야 함.