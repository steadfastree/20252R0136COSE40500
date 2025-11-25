import { getStravaActivities } from "@/lib/strava-api";
import { calculateACWR, getWeeklyStats } from "@/lib/analytics";
import {
    findBestEffort,
    getTrainingPaces,
    getRacePredictions,
    calculateTRIMP,
} from "@/lib/formulas"; // TRIMP 추가
import { getCalendarData } from "@/lib/scheduler";

// Data Source
import fs from "fs/promises";
import path from "path";

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
import { Trophy, Activity, Flame } from "lucide-react"; // Flame 아이콘 추가

// Helper
const toKm = (meters: number) => (meters / 1000).toFixed(1);

// User Config 로더 (간단히 내부 구현)
async function getUserConfig() {
    try {
        const filePath = path.join(process.cwd(), "data", "user-config.json");
        const fileContents = await fs.readFile(filePath, "utf8");
        return JSON.parse(fileContents);
    } catch (error) {
        return { maxHeartRate: 190, restHeartRate: 60 }; // 파일 없으면 기본값
    }
}

export default async function Dashboard() {
    // 1. 데이터 로드 (Strava + User Config)
    let activities: any[] = [];
    let userConfig = { maxHeartRate: 190, restHeartRate: 60 };

    try {
        const [activitiesData, configData] = await Promise.all([
            getStravaActivities(100),
            getUserConfig(),
        ]);
        activities = activitiesData;
        userConfig = configData;
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }

    // 2. 데이터 분석 (Analytics)
    const acwrData = calculateACWR(activities);
    const weeklyData = getWeeklyStats(activities);

    // VDOT
    const recentActivities = activities.filter((a) => {
        const diff =
            (new Date().getTime() - new Date(a.start_date).getTime()) /
            (1000 * 60 * 60 * 24);
        return diff <= 42;
    });
    const vdotScore = findBestEffort(recentActivities);
    const paces = getTrainingPaces(vdotScore);
    const racePredictions = getRacePredictions(vdotScore);

    // 기본 통계
    const totalDistance = activities.reduce(
        (acc, cur) => acc + cur.distance,
        0
    );
    const lastRun = activities[0];

    // 3. 스케줄러
    const today = new Date();
    const calendarData = await getCalendarData(
        today.getFullYear(),
        today.getMonth() + 1,
        activities
    );

    return (
        <main className="min-h-screen bg-zinc-50/50 p-8">
            {/* 헤더 */}
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
                    <Badge variant="outline">v1.1.0 Beta</Badge>
                    {activities.length > 0 ? (
                        <Badge className="bg-emerald-600 hover:bg-emerald-600">
                            스트라바 연동됨
                        </Badge>
                    ) : (
                        <Badge variant="destructive">연동 확인 필요</Badge>
                    )}
                </div>
            </header>

            {/* KPI Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <ACWRCard data={acwrData} />
                <VDOTCard
                    vdot={vdotScore}
                    paces={paces}
                    predictions={racePredictions}
                />

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

                {/* 최근 활동 요약 (TRIMP 추가) */}
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
                                <div className="flex justify-between items-end mt-1">
                                    <p className="text-xs text-muted-foreground">
                                        {toKm(lastRun.distance)}km •{" "}
                                        {new Date(
                                            lastRun.start_date
                                        ).toLocaleDateString("ko-KR")}
                                    </p>
                                    {/* TRIMP Badge Display */}
                                    <Badge
                                        variant="secondary"
                                        className="text-[10px] bg-orange-100 text-orange-700 hover:bg-orange-100"
                                    >
                                        <Flame className="w-3 h-3 mr-1 fill-orange-500 text-orange-500" />
                                        {calculateTRIMP(
                                            lastRun.moving_time / 60,
                                            lastRun.average_heartrate || 0,
                                            userConfig.maxHeartRate,
                                            userConfig.restHeartRate
                                        )}
                                    </Badge>
                                </div>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                기록 없음
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Charts & Logs */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <WeeklyChart data={weeklyData} />

                <Card className="col-span-1 md:col-span-2 lg:col-span-3">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-zinc-800">
                            최근 활동 로그
                        </CardTitle>
                        <CardDescription>
                            훈련 부하(TRIMP) 분석 포함
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.slice(0, 5).map((run) => {
                                const trimp = calculateTRIMP(
                                    run.moving_time / 60,
                                    run.average_heartrate || 0,
                                    userConfig.maxHeartRate,
                                    userConfig.restHeartRate
                                );

                                return (
                                    <div
                                        key={run.id}
                                        className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                                    >
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none truncate max-w-[150px]">
                                                {run.name}
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(
                                                    run.start_date
                                                ).toLocaleDateString(
                                                    "ko-KR"
                                                )}{" "}
                                                •{" "}
                                                {run.moving_time
                                                    ? (
                                                          run.moving_time / 60
                                                      ).toFixed(0)
                                                    : 0}
                                                분
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-sm text-zinc-700">
                                                {toKm(run.distance)} km
                                            </div>
                                            {/* TRIMP Score */}
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <Flame className="w-3 h-3 text-orange-400" />
                                                <span className="text-xs font-mono font-bold text-orange-600">
                                                    {trimp}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6">
                <TrainingCalendar data={calendarData} currentDate={today} />
            </div>

            <div className="mt-8 p-4 bg-zinc-100 rounded-lg">
                <p className="text-xs font-mono text-zinc-500">
                    [System Check] User HR Config: Max {userConfig.maxHeartRate}{" "}
                    / Rest {userConfig.restHeartRate}. ACWR: {acwrData.status}.
                    VDOT: {vdotScore}.
                </p>
            </div>
        </main>
    );
}
