import { getStravaActivities } from "@/lib/strava-api";
import { calculateACWR, getWeeklyStats } from "@/lib/analytics";
import {
    findBestEffort,
    calculateVDOT,
    getTrainingPaces,
} from "@/lib/formulas";
import { getCalendarData } from "@/lib/scheduler"; // Phase 3: 스케줄러 로직

// UI Components
import { ACWRCard } from "@/components/dashboard/acwr-card";
import { VDOTCard } from "@/components/dashboard/vdot-card";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { TrainingCalendar } from "@/components/calendar/training-calendar"; // Phase 3: 캘린더 컴포넌트
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Activity } from "lucide-react";

// Helper: 미터 -> 킬로미터 변환 (소수점 1자리)
const toKm = (meters: number) => (meters / 1000).toFixed(1);

export default async function Dashboard() {
    // 1. 데이터 패칭 (Fetching)
    // 차트와 캘린더 매칭을 위해 최근 데이터를 넉넉히 가져옵니다.
    let activities = [];
    try {
        activities = await getStravaActivities(100);
    } catch (error) {
        console.error("Failed to fetch activities:", error);
        // 에러 발생 시 UI가 깨지지 않도록 빈 배열로 진행
    }

    // 2. 데이터 분석 (Analytics - Phase 1 & 2)

    // A. 부상 방지 (ACWR)
    const acwrData = calculateACWR(activities);

    // B. 주간 차트 데이터
    const weeklyData = getWeeklyStats(activities);

    // C. VDOT 및 훈련 페이스 (최근 6주 데이터 기준)
    const recentActivities = activities.filter((a) => {
        const diff =
            (new Date().getTime() - new Date(a.start_date).getTime()) /
            (1000 * 60 * 60 * 24);
        return diff <= 42;
    });
    const best5kMin = findBestEffort(recentActivities);
    const vdotScore = calculateVDOT(best5kMin);
    const paces = getTrainingPaces(vdotScore);

    // D. 기본 통계
    const totalDistance = activities.reduce(
        (acc, cur) => acc + cur.distance,
        0
    );
    const lastRun = activities[0];

    // 3. 스케줄러 데이터 생성 (Scheduler - Phase 3)
    const today = new Date();
    // 현재 연도/월을 기준으로 계획(JSON)과 활동(Strava)을 병합
    const calendarData = await getCalendarData(
        today.getFullYear(),
        today.getMonth() + 1,
        activities
    );

    return (
        <main className="min-h-screen bg-zinc-50/50 p-8">
            {/* 헤더 섹션 */}
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Personal Running Lab
                    </h1>
                    <p className="text-zinc-500 text-sm mt-1">
                        데이터로 달리는 나만의 러닝 연구소
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">v1.0.0 Alpha</Badge>
                    {activities.length > 0 ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">
                            스트라바 연동됨
                        </Badge>
                    ) : (
                        <Badge variant="destructive">연동 확인 필요</Badge>
                    )}
                </div>
            </header>

            {/* 상단 핵심 지표 그리드 (KPI Grid) */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. ACWR 카드 */}
                <ACWRCard data={acwrData} />

                {/* 2. VDOT 카드 (2칸 차지) */}
                <VDOTCard vdot={vdotScore} paces={paces} />

                {/* 3. 누적 거리 카드 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-700">
                            누적 주행 거리
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {toKm(totalDistance)} km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            최근 {activities.length}회 활동 합계
                        </p>
                    </CardContent>
                </Card>

                {/* 4. 최근 활동 카드 */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-bold text-zinc-700">
                            최근 활동
                        </CardTitle>
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        {lastRun ? (
                            <>
                                <div className="text-lg font-bold truncate">
                                    {lastRun.name}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {toKm(lastRun.distance)}km •{" "}
                                    {new Date(
                                        lastRun.start_date
                                    ).toLocaleDateString("ko-KR")}
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                기록 없음
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* 메인 차트 및 리스트 섹션 */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                {/* 주간 마일리지 차트 (4칸) */}
                <WeeklyChart data={weeklyData} />

                {/* 최근 활동 로그 (3칸) */}
                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-zinc-800">
                            최근 활동 로그
                        </CardTitle>
                        <CardDescription>
                            Strava 동기화 내역 (최근 5건)
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.slice(0, 5).map((run) => (
                                <div
                                    key={run.id}
                                    className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                >
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none">
                                            {run.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(
                                                run.start_date
                                            ).toLocaleDateString("ko-KR")}{" "}
                                            •{" "}
                                            {run.moving_time
                                                ? (
                                                      run.moving_time / 60
                                                  ).toFixed(0)
                                                : 0}
                                            분
                                        </p>
                                    </div>
                                    <div className="font-bold text-sm text-zinc-700">
                                        {toKm(run.distance)} km
                                    </div>
                                </div>
                            ))}
                            {activities.length === 0 && (
                                <p className="text-sm text-zinc-500 text-center py-4">
                                    표시할 데이터가 없습니다.
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* 훈련 캘린더 섹션 (Phase 3 New!) */}
            <div className="mt-6">
                <TrainingCalendar data={calendarData} currentDate={today} />
            </div>

            {/* 시스템 상태/디버그 섹션 */}
            <div className="mt-8 p-4 bg-zinc-100 rounded-lg">
                <p className="text-xs font-mono text-zinc-500">
                    [System Check] Strava Activities: {activities.length}{" "}
                    loaded. ACWR Status: {acwrData.status}. VDOT: {vdotScore}.
                    Calendar Sync: Active.
                </p>
            </div>
        </main>
    );
}
