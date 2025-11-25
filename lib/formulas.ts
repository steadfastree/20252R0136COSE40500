import { StravaActivity } from "./types";

// 1. Riegel's Formula (시간 예측)
// t1: 기준 기록(초), d1: 기준 거리(m), d2: 목표 거리(m)
export const predictTime = (t1: number, d1: number, d2: number) => {
    return t1 * Math.pow(d2 / d1, 1.06);
};

// 2. VDOT Calculation (Jack Daniels 근사식)
// 5km 기록(분)을 입력받아 VDOT 점수를 반환
export const calculateVDOT = (fiveKmTimeMinutes: number): number => {
    // VDOT 근사 공식을 사용하거나, 5k 기록 대비 VDOT 테이블 매핑 로직을 사용합니다.
    // 여기서는 5km 기록(분)과 VDOT 간의 일반적인 상관관계를 코드로 구현합니다.
    // (공식: VDOT ≈ distance(m) / time(min) ... 복잡하므로 5k 기준 역산 식 사용)

    if (fiveKmTimeMinutes <= 0) return 0;

    // 간단한 회귀식 (5k Time vs VDOT)
    // 예: 20분 -> VDOT 49.8, 25분 -> VDOT 38, 30분 -> VDOT 30
    // VDOT = -1.87 * Time(min) + 86 (대략적인 선형 근사 - 특정 구간에서 유효)
    // 더 정확한 계산을 위해 Daniels 공식의 단순화 버전을 적용:

    const velocity = 5000 / fiveKmTimeMinutes; // meters per minute
    const percentMax =
        0.8 +
        0.1894393 * Math.exp(-0.012778 * fiveKmTimeMinutes) +
        0.2989558 * Math.exp(-0.1932605 * fiveKmTimeMinutes);
    const vo2Cost =
        0.182258 * velocity + 0.000104 * Math.pow(velocity, 2) - 4.6;

    return Number((vo2Cost / percentMax).toFixed(1));
};

// 3. 훈련 페이스 계산 (min/km)
export const getTrainingPaces = (vdot: number) => {
    // VDOT 기반 페이스 계수 (Jack Daniels Intensity)
    // Easy: 59-74% VO2max -> 대략 VDOT의 역수 관계
    // 정확한 공식보다는 VDOT 테이블 참조가 좋으나, 여기서는 VDOT별 기준 페이스를 계산합니다.

    // 편의상 5k Race Pace(min/km)를 먼저 구하고 비율을 곱합니다.
    // 5k Pace(초) ≈ 1000m / (Velocity at VDOT)
    // 하지만 계산이 복잡하므로 VDOT 점수 하나당 5k 페이스가 약 3~4초 빨라지는 규칙을 적용합니다.
    // VDOT 30: 5k Pace 6:00/km
    // VDOT 40: 5k Pace 5:00/km
    // VDOT 50: 5k Pace 4:00/km
    // VDOT 60: 5k Pace 3:25/km

    // Reference VDOT 45 => 5k Pace 4:30/km (270s)
    // Pace Factor = 270s * (45 / CurrentVDOT) (단순 반비례 근사)

    const refVDOT = 45;
    const ref5kPaceSeconds = 270; // 4:30/km

    // VDOT이 높을수록 시간이 줄어듬 (반비례보다 약간 더 가파름 - 지수함수적)
    const basePace = ref5kPaceSeconds * Math.pow(refVDOT / vdot, 0.95);

    const formatPace = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return {
        Easy: formatPace(basePace * 1.25), // E-Pace
        Marathon: formatPace(basePace * 1.1), // M-Pace
        Threshold: formatPace(basePace * 1.04), // T-Pace
        Interval: formatPace(basePace * 0.96), // I-Pace
        Repetition: formatPace(basePace * 0.9), // R-Pace
    };
};

// 4. Best Performance Finder
export const findBestEffort = (activities: StravaActivity[]) => {
    let best5kTime = Infinity;

    activities.forEach((act) => {
        // 너무 짧은 거리(3km 미만)나 에러 데이터 제외
        if (act.distance < 3000 || act.moving_time <= 0) return;

        // Riegel 공식을 이용해 모든 달리기를 5k 기록으로 환산
        const projected5k = predictTime(act.moving_time, act.distance, 5000);

        if (projected5k < best5kTime) {
            best5kTime = projected5k;
        }
    });

    return best5kTime === Infinity ? 0 : best5kTime / 60; // 분 단위 반환
};
