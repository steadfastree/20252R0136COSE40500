# Plan: 대시보드 구현 실행 계획

## Metadata
- **Related Spec**: Spec-prd004
- **Priority**: Medium

## 작업 목록 (Tasks)

### 1. UI 컴포넌트 개발
- [ ] **Task 1.1**: KPI 카드 컴포넌트 구현 (`kpi-card.tsx`).
- [ ] **Task 1.2**: 훈련 부하 차트 구현 (`load-chart.tsx`).
    - Mock 데이터를 사용하여 렌더링 확인.
- [ ] **Task 1.3**: AG Grid 래퍼 컴포넌트 구현.

### 2. 데이터 연동
- [ ] **Task 2.1**: 대시보드용 서버 액션 구현 (`actions/dashboard.ts`).
- [ ] **Task 2.2**: 메인 페이지(`app/page.tsx`)에 실제 데이터 바인딩.
    - `Promise.all`로 데이터 Fetching 병렬 처리.

### 3. 반응형 및 상태 처리
- [ ] **Task 3.1**: 모바일 뷰 최적화 (Grid 컬럼 숨김 처리 등).
- [ ] **Task 3.2**: 로딩 상태(Suspense/Skeleton) 적용.