import { getStravaActivities } from "@/lib/strava-api";
import { calculateACWR } from "@/lib/analytics";
import {
    findBestEffort,
    calculateVDOT,
    getTrainingPaces,
} from "@/lib/formulas";
import { ACWRCard } from "@/components/dashboard/acwr-card";
import { VDOTCard } from "@/components/dashboard/vdot-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, Activity } from "lucide-react";

const toKm = (meters: number) => (meters / 1000).toFixed(1);

export default async function Dashboard() {
    // 1. 데이터 패칭
    let activities: any[] = [];
    try {
        activities = await getStravaActivities(60);
    } catch (error) {
        console.error(error);
    }

    // 2. ACWR 계산
    const acwrData = calculateACWR(activities);

    // 3. VDOT 계산 (최근 6주 데이터 기준)
    const recentActivities = activities.filter((a) => {
        const diff =
            (new Date().getTime() - new Date(a.start_date).getTime()) /
            (1000 * 60 * 60 * 24);
        return diff <= 42;
    });

    const best5kMin = findBestEffort(recentActivities);
    const vdotScore = calculateVDOT(best5kMin);
    const paces = getTrainingPaces(vdotScore);

    // 통계용
    const totalDistance = activities.reduce(
        (acc, cur) => acc + cur.distance,
        0
    );
    const lastRun = activities[0];

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
                    <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        스트라바 연동됨
                    </Badge>
                </div>
            </header>

            {/* 메인 그리드 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. ACWR 카드 */}
                <ACWRCard data={acwrData} />

                {/* 2. VDOT 카드 (테이블 포함 2칸 차지) */}
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

            {/* 디버그 섹션 (옵션) */}
            <div className="mt-8 p-4 bg-zinc-100 rounded-lg">
                <p className="text-xs font-mono text-zinc-500">
                    [System Check] 데이터 로드: {activities.length}개. 단기
                    부하(Acute): {acwrData.acuteLoad.toFixed(2)}km. 장기
                    부하(Chronic): {acwrData.chronicLoad.toFixed(2)}km.
                </p>
            </div>
        </main>
    );
}
