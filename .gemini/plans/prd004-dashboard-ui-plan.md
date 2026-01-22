# Plan: 대시보드 UI 구현 실행 계획

## Metadata
- **Related Spec**: Spec-prd004
- **Priority**: Medium

## 작업 목록 (Tasks)

### 1. 컴포넌트 구현 (UI)
- [ ] **Task 1.1**: KPI 카드 및 레이아웃 스켈레톤 구현.
- [ ] **Task 1.2**: Recharts를 이용한 메인 차트 및 효율성 차트 구현.
- [ ] **Task 1.3**: AG Grid 설치 및 기본 테이블 구현.

### 2. 상태 및 데이터 연동
- [ ] **Task 2.1**: `use-dashboard-store` Zustand 스토어 구현.
- [ ] **Task 2.2**: 대시보드용 데이터 Fetching 서버 액션 구현 (`getDashboardData`).
    - DB 조회 -> 분석 엔진 계산 -> 결과 반환.

### 3. 통합
- [ ] **Task 3.1**: `app/page.tsx` (또는 `app/dashboard/page.tsx`)에 컴포넌트 조립.
- [ ] **Task 3.2**: 반응형 디자인 확인 (Mobile/Desktop).
