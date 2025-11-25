import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Zap, Trophy, Calendar } from "lucide-react"; // 아이콘 (설치 필요 시 설명 참조)

export default function Dashboard() {
    return (
        <main className="min-h-screen bg-zinc-50/50 p-8">
            {/* Header Section */}
            <header className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                        Personal Running Lab
                    </h1>
                    <p className="text-zinc-500">
                        Data-driven training insights for a single runner.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="px-3 py-1">
                        v1.0.0 Alpha
                    </Badge>
                    <Badge className="bg-emerald-600 hover:bg-emerald-700">
                        System Normal
                    </Badge>
                </div>
            </header>

            {/* Grid Layout */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {/* 1. ACWR Widget (Phase 1) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Acute:Chronic Ratio
                        </CardTitle>
                        <Activity className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">1.05</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            <span className="text-emerald-600 font-bold">
                                Sweet Spot
                            </span>{" "}
                            (Safe)
                        </p>
                        <div className="mt-4 h-2 w-full rounded-full bg-zinc-100">
                            <div className="h-2 w-[50%] rounded-full bg-emerald-500" />
                        </div>
                    </CardContent>
                </Card>

                {/* 2. VDOT Score (Phase 2) */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Current VDOT
                        </CardTitle>
                        <Zap className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">48.2</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Based on recent 5k best
                        </p>
                    </CardContent>
                </Card>

                {/* 3. Weekly Volume */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Weekly Distance
                        </CardTitle>
                        <Trophy className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">32.5 km</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            +12% from last week
                        </p>
                    </CardContent>
                </Card>

                {/* 4. Next Session */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">
                            Next Session
                        </CardTitle>
                        <Calendar className="h-4 w-4 text-zinc-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">Easy Run</div>
                        <p className="text-xs text-muted-foreground mt-1">
                            Tomorrow • 8km @ 5:30/km
                        </p>
                    </CardContent>
                </Card>
            </div>

            {/* Main Chart Area Placeholder */}
            <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Training Load & Mileage</CardTitle>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="flex h-[300px] items-center justify-center rounded-md bg-zinc-50 border border-dashed">
                            Chart Placeholder
                        </div>
                    </CardContent>
                </Card>

                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>Recent Activities</CardTitle>
                        <CardDescription>
                            Last 5 runs synced from Strava
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* List Placeholder */}
                            <div className="flex items-center">
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">
                                        Morning Run
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        10km • 52:30 • 5:15/km
                                    </p>
                                </div>
                                <div className="ml-auto font-medium">
                                    +52 TRIMP
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}
