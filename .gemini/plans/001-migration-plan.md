# Plan: 기술 스택 마이그레이션 실행 계획

## 개요
Spec-001에 정의된 아키텍처로 전환하기 위한 단계별 실행 계획입니다. 각 단계는 완료 후 커밋 가능한(Atomic Commit) 단위로 구성됩니다.

## 작업 목록 (Tasks)

### 1. 정리 (Cleanup)
- [x] **Task 1.1**: Prisma 및 NextAuth 관련 패키지 제거.
- [x] **Task 1.2**: 사용하지 않는 파일 및 폴더 삭제.

### 2. 설치 (Install)
- [x] **Task 2.1**: 신규 라이브러리 설치.

### 3. Supabase 설정 (Setup Supabase)
- [x] **Task 3.1**: Supabase 클라이언트 유틸리티 구현.
- [x] **Task 3.2**: 환경 변수 타입 정의 추가.

### 4. TanStack Query 설정 (Setup Query)
- [x] **Task 4.1**: `QueryProvider` 컴포넌트 구현.
- [x] **Task 4.2**: Root Layout에 Provider 적용.

### 5. Zustand 설정 (Setup Zustand)
- [x] **Task 5.1**: 예시용 UI 스토어 생성.

### 6. 검증 (Verification)
- [x] **Task 6.1**: 전체 빌드 및 린트 검사.

## 실행 가이드
각 Task를 완료할 때마다 `git commit`을 제안해야 합니다.
예: `chore: remove legacy auth and database packages`