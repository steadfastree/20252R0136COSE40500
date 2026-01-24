# Plan: 분석 엔진 구현 실행 계획

## Metadata
- **Related Spec**: Spec-prd003
- **Priority**: High

## 작업 목록 (Tasks)

### 1. 환경 설정
- [ ] **Task 1.1**: Vitest 설치 및 설정 파일(`vitest.config.ts`) 생성.
    - 명령: `pnpm add -D vitest`

### 2. 로직 구현 (TDD)
- [ ] **Task 2.1**: 기본 타입 정의 (`lib/analytics/types.ts`).
- [ ] **Task 2.2**: VDOT 계산 함수 및 테스트 구현 (`lib/analytics/vdot.ts`).
- [ ] **Task 2.3**: 앙상블 예측 모델 및 테스트 구현 (`lib/analytics/prediction.ts`).
- [ ] **Task 2.4**: ACWR 계산 함수 및 테스트 구현 (`lib/analytics/load.ts`).
- [ ] **Task 2.5**: 효율성/꾸준함 지수 및 테스트 구현 (`lib/analytics/metrics.ts`).

### 3. 통합
- [ ] **Task 3.1**: 모듈 통합 (`lib/analytics/index.ts`).
    - `analyzeUserPerformance(activities)` 함수 하나로 모든 결과를 반환하도록 래핑.