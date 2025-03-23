import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Award, TrendingUp, AlertTriangle, Clock, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { evaluateAnalysisPerformance } from "@/utils/technicalAnalysis/analysisAccuracy";
import { Skeleton } from "@/components/ui/skeleton";

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

const analysisTypes = [
  { id: 'شبكات عصبية', name: 'شبكات عصبية' },
  { id: 'نظرية هيكل السوق', name: 'نظرية هيكل السوق' },
  { id: 'تقلبات', name: 'تحليل التقلبات' },
  { id: 'حركة السعر', name: 'حركة السعر' },
  { id: 'نمطي', name: 'تحليل الأنماط' },
  { id: 'فيبوناتشي', name: 'فيبوناتشي' },
  { id: 'تعلم آلي', name: 'تعلم آلي' },
  { id: 'سكالبينج', name: 'سكالبينج' },
];

export function AnalystPerformance() {
  const [performances, setPerformances] = useState<AnalysisPerformance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('directionAccuracy');

  const fetchAllPerformance = async () => {
    setLoading(true);
    try {
      const performancePromises = analysisTypes.map(type => 
        evaluateAnalysisPerformance(type.id)
          .then(performance => ({ type: type.id, ...performance }))
          .catch(() => null) // تخطي التحليلات التي ليس لديها بيانات كافية
      );
      
      const results = await Promise.all(performancePromises);
      const filteredResults = results.filter(result => result !== null) as AnalysisPerformance[];
      
      filteredResults.sort((a, b) => b.overallScore - a.overallScore);
      
      setPerformances(filteredResults);
    } catch (error) {
      console.error('خطأ في جلب بيانات الأداء:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllPerformance();
  }, []);

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)} دقيقة`;
    } else if (hours < 24) {
      return `${hours.toFixed(1)} ساعة`;
    } else {
      return `${(hours / 24).toFixed(1)} يوم`;
    }
  };

  const getRatingClass = (value: number, metric: string) => {
    if (metric === 'stopLossRate') {
      if (value < 0.2) return 'text-green-600';
      if (value < 0.4) return 'text-yellow-600';
      return 'text-red-600';
    } else {
      if (value > 0.7) return 'text-green-600';
      if (value > 0.5) return 'text-yellow-600';
      return 'text-red-600';
    }
  };

  const getDisplayName = (type: string) => {
    const found = analysisTypes.find(t => t.id === type);
    return found ? found.name : type;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          أداء أنواع التحليل
        </CardTitle>
        <CardDescription>
          تقييم دقة وفعالية أنواع التحليل المختلفة بناءً على النتائج السابقة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="اختر معيار التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="directionAccuracy">دقة تحديد الاتجاه</SelectItem>
                <SelectItem value="targetHitRate">معدل تحقيق الأهداف</SelectItem>
                <SelectItem value="stopLossRate">معدل وقف الخسارة</SelectItem>
                <SelectItem value="overallScore">التقييم العام</SelectItem>
              </SelectContent>
            </Select>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={fetchAllPerformance}
              disabled={loading}
            >
              تحديث البيانات
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="flex items-center space-x-4 rtl:space-x-reverse">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : (
            <Tabs defaultValue="chart" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chart">رسم بياني</TabsTrigger>
                <TabsTrigger value="table">جدول</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chart" className="space-y-4">
                {performances.length === 0 ? (
                  <div className="text-center py-10 text-gray-500">
                    لا توجد بيانات كافية لعرض تقييم الأداء
                  </div>
                ) : (
                  performances.map((performance) => (
                    <div key={performance.type} className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">
                          {getDisplayName(performance.type)}
                        </span>
                        <span className={`font-bold ${getRatingClass(
                          selectedCategory === 'stopLossRate' 
                            ? 1 - performance[selectedCategory as keyof AnalysisPerformance] as number
                            : performance[selectedCategory as keyof AnalysisPerformance] as number,
                          selectedCategory
                        )}`}>
                          {selectedCategory === 'stopLossRate'
                            ? formatPercentage(performance.stopLossRate)
                            : selectedCategory === 'averageTimeToTarget'
                              ? formatTime(performance.averageTimeToTarget)
                              : formatPercentage(performance[selectedCategory as keyof AnalysisPerformance] as number)}
                        </span>
                      </div>
                      <Progress 
                        value={selectedCategory === 'stopLossRate'
                          ? (1 - performance.stopLossRate) * 100
                          : ((performance[selectedCategory as keyof AnalysisPerformance] as unknown) as number) * 100} 
                        className="h-2"
                      />
                    </div>
                  ))
                )}
              </TabsContent>
              
              <TabsContent value="table">
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
              </TabsContent>
            </Tabs>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between items-center text-sm text-muted-foreground">
        <div className="flex items-center">
          <Clock className="mr-1 h-4 w-4" />
          <span>البيانات محدثة:</span>
          <span className="ml-1">{new Date().toLocaleString('ar-SA')}</span>
        </div>
        <Badge variant="outline">
          مبني على التحليلات السابقة
        </Badge>
      </CardFooter>
    </Card>
  );
}

export default AnalystPerformance;
