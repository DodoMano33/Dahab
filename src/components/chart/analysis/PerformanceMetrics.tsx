
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { BarChart3 } from 'lucide-react';
import { usePerformanceData } from './hooks/usePerformanceData';
import { OverallPerformanceTab } from './components/OverallPerformanceTab';
import { TimeframesPerformanceTab } from './components/TimeframesPerformanceTab';
import { DetailsPerformanceTab } from './components/DetailsPerformanceTab';
import { PerformanceLoadingState } from './components/PerformanceLoadingState';
import { PerformanceEmptyState } from './components/PerformanceEmptyState';

interface PerformanceMetricsProps {
  analysisType: string;
}

export function PerformanceMetrics({ analysisType }: PerformanceMetricsProps) {
  const { performance, timeframeData, loading } = usePerformanceData(analysisType);

  if (loading) {
    return (
      <Card>
        <PerformanceLoadingState />
      </Card>
    );
  }

  if (!performance) {
    return (
      <Card>
        <PerformanceEmptyState />
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <BarChart3 className="mr-2 h-5 w-5" />
          مؤشرات أداء التحليل: {analysisType}
        </CardTitle>
        <CardDescription>
          تحليل شامل لأداء استراتيجية {analysisType} استناداً إلى النتائج السابقة
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overall">الأداء العام</TabsTrigger>
            <TabsTrigger value="timeframes">حسب الإطار الزمني</TabsTrigger>
            <TabsTrigger value="details">تفاصيل وتوصيات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overall" className="space-y-4">
            <OverallPerformanceTab performance={performance} />
          </TabsContent>
          
          <TabsContent value="timeframes">
            <TimeframesPerformanceTab timeframeData={timeframeData} />
          </TabsContent>
          
          <TabsContent value="details">
            <DetailsPerformanceTab performance={performance} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PerformanceMetrics;
