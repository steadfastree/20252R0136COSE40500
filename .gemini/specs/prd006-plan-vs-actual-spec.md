# Spec: 성취도 분석 로직 (Compliance)

## Metadata
- **Related PRD**: PRD-006
- **Status**: Draft
- **Depends On**: PRD-002, PRD-005

## 1. 알고리즘 구현 (`lib/analytics/compliance.ts`)

```typescript
type Grade = 'Perfect' | 'Good' | 'Bad' | 'Missed' | 'Unplanned';

export function evaluateCompliance(plan: Plan, activity?: Activity): Grade {
  if (!activity) return 'Missed';
  
  const distDiff = Math.abs(plan.targetDistance - activity.distance / 1000);
  const distError = distDiff / plan.targetDistance;

  if (distError <= 0.05) return 'Perfect';
  if (distError <= 0.15) return 'Good';
  return 'Bad';
}
```

## 2. 데이터 흐름
- 별도의 DB 저장 없이, **클라이언트(또는 서버 컴포넌트)에서 런타임에 계산**합니다.
- 이유: 성취도 기준이 바뀌거나, 계획/활동이 수정되면 즉시 재계산되어야 하므로 DB 저장은 비효율적.

## 3. UI 적용
- `PlanItem` 컴포넌트에 `compliance` prop을 추가하여 스타일링 처리.