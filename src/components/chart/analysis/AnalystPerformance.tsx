
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { evaluateAnalysisPerformance } from "@/utils/technicalAnalysis/accuracy";
import { PerformanceChart } from './components/PerformanceChart';
import { PerformanceTable } from './components/PerformanceTable';

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
  const [selectedCategory, setSelectedCategory] = useState<string>('directionAccuracy');

  const fetchAllPerformance = async () => {
    setLoading(true);
    try {
      const performancePromises = analysisTypes.map(type => 
        evaluateAnalysisPerformance(type.id)
          .then(performance => ({ type: type.id, ...performance }))
          .catch(() => null) 
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
                <PerformanceChart 
                  performances={performances}
                  selectedCategory={selectedCategory}
                  getDisplayName={getDisplayName}
                />
              </TabsContent>
              
              <TabsContent value="table">
                <PerformanceTable 
                  performances={performances}
                  getDisplayName={getDisplayName}
                />
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
