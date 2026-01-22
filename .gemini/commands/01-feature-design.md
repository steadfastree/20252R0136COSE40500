# 01. Feature Design Guide (기획 및 설계)

## 개요
아이디어를 구체적인 실행 계획으로 변환하는 단계입니다. 모든 문서는 **한글**로 작성하며, **의존성(Metadata)**을 명시해야 합니다.

## 1. 문서 구조 및 네이밍

### 1.1 PRD (Product Requirements Document)
*   **파일**: `.gemini/prds/XXX-feature-name.md`
*   **필수 헤더 (Metadata)**:
    ```markdown
    # PRD: 기능 이름
    ## Metadata
    - **Status**: [Draft / In Progress / Approved]
    - **Depends On**: [PRD-XXX] (선행되어야 할 PRD)
    - **Unblocks**: [PRD-YYY] (이 기능이 완료되면 가능해지는 것)
    ```

### 1.2 Spec (Technical Specification)
*   **파일**: `.gemini/specs/prdXXX-feature-name-spec.md`
*   **내용**: DB 스키마, API 인터페이스, 디렉토리 구조, 라이브러리 선정.
*   **필수 헤더**: PRD와 동일한 Metadata 구조 유지.

### 1.3 Plan (Implementation Plan)
*   **파일**: `.gemini/plans/prdXXX-feature-name-plan.md`
*   **내용**: Spec을 구현하기 위한 **더 이상 쪼갤 수 없는 작업 단위(Task)** 목록.
*   **변환 규칙**: 각 Task는 나중에 하나의 GitHub Issue가 될 수 있어야 합니다.

## 2. 작성 원칙
1.  **Single Source of Truth**: 모든 기획 변경은 코드가 아니라 문서(PRD/Spec)가 먼저 수정되어야 합니다.
2.  **Dependency Check**: 상위 문서(PRD)의 의존성이 해결되지 않았다면 하위 문서 작성을 보류하거나 경고를 표시합니다.
