"use client"; // Recharts는 클라이언트 컴포넌트 필수

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
    CartesianGrid,
    ReferenceLine,
} from "recharts";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { WeeklyStat } from "@/lib/analytics";

interface WeeklyChartProps {
    data: WeeklyStat[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
    return (
        <Card className="col-span-1 md:col-span-2 lg:col-span-4">
            <CardHeader>
                <CardTitle className="text-lg font-bold text-zinc-800">
                    주간 마일리지 (최근 12주)
                </CardTitle>
                <CardDescription>
                    꾸준함이 성장을 만듭니다. 이번 주 목표:{" "}
                    <span className="font-bold text-emerald-600">40km</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="pl-0">
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={data}
                            margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                vertical={false}
                                stroke="#f4f4f5"
                            />

                            <XAxis
                                dataKey="name"
                                stroke="#a1a1aa"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#a1a1aa"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}km`}
                            />

                            <Tooltip
                                cursor={{ fill: "#f4f4f5" }}
                                content={({ active, payload }) => {
                                    if (active && payload && payload.length) {
                                        const data = payload[0]
                                            .payload as WeeklyStat;
                                        return (
                                            <div className="rounded-lg border bg-white p-2 shadow-sm">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            기간
                                                        </span>
                                                        <span className="font-bold text-muted-foreground text-xs">
                                                            {data.fullDate}
                                                        </span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                                                            거리
                                                        </span>
                                                        <span className="font-bold text-emerald-600">
                                                            {data.distance} km
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />

                            {/* 주간 목표선 (40km 예시) */}
                            <ReferenceLine
                                y={40}
                                stroke="#f87171"
                                strokeDasharray="3 3"
                                label={{
                                    position: "right",
                                    value: "Goal",
                                    fill: "#f87171",
                                    fontSize: 10,
                                }}
                            />

                            <Bar
                                dataKey="distance"
                                fill="#18181b"
                                radius={[4, 4, 0, 0]} // 상단 둥글게
                                barSize={30}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
