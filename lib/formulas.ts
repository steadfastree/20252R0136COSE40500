import { StravaActivity } from "./types";

// =====================================================================
// 1. Jack Daniels VDOT Core Logic (Physiological Formulas)
// =====================================================================

// 속도(분속, m/min)에 따른 산소 소비량(VO2) 계산
const getVO2 = (velocity: number): number => {
    return 0.182258 * velocity + 0.000104 * velocity * velocity - 4.6;
};

// 운동 시간(분)에 따른 %VO2max (지속 가능률) 계산
// 시간이 길어질수록 최대 산소 섭취량의 적은 비율만 사용할 수 있음 (지수 함수적 감쇠)
const getPercentMax = (minutes: number): number => {
    return (
        0.8 +
        0.1894393 * Math.exp(-0.012778 * minutes) +
        0.2989558 * Math.exp(-0.1932605 * minutes)
    );
};

// 레이스 기록(분) -> VDOT 변환
export const calculateVDOT = (
    timeMinutes: number,
    distanceMeters: number
): number => {
    if (timeMinutes <= 0) return 0;
    const velocity = distanceMeters / timeMinutes; // m/min
    const vo2 = getVO2(velocity);
    const percentMax = getPercentMax(timeMinutes);

    return Number((vo2 / percentMax).toFixed(1));
};

// =====================================================================
// 2. VDOT Reverse Calculation (VDOT -> Time) using Binary Search
// =====================================================================

// VDOT 점수로 특정 거리의 예상 기록(분)을 역산
// 공식이 복잡하여 역함수를 구할 수 없으므로, 이진 탐색(Binary Search)으로 근사값을 찾음
const getTimeFromVDOT = (vdot: number, distanceMeters: number): number => {
    let low = 1; // 1분
    let high = 1500; // 1500분 (약 25시간) - 풀코스 걷는 경우까지 커버
    let epsilon = 0.0001; // 오차 범위
    let iterations = 0;

    while (high - low > epsilon && iterations < 100) {
        const mid = (low + high) / 2;
        const estimatedVDOT = calculateVDOT(mid, distanceMeters);

        if (estimatedVDOT < vdot) {
            // 예상 VDOT이 목표보다 낮음 -> 더 높은 점수를 내려면 시간이 단축되어야 함
            high = mid;
        } else {
            low = mid;
        }
        iterations++;
    }

    return (low + high) / 2;
};

// 시간 포맷팅 헬퍼 (초 -> HH:MM:SS or MM:SS)
const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = Math.floor(totalSeconds % 60);

    if (h > 0) {
        return `${h}:${m.toString().padStart(2, "0")}:${s
            .toString()
            .padStart(2, "0")}`;
    }
    return `${m}:${s.toString().padStart(2, "0")}`;
};

// =====================================================================
// 3. Exported Functions for UI
// =====================================================================

// A. 레이스 기록 예측 (New!)
export const getRacePredictions = (vdot: number) => {
    if (vdot === 0) {
        return { "5k": "-", "10k": "-", Half: "-", Full: "-" };
    }

    const predict = (dist: number) => {
        const minutes = getTimeFromVDOT(vdot, dist);
        return formatTime(minutes * 60);
    };

    return {
        "5k": predict(5000),
        "10k": predict(10000),
        Half: predict(21097.5),
        Full: predict(42195),
    };
};

// B. 훈련 페이스 계산
// Jack Daniels 테이블의 회귀식을 사용하여 VDOT별 적정 훈련 페이스(초/km) 도출
export const getTrainingPaces = (vdot: number) => {
    if (vdot === 0) {
        return {
            Easy: "-",
            Marathon: "-",
            Threshold: "-",
            Interval: "-",
            Repetition: "-",
        };
    }

    // y = ax^b (Power Law Regression based on VDOT tables)
    const getPacePerKm = (v: number, type: "E" | "M" | "T" | "I" | "R") => {
        let seconds = 0;
        switch (type) {
            case "E":
                seconds = 3985 * Math.pow(v, -0.65);
                break; // Easy (조깅)
            case "M":
                seconds = 2850 * Math.pow(v, -0.59);
                break; // Marathon (마라톤)
            case "T":
                seconds = 2500 * Math.pow(v, -0.58);
                break; // Threshold (역치)
            case "I":
                seconds = 2150 * Math.pow(v, -0.56);
                break; // Interval (인터벌)
            case "R":
                seconds = 1900 * Math.pow(v, -0.54);
                break; // Repetition (반복)
        }
        return seconds;
    };

    const fmt = (sec: number) => {
        const m = Math.floor(sec / 60);
        const s = Math.floor(sec % 60);
        return `${m}:${s.toString().padStart(2, "0")}`;
    };

    return {
        Easy: fmt(getPacePerKm(vdot, "E")),
        Marathon: fmt(getPacePerKm(vdot, "M")),
        Threshold: fmt(getPacePerKm(vdot, "T")),
        Interval: fmt(getPacePerKm(vdot, "I")),
        Repetition: fmt(getPacePerKm(vdot, "R")),
    };
};

// C. 최고의 VDOT 추출 (Best Performance Finder)
export const findBestEffort = (activities: StravaActivity[]) => {
    let bestVDOT = 0;

    activities.forEach((act) => {
        // 3km 미만 거리나 데이터 오류 제외
        if (act.distance < 3000 || act.moving_time <= 0) return;

        // 각 활동의 거리와 시간으로 VDOT을 직접 계산하여 최대값 갱신
        const currentVDOT = calculateVDOT(act.moving_time / 60, act.distance);

        if (currentVDOT > bestVDOT) {
            bestVDOT = currentVDOT;
        }
    });

    return bestVDOT;
};

// 6. TRIMP 계산 (Banister's Impulse)
export const calculateTRIMP = (
    durationMinutes: number,
    avgHr: number,
    maxHr: number,
    restHr: number
): number => {
    // 심박 데이터가 없거나 유효하지 않으면 0 반환
    if (!avgHr || avgHr <= restHr) return 0;

    // HR Reserve (심박 예비율) 계산
    const hrReserve = (avgHr - restHr) / (maxHr - restHr);

    // Banister 공식 적용 (남성 기준 상수 1.92 사용)
    const trimp =
        durationMinutes * hrReserve * 0.64 * Math.exp(1.92 * hrReserve);

    return Math.round(trimp); // 정수로 반환
};
