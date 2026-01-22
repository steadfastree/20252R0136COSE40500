# Spec: 스마트 훈련 플래너 (Training Planner)

## Metadata
- **Related PRD**: PRD-005
- **Status**: Draft
- **Depends On**: PRD-002 (DB), PRD-003 (VDOT 추천)

## 1. 개요
사용자가 훈련 계획을 수립하고 관리하는 캘린더 시스템 설계입니다.

## 2. 데이터베이스 스키마
### `public.plans`
- `id`: UUID (PK)
- `user_id`: UUID (FK)
- `date`: Date (YYYY-MM-DD)
- `type`: String (Run, Interval, Long, Rest)
- `target_distance`: Float (km)
- `target_time`: Integer (seconds)
- `target_pace`: Integer (seconds/km)
- `description`: Text
- `is_completed`: Boolean (수동 체크용, 자동 매칭은 별도 계산)
- `created_at`: Timestamptz

## 3. UI 및 라이브러리
*   **Calendar Lib**: `react-day-picker` (Radix UI 기반) 또는 커스텀 그리드 구현. (복잡한 뷰가 필요하므로 커스텀 그리드 추천)
*   **Interaction**: 날짜 클릭 -> 모달 오픈 -> 계획 입력.

## 4. 로직
*   **페이스 추천**: 입력 폼에서 '인터벌' 선택 시, 사용자의 현재 VDOT 데이터를 참조하여 목표 페이스 자동 기입(Placeholder).
