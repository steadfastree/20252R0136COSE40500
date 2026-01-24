# Personal Running Lab (PRL)

데이터 기반 러닝 플랫폼으로, Strava 오픈 API를 활용하여 유료 서비스 수준의 데이터 분석과 훈련 가이드를 제공합니다.

## 프로젝트 철학
- **데이터 중심**: 주관적인 느낌이 아닌 객관적인 데이터로 성장을 증명합니다.
- **민주화된 인사이트**: Strava의 유료 기능을 쓰지 않고도 오픈 API만으로 충분히 가치 있는 분석을 제공합니다.
- **에이전틱 개발**: 최신 AI 에이전트 기술을 활용한 체계적인 소프트웨어 엔지니어링 연습의 장입니다.

## 핵심 기능 (Core Features)
1. **Strava 데이터 허브**: 내 러닝 데이터를 자동으로 동기화하고 안전하게 보관합니다.
2. **퍼포먼스 인사이트**:
   - **ACWR (Acute:Chronic Workload Ratio)**: 부상 방지를 위한 훈련 부하 관리.
   - **VDOT 계산기**: 현재 기록 기반의 실력 진단 및 적정 훈련 페이스 추천.
   - **기록 예측**: 현재 훈련 추세를 바탕으로 5K, 10K, 하프, 풀 마라톤 예상 기록 산출.
3. **스마트 훈련 플래너**:
   - **캘린더 뷰**: 훈련 계획을 수립하고 한눈에 관리.
   - **Plan vs. Actual**: 계획한 훈련과 실제 수행 기록을 매핑하여 성취도 분석.

## 기술 스택 (Tech Stack)
- **Framework**: Next.js 14+ (App Router)
- **Authentication**: Supabase Auth (Strava OAuth)
- **Database**: Supabase (PostgreSQL)
- **Data Fetching**: TanStack Query v5
- **State Management**: Zustand
- **UI Components**: Radix UI, Tailwind CSS, shadcn/ui, AG Grid (Community)
- **Visualization**: Recharts

## 개발 로드맵 (Roadmap)

### Phase 1: 기반 및 데이터 허브 (Foundation & Data Hub)
- [x] **PRD-001**: 기술 스택 마이그레이션 (pnpm, Supabase, Query 설정).
- [ ] **PRD-002**: Strava 연동 및 데이터 동기화 파이프라인 구축.

### Phase 2: 분석 및 대시보드 (Core Analytics)
- [ ] **PRD-003**: 훈련 부하(ACWR) 및 퍼포먼스(VDOT) 분석 엔진.
- [ ] **PRD-004**: 통합 대시보드 및 활동 로그 (AG Grid).

### Phase 3: 훈련 플래닝 (Smart Planning)
- [ ] **PRD-005**: 훈련 캘린더 및 일정 관리.
- [ ] **PRD-006**: 계획 대비 성취도 분석 (Plan vs. Actual).

## 개발 워크플로우 (Development Workflow)
이 프로젝트는 `.gemini/` 폴더 내의 문서를 기반으로 체계적으로 진행됩니다.

1. **PRD (Product Requirements Document)**: `.gemini/prds/` - "무엇을, 왜" 만드는지 정의.
2. **Spec (Technical Specification)**: `.gemini/specs/` - "어떻게" 구현할지 기술적으로 설계.
3. **Plan (Implementation Plan)**: `.gemini/plans/` - 구체적인 작업 순서(Task) 정의 및 체크.
4. **Implementation**: 실제 코드 작성 및 검증.

### 규칙

- **한글 문서화**: 모든 문서는 사용자의 이해를 돕기 위해 한글로 작성합니다.

- **Atomic Commits**: 논리적인 작업 단위(예: Plan의 Task 하나, 버그 수정 하나)가 완료될 때마다 커밋을 제안합니다. 너무 많은 변경 사항을 쌓아두지 마세요.

- **Plan Tracking**: 작업 완료 시 즉시 Plan 문서의 체크박스를 업데이트합니다.
