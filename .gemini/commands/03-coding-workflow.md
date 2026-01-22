# 03. Coding Workflow Guide (구현 및 검증)

## 개요
할당된 GitHub Issue를 기반으로 격리된 환경(Worktree)에서 코드를 작성하고 검증하는 표준 절차입니다.

## 1. 작업 준비 (Setup)

### 1.1 이슈 확인 및 브랜치 전략
*   **이슈 파악**: 할당된 이슈 번호(예: #123)와 내용을 확인합니다.
*   **브랜치명 규칙**: `feat/issue-{번호}-{간단한설명}` (예: `feat/issue-123-setup-db`)

### 1.2 Git Worktree 생성
메인 작업 디렉토리를 더럽히지 않고 독립적인 환경을 만듭니다.
```bash
# 1. 최신 상태 동기화
git fetch origin

# 2. Worktree 생성 (프로젝트 루트의 형제 폴더로 생성 추천)
git worktree add -b feat/issue-123 ../worktree-issue-123 main

# 3. 이동
cd ../worktree-issue-123
```

## 2. 구현 (Implementation)
*   **세부 계획**: 이슈 내용이 복잡하다면 `TODO.md`를 임시로 만들어 할 일을 쪼갭니다.
*   **코딩**: Spec 문서를 준수하여 코드 작성.
*   **커밋**: 의미 있는 단위로 Atomic Commit 수행.

## 3. 필수 검증 (Mandatory Verification)
코드를 완성했다고 판단되면 반드시 다음 명령어를 통과해야 합니다.

```bash
# 1. 전체 빌드 (타입 에러 체크)
pnpm build

# 2. 린트 검사
pnpm lint
```
*실패 시, 절대 PR을 생성하지 말고 수정을 진행합니다.*

## 4. 작업 마무리
검증이 끝나면 변경 사항을 모두 커밋하고 Push합니다.
```bash
git push origin feat/issue-123
```
