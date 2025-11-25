import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity } from "lucide-react";
import { ACWRResult } from "@/lib/analytics";

interface ACWRCardProps {
    data: ACWRResult;
}

// 상태 메시지 한글화 매핑
const STATUS_KO: Record<string, string> = {
    Safe: "부하 부족/안전",
    "Sweet Spot": "최적 훈련 구간",
    Caution: "주의 필요",
    Danger: "부상 위험 (과부하)",
};

export function ACWRCard({ data }: ACWRCardProps) {
    const percentage = Math.min((data.ratio / 2.0) * 100, 100);
    const statusKo = STATUS_KO[data.status] || data.status;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-bold text-zinc-700">
                    부상 예측 비율 (ACWR)
                </CardTitle>
                <Activity className={`h-4 w-4 ${data.color}`} />
            </CardHeader>
            <CardContent>
                <div className="flex items-baseline gap-2">
                    <div className="text-2xl font-bold">{data.ratio}</div>
                    <span className={`text-sm font-bold ${data.color}`}>
                        {statusKo}
                    </span>
                </div>

                <p className="text-xs text-muted-foreground mt-1">
                    단기(7일): {data.acuteLoad.toFixed(1)}km / 장기(28일):{" "}
                    {data.chronicLoad.toFixed(1)}km
                </p>

                {/* 게이지 바 */}
                <div className="mt-4 relative h-2 w-full rounded-full bg-zinc-100 overflow-hidden">
                    {/* 최적 구간(0.8~1.3) 표시 */}
                    <div className="absolute top-0 bottom-0 left-[40%] right-[35%] bg-emerald-100/50" />

                    <div
                        className={`h-full rounded-full transition-all duration-500 ${data.color.replace(
                            "text-",
                            "bg-"
                        )}`}
                        style={{ width: `${percentage}%` }}
                    />
                </div>
                <div className="flex justify-between text-[10px] text-zinc-400 mt-1">
                    <span>0.0</span>
                    <span>0.8</span>
                    <span>1.3</span>
                    <span>1.5+</span>
                </div>
            </CardContent>
        </Card>
    );
}
