# Spec: 대시보드 UI 구현 (Dashboard)

## Metadata
- **Related PRD**: PRD-004
- **Status**: Draft
- **Depends On**: PRD-003 (분석 결과 타입)

## 1. 컴포넌트 구조

```text
components/dashboard/
├── kpi-grid.tsx        # 3개의 KPI 카드를 담는 그리드 컨테이너
├── kpi-card.tsx        # 개별 카드 (Title, Value, StatusColor)
├── charts/
│   ├── load-chart.tsx  # Recharts: ComposedChart (Bar + Line)
│   └── custom-tooltip.tsx
└── activity-table/
    ├── data-table.tsx  # AG Grid Wrapper
    └── columns.ts      # 컬럼 정의
```

## 2. 상태 관리 (`use-dashboard-store.ts`)
```typescript
interface DashboardState {
  dateRange: { from: Date; to: Date };
  selectedActivityId: number | null;
  setDateRange: (range: { from: Date; to: Date }) => void;
  // ...
}
```

## 3. 서버 액션 (`actions/dashboard.ts`)
- `getDashboardData(userId)`:
    1. `activities` 테이블에서 데이터 조회.
    2. `lib/analytics` 함수 호출하여 분석 결과 생성.
    3. 클라이언트에 `{ rawData, analytics }` 형태의 DTO 반환.

## 4. 라이브러리 설정
- **Recharts**: 반응형 컨테이너(`ResponsiveContainer`) 사용 필수.
- **AG Grid**: 커뮤니티 버전 사용. Tailwind CSS와 스타일 충돌 방지를 위해 `ag-theme-quartz` 클래스 적용.