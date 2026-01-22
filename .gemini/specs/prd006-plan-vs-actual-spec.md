# Spec: 계획 대비 성취도 분석 (Plan vs. Actual)

## Metadata
- **Related PRD**: PRD-006
- **Status**: Draft
- **Depends On**: PRD-005 (Plans), PRD-002 (Activities)

## 1. 개요
계획(Plan)과 실적(Activity)을 매핑하여 성취도를 평가하는 로직 설계입니다.

## 2. 매칭 알고리즘 (`lib/analytics/compliance.ts`)
*   **Input**: `Plan[]`, `Activity[]`
*   **Logic**:
    1.  날짜(`YYYY-MM-DD`)를 키(Key)로 하는 Map 생성.
    2.  같은 날짜의 Plan과 Activity를 비교.
    3.  오차 범위(Tolerance) ±10% 이내면 `Success`, ±20% 이내면 `Good`, 그 외 `Fail`.
    4.  계획은 없는데 활동이 있으면 `Unplanned`.

## 3. UI 표현
*   **캘린더**: 날짜 셀 배경색 또는 테두리 색으로 상태 표시.
    *   초록: Perfect
    *   노랑: Good
    *   빨강: Missed
    *   회색: Unplanned
*   **툴팁**: 마우스 오버 시 "계획: 10km / 실제: 9.8km (98%)" 표시.

## 4. 데이터 저장 필요성 검토
*   매번 계산할 것인가, DB에 저장할 것인가?
    *   데이터 양이 많지 않으므로 클라이언트(또는 서버 액션)에서 **On-the-fly 계산**이 유리함. DB 스키마 변경 최소화.
