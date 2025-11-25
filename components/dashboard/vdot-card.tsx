import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

interface VdotProps {
    vdot: number;
    paces: {
        Easy: string;
        Marathon: string;
        Threshold: string;
        Interval: string;
        Repetition: string;
    };
}

export function VDOTCard({ vdot, paces }: VdotProps) {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-zinc-700">
                        러닝 능력 지표 (VDOT)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        최근 활동 중 최고의 퍼포먼스 기준
                    </p>
                </div>
                <div className="flex flex-col items-end">
                    <div className="flex items-center gap-1">
                        <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500" />
                        <span className="text-3xl font-black tracking-tighter">
                            {vdot}
                        </span>
                    </div>
                    <Badge variant="secondary" className="text-[10px] mt-1">
                        Fitness Level
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="h-8 text-xs font-bold text-zinc-600">
                                훈련 타입
                            </TableHead>
                            <TableHead className="h-8 text-xs font-bold text-right text-zinc-600">
                                목표 페이스 (/km)
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="py-2 font-medium text-xs">
                                조깅 (Easy)
                            </TableCell>
                            <TableCell className="py-2 text-right font-mono text-xs">
                                {paces.Easy}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="py-2 font-medium text-xs text-emerald-600">
                                역치주 (Threshold)
                            </TableCell>
                            <TableCell className="py-2 text-right font-mono text-xs font-bold text-emerald-600">
                                {paces.Threshold}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell className="py-2 font-medium text-xs text-blue-600">
                                인터벌 (Interval)
                            </TableCell>
                            <TableCell className="py-2 text-right font-mono text-xs font-bold text-blue-600">
                                {paces.Interval}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    );
}
