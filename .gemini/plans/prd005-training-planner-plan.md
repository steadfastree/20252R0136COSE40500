# Plan: 훈련 플래너 구현 실행 계획

## Metadata
- **Related Spec**: Spec-prd005
- **Priority**: Medium

## 작업 목록 (Tasks)

### 1. 데이터베이스 구축
- [ ] **Task 1.1**: `plans` 테이블 마이그레이션 생성 및 배포.
- [ ] **Task 1.2**: 타입 정의 업데이트.

### 2. API 구현
- [ ] **Task 2.1**: Plans CRUD 서버 액션 구현 (`createPlan`, `updatePlan`, `deletePlan`, `getPlans`).

### 3. UI 구현
- [ ] **Task 3.1**: 월간 캘린더 그리드 컴포넌트 구현.
- [ ] **Task 3.2**: 훈련 계획 입력 모달 (Form + VDOT 추천 연동).
- [ ] **Task 3.3**: 캘린더 셀에 계획 표시 및 상세 뷰.
