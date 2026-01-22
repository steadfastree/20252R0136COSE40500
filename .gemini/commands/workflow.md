# Workflow: 개발 표준 워크플로우 및 명령어

이 문서는 에이전트와 개발자가 프로젝트를 진행하며 반복적으로 수행하는 작업들을 표준화한 가이드입니다.

## 1. 신규 기능 개발 사이클 (Feature Cycle)

하나의 신규 기능을 만들 때는 반드시 **PRD → Spec → Plan → Implementation** 순서를 따릅니다. 각 단계는 이전 단계의 산출물을 논리적으로 구체화하는 과정입니다.

### 1.1 PRD 작성 (Product Requirements Document)
*   **목표**: "무엇을(What), 왜(Why) 만드는가?" 정의.
*   **파일 규칙**: `.gemini/prds/XXX-name.md` (XXX: 001부터 시작)
*   **핵심 구성**:
    *   배경 및 목적 (Why)
    *   사용자 시나리오 (User Stories)
    *   핵심 기능 요구사항 (Features)
    *   성공 기준 (Success Metrics)

### 1.2 Spec 작성 (Technical Specification)
*   **변환 가이드 (PRD → Spec)**:
    *   PRD의 '기능'을 구현하기 위한 **기술적 해법(How)**을 설계합니다.
    *   **데이터 모델링**: PRD의 데이터를 저장할 DB 테이블, 컬럼, 타입 정의.
    *   **인터페이스**: API 엔드포인트, 함수 시그니처, 컴포넌트 구조 정의.
    *   **라이브러리**: 어떤 패키지를 사용할지 구체적으로 명시.
*   **파일 규칙**: `.gemini/specs/prdXXX-name-spec.md` (PRD 번호 일치)

### 1.3 Plan 작성 (Implementation Plan)
*   **변환 가이드 (Spec → Plan)**:
    *   Spec에 정의된 구조를 **실행 가능한 작업 단위(Task)**로 분해합니다.
    *   **순서 결정**: 의존성을 고려하여 작업 순서를 배치 (예: DB 생성 -> API 구현 -> UI 연동).
    *   **검증 가능성**: 각 Task는 코드로 구현되고 테스트될 수 있는 단위여야 합니다.
*   **파일 규칙**: `.gemini/plans/prdXXX-name-plan.md` (PRD 번호 일치)

### 1.4 구현 및 검증 (Implementation & Verify)
*   Plan의 각 Task를 하나씩 수행하며 체크박스를 업데이트합니다.
*   각 Task 완료 시 **검증 세트** 실행 후 커밋합니다.

## 2. 필수 검증 명령어 (Verification Set)

코드 변경 후에는 반드시 다음 명령어를 실행하여 안정성을 확인합니다.

```bash
# 전체 빌드 및 타입 체크
pnpm build

# 린트 검사
pnpm lint
```

## 3. 작업 추적 규칙 (Tracking)

-   **Plan 업데이트**: 하나의 Task가 끝나면 즉시 해당 `.gemini/plans/*.md` 파일의 `[ ]`를 `[x]`로 변경합니다.
-   **Atomic Commit**: 기능 단위가 아닌 **Task 단위**로 커밋을 제안합니다.

## 4. 자주 쓰는 유틸리티 명령어

```bash
# 의존성 추가 (pnpm 사용 필수)
pnpm add <package-name>
pnpm add -D <package-name>
```