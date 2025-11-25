import { StravaActivity } from "./types";
import { differenceInDays, parseISO, startOfDay, subDays } from "date-fns";

// ACWR 결과 타입 정의
export interface ACWRResult {
    acuteLoad: number; // 이번 주 부하 (km)
    chronicLoad: number; // 지난 4주 평균 부하 (km)
    ratio: number; // ACWR 비율
    status: "Safe" | "Sweet Spot" | "Caution" | "Danger";
    color: string; // UI 표시용 색상 코드
}

// Helper: 미터 -> 킬로미터 변환
const toKm = (m: number) => m / 1000;

export function calculateACWR(activities: StravaActivity[]): ACWRResult {
    const today = startOfDay(new Date());

    // 1. 데이터 날짜 기준 필터링을 위한 범위 설정
    // Acute: 최근 7일 (오늘 포함 혹은 어제 기준, 여기서는 오늘 기준 최근 7일)
    const acuteStart = subDays(today, 7);

    // Chronic: 최근 28일
    const chronicStart = subDays(today, 28);

    let acuteSum = 0;
    let chronicSum = 0;

    activities.forEach((activity) => {
        const actDate = parseISO(activity.start_date);

        // 날짜 차이 계산 (일 단위)
        const diff = differenceInDays(today, actDate);

        // Strava 거리 단위는 미터(m)입니다.
        if (diff >= 0 && diff < 7) {
            acuteSum += activity.distance;
        }

        if (diff >= 0 && diff < 28) {
            chronicSum += activity.distance;
        }
    });

    // 2. 부하 계산 (공식 적용)
    const acuteLoad = toKm(acuteSum);
    const chronicLoad = toKm(chronicSum) / 4; // 4주 평균

    // 3. 비율 계산 (0으로 나누기 방지)
    const ratio =
        chronicLoad === 0 ? 0 : Number((acuteLoad / chronicLoad).toFixed(2));

    // 4. 상태 판정 (User Defined Logic)
    let status: ACWRResult["status"] = "Safe";
    let color = "text-zinc-500"; // Default

    if (ratio < 0.8) {
        status = "Safe"; // Detraining or Building (Gray/Blue)
        color = "text-blue-500";
    } else if (ratio >= 0.8 && ratio <= 1.3) {
        status = "Sweet Spot"; // 최적 훈련 구간 (Green)
        color = "text-emerald-500";
    } else if (ratio > 1.3 && ratio <= 1.5) {
        status = "Caution"; // 주의 구간 (Yellow/Orange)
        color = "text-amber-500";
    } else {
        status = "Danger"; // 부상 위험 구간 (Red)
        color = "text-red-500";
    }

    return {
        acuteLoad,
        chronicLoad,
        ratio,
        status,
        color,
    };
}
