import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // 추가됨
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Zap, Timer } from "lucide-react";

interface VdotProps {
    vdot: number;
    paces: {
        Easy: string;
        Marathon: string;
        Threshold: string;
        Interval: string;
        Repetition: string;
    };
    predictions: {
        // 추가됨
        "5k": string;
        "10k": string;
        Half: string;
        Full: string;
    };
}

export function VDOTCard({ vdot, paces, predictions }: VdotProps) {
    return (
        <Card className="col-span-1 md:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                    <CardTitle className="text-base font-bold text-zinc-700">
                        러닝 능력 지표 (VDOT)
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                        당신의 잠재력을 분석했습니다
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
            <CardContent className="pt-2">
                <Tabs defaultValue="training" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-2">
                        <TabsTrigger value="training">훈련 페이스</TabsTrigger>
                        <TabsTrigger value="race">예상 기록</TabsTrigger>
                    </TabsList>

                    {/* Tab 1: 훈련 페이스 */}
                    <TabsContent value="training">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="h-8 text-xs font-bold text-zinc-600">
                                        타입
                                    </TableHead>
                                    <TableHead className="h-8 text-xs font-bold text-right text-zinc-600">
                                        페이스 (/km)
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs">
                                        조깅 (E)
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs">
                                        {paces.Easy}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs text-emerald-600">
                                        역치주 (T)
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs font-bold text-emerald-600">
                                        {paces.Threshold}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs text-blue-600">
                                        인터벌 (I)
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs font-bold text-blue-600">
                                        {paces.Interval}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>

                    {/* Tab 2: 예상 기록 (New!) */}
                    <TabsContent value="race">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="h-8 text-xs font-bold text-zinc-600">
                                        종목
                                    </TableHead>
                                    <TableHead className="h-8 text-xs font-bold text-right text-zinc-600">
                                        예상 시간
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs">
                                        5K
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs">
                                        {predictions["5k"]}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs">
                                        10K
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs">
                                        {predictions["10k"]}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs">
                                        Half
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs">
                                        {predictions["Half"]}
                                    </TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell className="py-2 font-medium text-xs font-bold text-purple-600">
                                        Full
                                    </TableCell>
                                    <TableCell className="py-2 text-right font-mono text-xs font-bold text-purple-600">
                                        {predictions["Full"]}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
