
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatPercentage, getRatingClass } from "../utils/performanceUtils";

interface AnalysisPerformance {
  type: string;
  overallScore: number;
  directionAccuracy: number;
  targetHitRate: number;
  stopLossRate: number;
  averageTimeToTarget: number;
  recommendedTimeframes: string[];
  recommendedSymbols: string[];
  weaknesses: string[];
  strengths: string[];
}

interface PerformanceTableProps {
  performances: AnalysisPerformance[];
  getDisplayName: (type: string) => string;
}

export const PerformanceTable: React.FC<PerformanceTableProps> = ({
  performances,
  getDisplayName,
}) => {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>نوع التحليل</TableHead>
            <TableHead>التقييم العام</TableHead>
            <TableHead>دقة الاتجاه</TableHead>
            <TableHead>تحقيق الأهداف</TableHead>
            <TableHead>معدل وقف الخسارة</TableHead>
            <TableHead>الأطر الزمنية الموصى بها</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {performances.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                لا توجد بيانات كافية لعرض تقييم الأداء
              </TableCell>
            </TableRow>
          ) : (
            performances.map((performance) => (
              <TableRow key={performance.type}>
                <TableCell className="font-medium">
                  {getDisplayName(performance.type)}
                </TableCell>
                <TableCell className={getRatingClass(performance.overallScore, 'overall')}>
                  {formatPercentage(performance.overallScore)}
                </TableCell>
                <TableCell className={getRatingClass(performance.directionAccuracy, 'accuracy')}>
                  {formatPercentage(performance.directionAccuracy)}
                </TableCell>
                <TableCell className={getRatingClass(performance.targetHitRate, 'target')}>
                  {formatPercentage(performance.targetHitRate)}
                </TableCell>
                <TableCell className={getRatingClass(performance.stopLossRate, 'stopLossRate')}>
                  {formatPercentage(performance.stopLossRate)}
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {performance.recommendedTimeframes.map(tf => (
                      <Badge key={tf} variant="outline" className="text-xs">
                        {tf}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};
