# Gemini Agent Workflow Index

이 폴더(`commands/`)는 에이전트와 개발자가 프로젝트를 진행하는 표준 절차를 담고 있습니다. 작업을 수행하기 전에 반드시 해당 상황에 맞는 가이드를 참조하세요.

## 📁 가이드 목록

### 1. [01-feature-design.md](./01-feature-design.md)
*   **상황**: 새로운 기능을 기획하고 설계를 시작할 때.
*   **내용**: PRD → Spec → Plan 문서 작성법, 의존성(Metadata) 정의 규칙.

### 2. [02-issue-management.md](./02-issue-management.md)
*   **상황**: Plan이 완성되어 작업을 등록하거나 관리할 때.
*   **내용**: Plan의 Task를 GitHub Issue로 변환하는 법, 라벨링 규칙.

### 3. [03-coding-workflow.md](./03-coding-workflow.md)
*   **상황**: 실제 코드를 작성하고 기능을 구현할 때.
*   **내용**: GitHub Issue 기반 작업 시작(Worktree), 브랜치 전략, 구현 및 로컬 검증(Build/Lint).

### 4. [04-pr-process.md](./04-pr-process.md)
*   **상황**: 구현이 완료되어 코드를 합칠 때.
*   **내용**: PR 생성, 리뷰 대응, Merge 및 Worktree 정리.

---

## ⚡️ Quick Start

**"이슈 123번 처리해줘"** 라고 요청받으면?
👉 `03-coding-workflow.md`를 참고하여 Worktree를 생성하고 작업을 시작하세요.

**"새로운 분석 기능 추가해줘"** 라고 요청받으면?
👉 `01-feature-design.md`를 참고하여 PRD부터 작성하세요.
