# 04. PR Process Guide (PR 및 병합)

## 개요
작업 브랜치를 메인 브랜치에 병합하기 위한 절차입니다. GitHub CLI(`gh`)를 적극 활용합니다.

## 1. Pull Request 생성
```bash
gh pr create \
  --title "feat: 이슈 제목 (#123)" \
  --body "Closes #123. 

## 작업 내용
- 상세 구현 내용 요약" \
  --base main
```

## 2. 리뷰 및 수정
*   리뷰어의 피드백이 있다면 Worktree에서 수정 후 다시 Push합니다.
*   CI 체크가 실패했다면 로컬에서 `pnpm build` 재확인 후 수정합니다.

## 3. 병합 및 정리 (Merge & Cleanup)
PR이 승인되고 병합되었다면 로컬 환경을 정리합니다.

```bash
# 1. PR 병합 (옵션: 권한이 있는 경우)
# gh pr merge --squash --delete-branch

# 2. 본래 프로젝트 폴더로 복귀
cd ../PRL (원래 프로젝트 루트)

# 3. Worktree 삭제
git worktree remove ../worktree-issue-123 --force

# 4. 로컬 브랜치 정리
git fetch -p
```

