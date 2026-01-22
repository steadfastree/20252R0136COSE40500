# Spec: 통합 대시보드 및 활동 로그 UI (Dashboard)

## Metadata
- **Related PRD**: PRD-004
- **Status**: Draft
- **Depends On**: PRD-003 (분석 데이터 필요)

## 1. 개요
분석된 데이터를 시각화하는 대시보드 UI 설계입니다. Recharts 차트와 AG Grid를 사용하여 정보의 밀도를 높이고 직관성을 제공합니다.

## 2. 컴포넌트 구조

```text
components/
├── dashboard/
│   ├── kpi-cards.tsx       # VDOT, ACWR 등 요약 카드
│   ├── main-chart.tsx      # 주간 훈련량 + ACWR 복합 차트
│   ├── efficiency-chart.tsx # 효율성 지수 추세선
│   └── activity-grid.tsx   # AG Grid 기반 활동 로그
├── ui/
│   └── ... (shadcn/ui 컴포넌트)
```

## 3. 상태 관리 (Zustand)
*   **Store**: `lib/store/use-dashboard-store.ts`
*   **State**:
    *   `dateRange`: { start, end } (조회 기간)
    *   `filterType`: 'Run' | 'Ride' | 'All'
    *   `selectedActivityId`: 상세 보기를 위한 ID

## 4. AG Grid 설정
*   **Theme**: `ag-theme-quartz`
*   **Columns**:
    *   날짜 (Format: YYYY-MM-DD)
    *   활동명 (Link)
    *   거리 (km)
    *   시간 (HH:MM:SS)
    *   페이스 (MM:SS/km)
    *   평균 심박수
    *   VDOT (해당 활동 기준)

## 5. API 연동
*   Next.js Server Actions를 통해 `activities` 테이블에서 데이터를 조회하고, `lib/analytics` 함수를 통과시켜 가공된 데이터를 클라이언트에 주입(Hydration)합니다.
