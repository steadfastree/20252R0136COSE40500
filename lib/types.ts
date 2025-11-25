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
