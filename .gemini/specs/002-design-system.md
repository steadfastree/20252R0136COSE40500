# 디자인 시스템 및 UI/UX 가이드

## 1. 개요 (Overview)
본 문서는 러닝 데이터 플랫폼의 시각적 아이덴티티와 UI/UX 원칙을 정의합니다.
**Stakent**의 "데이터 중심 다크 모드" 스타일과 **Task Management Dashboard**의 "직관적인 일정 관리" 인터랙션 방식을 결합하여, 전문적이면서도 사용하기 편리한 "Pro Runner" 느낌을 지향합니다.

## 2. 디자인 원칙 (Design Principles)

1.  **Data First**: 사용자의 러닝 데이터(수치, 그래프)가 가장 돋보여야 합니다. 장식적인 요소는 배제하고 데이터의 가독성을 최우선으로 합니다.
2.  **Dark & Sleek**: 기본 테마는 **다크 모드**입니다. 이는 데이터 시각화(형광색 차트 등)를 돋보이게 하고, 프로페셔널한 느낌을 줍니다.
3.  **Interactive Planning**: 훈련 계획 수립은 정적인 입력이 아닌, 드래그 앤 드롭 등 직관적인 조작이 가능해야 합니다.

## 3. 레이아웃 (Layout)

### 3.1 전체 구조 (App Shell)
-   **사이드바 (Left Sidebar)**: 주요 네비게이션 (대시보드, 훈련 달력, 분석, 설정). 
    -   *참고: Stakent 스타일의 아이콘 + 텍스트 형태.*
-   **메인 영역 (Main Content)**: 상단 헤더(페이지 타이틀, 날짜, 유저 프로필)와 콘텐츠 영역.

### 3.2 대시보드 (Dashboard View) - *Stakent Reference*
-   **Bento Grid 스타일**: 다양한 크기의 카드 위젯이 격자 형태로 배치됩니다.
-   **상단 요약 (Stat Cards)**: 주간 거리, 평균 페이스, ACWR 지수 등 핵심 지표를 최상단에 배치합니다.
-   **중앙 차트 (Main Chart)**: 화면 중앙에 주간/월간 마일리지 트렌드 그래프를 크게 배치합니다.

### 3.3 트레이닝 플래너 (Planner View) - *Task Management Reference*
-   **Split View**: 좌측에는 '훈련 라이브러리/할 일 목록', 우측에는 '캘린더'를 배치하거나, 탭으로 전환합니다.
-   **Status Indication**: 계획(Planned), 완료(Completed), 실패(Missed) 상태를 색상 코드로 명확히 구분합니다.

## 4. 스타일 가이드 (Style Guide)

### 4.1 컬러 팔레트 (Color Palette)
Tailwind CSS의 `zinc` 컬러를 기반으로 커스텀 테마를 구성합니다.

-   **Background**: `zinc-950` (#09090b) - 깊은 검정색
-   **Surface (Card)**: `zinc-900` (#18181b) - 카드 배경
-   **Border**: `zinc-800` (#27272a) - 경계선
-   **Primary (Brand)**: `orange-500` (#f97316) - Strava 연동 및 러닝의 역동성 표현 (버튼, 활성 상태)
-   **Secondary (Chart/Accent)**:
    -   `emerald-500`: 긍정적 지표, 완료됨
    -   `blue-500`: 평이한 상태, 계획됨
    -   `rose-500`: 위험(부상), 실패

### 4.2 타이포그래피 (Typography)
-   **Font Family**: `Inter` (Next.js 기본, 가독성 최적화)
-   **Headings**: Bold, Tracking-tight
-   **Data/Numbers**: Monospaced font (선택적) 또는 Tabular figures 적용하여 숫자 정렬 유지.

### 4.3 컴포넌트 라이브러리 (UI Library)
-   **shadcn/ui**: 기본 컴포넌트 (Button, Card, Dialog, Calendar 등) 활용.
-   **Recharts**: 데이터 시각화 차트.
-   **FullCalendar** (또는 유사 라이브러리): 드래그 앤 드롭 일정 관리.

## 5. 구현 전략 (Implementation Strategy)
1.  `tailwind.config.ts`에 커스텀 컬러 및 다크 모드 강제 설정.
2.  `app/layout.tsx`에서 다크 테마 프로바이더 적용.
3.  기본 레이아웃 컴포넌트 (`Sidebar`, `Header`) 구현.
