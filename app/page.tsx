import { getStravaActivities } from "@/lib/strava-api";
import { calculateACWR, getWeeklyStats } from "@/lib/analytics";
import {
    findBestEffort,
    getTrainingPaces,
    getRacePredictions,
} from "@/lib/formulas"; // Updated imports
import { getCalendarData } from "@/lib/scheduler";

// UI Components
import { ACWRCard } from "@/components/dashboard/acwr-card";
import { VDOTCard } from "@/components/dashboard/vdot-card";
import { WeeklyChart } from "@/components/charts/weekly-chart";
import { TrainingCalendar } from "@/components/calendar/training-calendar";
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
    let activities: any[] = [];
    try {
        activities = await getStravaActivities(100);
    } catch (error) {
        console.error("Failed to fetch activities:", error);
    }

    // 2. 데이터 분석 (Analytics)

    // A. 부상 방지 (ACWR)
    const acwrData = calculateACWR(activities);

    // B. 주간 차트 데이터
    const weeklyData = getWeeklyStats(activities);

    // C. VDOT 및 레이스 예측 (Advanced Math Applied)
    // 최근 6주(42일) 데이터 기준
    const recentActivities = activities.filter((a) => {
        const diff =
            (new Date().getTime() - new Date(a.start_date).getTime()) /
            (1000 * 60 * 60 * 24);
        return diff <= 42;
    });

    // New: 이제 함수가 VDOT 점수를 바로 반환합니다.
    const vdotScore = findBestEffort(recentActivities);
    const paces = getTrainingPaces(vdotScore);
    const racePredictions = getRacePredictions(vdotScore); // 예상 기록 추가

    // D. 기본 통계
    const totalDistance = activities.reduce(
        (acc, cur) => acc + cur.distance,
        0
    );
    const lastRun = activities[0];

    // 3. 스케줄러 데이터 (Plan vs Actual)
    const today = new Date();
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

            {/* 상단 핵심 지표 그리드 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. ACWR 카드 */}
                <ACWRCard data={acwrData} />

                {/* 2. VDOT 카드 (예상 기록 포함) */}
                <VDOTCard
                    vdot={vdotScore}
                    paces={paces}
                    predictions={racePredictions}
                />

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
                <WeeklyChart data={weeklyData} />

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

            {/* 훈련 캘린더 섹션 */}
            <div className="mt-6">
                <TrainingCalendar data={calendarData} currentDate={today} />
            </div>

            {/* 시스템 상태/디버그 섹션 */}
            <div className="mt-8 p-4 bg-zinc-100 rounded-lg">
                <p className="text-xs font-mono text-zinc-500">
                    [System Check] Strava Activities: {activities.length}{" "}
                    loaded. ACWR Status: {acwrData.status}. VDOT: {vdotScore}{" "}
                    (Jack Daniels Formula).
                </p>
            </div>
        </main>
    );
}
