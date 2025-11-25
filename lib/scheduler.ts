// lib/scheduler.ts
import { StravaActivity, TrainingPlan, CalendarDay } from "./types";
import {
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay,
    isToday,
    isBefore,
    parseISO,
    startOfDay,
    addDays,
    subDays,
} from "date-fns";
import fs from "fs/promises";
import path from "path";

// 1. JSON 파일 읽기 (Server Side Only)
export async function getTrainingPlans(): Promise<TrainingPlan[]> {
    try {
        const filePath = path.join(process.cwd(), "data", "schedule.json");
        const fileContents = await fs.readFile(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        console.error("Error reading schedule.json:", error);
        return [];
    }
}

// 2. 캘린더 데이터 생성 및 매칭 로직
export async function getCalendarData(
    year: number,
    month: number,
    activities: StravaActivity[]
): Promise<CalendarDay[]> {
    // 계획 데이터 로드
    const plans = await getTrainingPlans();

    // 해당 월의 시작과 끝 계산
    const currentDate = new Date(year, month - 1); // JS Month is 0-indexed
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);

    // 달력 그리드를 채우기 위한 날짜 생성
    // (옵션: 달력의 앞뒤 빈칸을 채우려면 startOfWeek/endOfWeek 사용 가능. 여기선 해당 월만 집중)
    const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

    // 매칭 시작
    const calendarData: CalendarDay[] = daysInMonth.map((day) => {
        const dateStr = format(day, "yyyy-MM-dd");

        // A. 계획 찾기
        const plan = plans.find((p) => p.date === dateStr);

        // B. 실제 활동 찾기 (Strava activity.start_date는 ISO String)
        // Strava 날짜는 UTC일 수 있으므로 로컬 날짜 매칭에 주의해야 함.
        // 여기서는 간단히 문자열 앞부분(YYYY-MM-DD) 비교
        const activity = activities.find((a) => {
            // start_date_local: "2024-11-25T07:00:00Z" -> "2024-11-25"
            return a.start_date_local.startsWith(dateStr);
        });

        // C. 상태(Status) 판별 로직
        let status: CalendarDay["status"] = "rest";
        const isPast = isBefore(day, startOfDay(new Date())) && !isToday(day);

        if (plan && activity) {
            status = "run-success"; // 계획하고 뛰었다! (성공)
        } else if (plan && !activity) {
            if (isPast) {
                status = "run-missed"; // 계획했는데 안 뛰었다 (결석)
            } else {
                status = "rest"; // 미래의 계획은 아직 상태 없음 (UI에서 'Upcoming'으로 처리)
            }
        } else if (!plan && activity) {
            status = "run-bonus"; // 계획 없는데 뛰었다 (보너스)
        } else {
            status = "rest"; // 계획도 없고 안 뜀 (휴식)
        }

        return {
            date: dateStr,
            isCurrentMonth: true,
            plan,
            activity,
            status,
        };
    });

    return calendarData;
}
