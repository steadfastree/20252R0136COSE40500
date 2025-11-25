import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDay } from "@/lib/types";
import {
    CheckCircle2,
    XCircle,
    Star,
    Calendar as CalendarIcon,
} from "lucide-react";

interface TrainingCalendarProps {
    data: CalendarDay[];
    currentDate: Date; // 현재 표시 중인 달
}

export function TrainingCalendar({ data, currentDate }: TrainingCalendarProps) {
    const yearMonth = currentDate.toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "long",
    });

    // 요일 헤더
    const weeks = ["일", "월", "화", "수", "목", "금", "토"];

    return (
        <Card className="col-span-full">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
                <div className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5 text-zinc-500" />
                    <CardTitle className="text-xl font-bold text-zinc-800">
                        {yearMonth} 훈련 로그
                    </CardTitle>
                </div>
                <div className="flex gap-2 text-xs">
                    <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-500" />{" "}
                        달성
                    </div>
                    <div className="flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-red-400" /> 미달성
                    </div>
                    <div className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-yellow-500" /> 보너스
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                {/* 요일 헤더 */}
                <div className="grid grid-cols-7 mb-2 text-center">
                    {weeks.map((day) => (
                        <div
                            key={day}
                            className="text-xs font-bold text-zinc-400 py-2"
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* 날짜 그리드 */}
                <div className="grid grid-cols-7 gap-2">
                    {/* 시작 요일 맞추기 위한 빈칸 (매월 1일의 요일 계산 필요) */}
                    {Array.from({
                        length: new Date(data[0].date).getDay(),
                    }).map((_, i) => (
                        <div key={`empty-${i}`} className="min-h-[100px]" />
                    ))}

                    {data.map((day) => {
                        const dateNum = day.date
                            .split("-")[2]
                            .replace(/^0/, ""); // 01 -> 1
                        const isToday =
                            day.date === new Date().toISOString().split("T")[0];

                        return (
                            <div
                                key={day.date}
                                className={`
                  relative min-h-[100px] p-2 rounded-lg border text-sm flex flex-col gap-1 transition-colors
                  ${
                      isToday
                          ? "bg-zinc-50 border-zinc-400"
                          : "border-zinc-100 hover:border-zinc-200"
                  }
                  ${day.status === "run-missed" ? "bg-red-50/30" : ""}
                `}
                            >
                                {/* 날짜 숫자 */}
                                <span
                                    className={`text-xs font-bold ${
                                        isToday
                                            ? "text-emerald-600"
                                            : "text-zinc-500"
                                    }`}
                                >
                                    {dateNum}
                                </span>

                                {/* 1. 계획 표시 (Plan) */}
                                {day.plan && (
                                    <div className="mt-1 p-1 bg-zinc-100 rounded text-[10px] text-zinc-600 truncate">
                                        <span className="font-bold">계획:</span>{" "}
                                        {day.plan.distance}km {day.plan.type}
                                    </div>
                                )}

                                {/* 2. 실행 표시 (Actual) */}
                                {day.activity && (
                                    <div className="p-1 bg-emerald-100 text-emerald-800 rounded text-[10px] truncate font-bold">
                                        완료:{" "}
                                        {(day.activity.distance / 1000).toFixed(
                                            1
                                        )}
                                        km
                                    </div>
                                )}

                                {/* 3. 상태 아이콘 (Status Badge) */}
                                <div className="absolute top-2 right-2">
                                    {day.status === "run-success" && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                    )}
                                    {day.status === "run-missed" && (
                                        <XCircle className="w-4 h-4 text-red-400" />
                                    )}
                                    {day.status === "run-bonus" && (
                                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </CardContent>
        </Card>
    );
}
