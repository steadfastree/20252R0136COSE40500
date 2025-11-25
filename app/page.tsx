// app/page.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Trophy, Calendar } from "lucide-react";
import { getStravaActivities } from "@/lib/strava-api"; // API 모듈 임포트

// Helper: 미터 -> 킬로미터 변환 (소수점 1자리)
const toKm = (meters: number) => (meters / 1000).toFixed(1);

export default async function Dashboard() {
    // 서버 사이드 데이터 패칭
    // 에러 발생 시 Next.js의 error.tsx가 처리하지만, 여기선 간단히 빈 배열 처리 가능
    let activities: any[] = [];
    try {
        activities = await getStravaActivities(50); // 최근 50개 활동 요청
    } catch (error) {
        console.error(error);
        // 실제 운영 시 에러 UI 처리 필요
    }

    // 간단한 통계 계산 (데모용)
    const lastRun = activities[0]; // 가장 최근 활동
    const totalDistance = activities.reduce(
        (acc, cur) => acc + cur.distance,
        0
    );

    return (
        <main className="min-h-screen bg-zinc-50/50 p-8">
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Personal Running Lab
                    </h1>
                    <p className="text-zinc-500">
                        Data-driven training insights.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline">v1.0.0 Alpha</Badge>
                    {activities.length > 0 ? (
                        <Badge className="bg-emerald-600">
                            Strava Connected
                        </Badge>
                    ) : (
                        <Badge variant="destructive">Connection Error</Badge>
                    )}
                </div>
            </header>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* ... (ACWR, VDOT 카드는 아직 로직 구현 전이므로 유지) ... */}

                {/* 3. Weekly Volume (Real Data 반영) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Total Volume (Loaded)
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">
                            {toKm(totalDistance)} km
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                            From last {activities.length} runs
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Recent Run (Real Data 반영) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Latest Run
                        </CardTitle>
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        {lastRun ? (
                            <>
                                <div className="text-2xl font-bold">
                                    {lastRun.name}
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {toKm(lastRun.distance)}km •{" "}
                                    {new Date(
                                        lastRun.start_date
                                    ).toLocaleDateString()}
                                </p>
                            </>
                        ) : (
                            <div className="text-sm text-muted-foreground">
                                No recent runs found
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Activity List for Debugging */}
            <div className="mt-6">
                <h2 className="text-lg font-semibold mb-4">
                    Raw Activity Log (Debug)
                </h2>
                <div className="space-y-2">
                    {activities.slice(0, 5).map((run) => (
                        <Card
                            key={run.id}
                            className="p-4 flex justify-between items-center"
                        >
                            <div>
                                <p className="font-bold">{run.name}</p>
                                <p className="text-xs text-zinc-500">
                                    {new Date(run.start_date).toLocaleString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="font-mono text-sm">
                                    {toKm(run.distance)} km
                                </p>
                                <p className="text-xs text-zinc-500">
                                    {run.average_heartrate
                                        ? `${Math.round(
                                              run.average_heartrate
                                          )} bpm`
                                        : "No HR"}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </main>
    );
}
