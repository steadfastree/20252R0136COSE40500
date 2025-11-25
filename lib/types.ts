// lib/types.ts

export interface StravaActivity {
    id: number;
    name: string;
    distance: number; // 미터(m) 단위
    moving_time: number; // 초(s) 단위
    elapsed_time: number;
    total_elevation_gain: number;
    type: string; // 'Run', 'Ride' etc.
    start_date: string; // ISO 8601
    start_date_local: string;
    average_speed: number; // m/s
    max_speed: number;
    average_heartrate?: number;
    max_heartrate?: number;
    suffer_score?: number; // Relative Effort (TRIMP 대체용 참고 데이터)
}

export interface ActivityStats {
    count: number;
    totalDistance: number; // km
    totalTime: number; // minutes
}

export interface TrainingPlan {
    date: string; // YYYY-MM-DD
    type: string; // Easy, Interval, Tempo, Long Run, Race, etc.
    distance: number; // 목표 거리 (km)
    description?: string; // 메모
    completed?: boolean; // (Optional) 수동 체크용, 실제로는 API 매칭으로 판별
}

// 캘린더 렌더링을 위한 병합된 데이터 타입
export interface CalendarDay {
    date: string; // 날짜
    isCurrentMonth: boolean; // 현재 달력 뷰에 속하는지
    plan?: TrainingPlan; // 계획 데이터 (있으면)
    activity?: StravaActivity; // 실제 활동 데이터 (있으면)
    status: "run-success" | "run-missed" | "run-bonus" | "rest" | "rest-bonus"; // 상태 판별 결과
}
