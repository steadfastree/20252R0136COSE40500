# 02. Issue Management Guide (이슈 관리)

## 개요
Plan 문서에 정의된 Task들을 실제 작업 가능한 GitHub Issue로 변환하여 추적 가능하게 만듭니다.

## 1. Issue 생성 자동화 (Plan to Issue)
Plan 문서의 체크박스(`- [ ]`) 항목을 `gh` CLI를 사용하여 이슈로 등록합니다.

### 명령어 예시
```bash
gh issue create \
  --title "[PRD-002] Task 1.1: 마이그레이션 파일 생성" \
  --body "상세 내용은 .gemini/plans/prd002-data-hub-plan.md 참조" \
  --label "domain:backend" \
  --label "priority:high"
```

## 2. 라벨링 전략 (Labeling Strategy)
이슈를 분류하여 작업의 성격과 우선순위를 명확히 합니다.

### 2.1 도메인 (Domain)
- `domain:backend`: DB, API, Server Action, Auth
- `domain:frontend`: UI, Component, Client State, CSS
- `domain:analytics`: 수학 로직, 데이터 분석, 알고리즘
- `domain:docs`: 문서화, 설정

### 2.2 우선순위 (Priority)
- `priority:critical`: 블로커, 즉시 해결 필요.
- `priority:high`: 핵심 기능 구현.
- `priority:medium`: 일반적인 기능 구현.
- `priority:low`: 편의성 개선, 마이너 수정.

### 2.3 추적 (Tracking)
- `parent:PRD-XXX`: 어떤 PRD에 속한 작업인지 명시.

## 3. 이슈 상태 동기화
- 이슈가 닫히면(Closed), 해당 Plan 문서의 체크박스도 `[x]`로 업데이트해야 합니다.
