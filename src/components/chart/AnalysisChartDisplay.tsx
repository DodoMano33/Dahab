
import { useEffect, useRef, useState } from "react";
import { Chart as ChartJS, LineController, LineElement, PointElement, CategoryScale, LinearScale, Tooltip as ChartTooltip, Legend } from "chart.js";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import { useCurrentPrice } from "@/hooks/current-price";
import { SearchHistoryItem } from "@/types/analysis";

// تسجيل مكونات الرسم البياني
ChartJS.register(LineController, LineElement, PointElement, CategoryScale, LinearScale, ChartTooltip, Legend);

interface AnalysisChartDisplayProps {
  searchHistory: SearchHistoryItem[];
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
}

export const AnalysisChartDisplay = ({ 
  searchHistory,
  isRefreshing,
  onRefresh
}: AnalysisChartDisplayProps) => {
  const targetsChartRef = useRef<HTMLCanvasElement>(null);
  const stopLossChartRef = useRef<HTMLCanvasElement>(null);
  const [targetsChart, setTargetsChart] = useState<ChartJS | null>(null);
  const [stopLossChart, setStopLossChart] = useState<ChartJS | null>(null);
  const { currentPrice, priceUpdateCount } = useCurrentPrice();
  
  // فلترة التحليلات النشطة فقط (التي ليس لها تاريخ نتيجة)
  const activeAnalyses = searchHistory.filter(item => !item.result_timestamp);
  
  // تحديث الرسم البياني عند تغير البيانات
  useEffect(() => {
    if (activeAnalyses.length === 0) return;
    
    createOrUpdateCharts();
    
    return () => {
      if (targetsChart) targetsChart.destroy();
      if (stopLossChart) stopLossChart.destroy();
    };
  }, [searchHistory, currentPrice, priceUpdateCount]);
  
  const createOrUpdateCharts = () => {
    if (!targetsChartRef.current || !stopLossChartRef.current) return;
    
    // تنظيف الرسوم البيانية السابقة
    if (targetsChart) targetsChart.destroy();
    if (stopLossChart) stopLossChart.destroy();
    
    // إعداد البيانات للرسم البياني
    const labels = activeAnalyses.map(item => 
      `${item.symbol} - ${item.timeframe} - ${format(new Date(item.date), 'MM/dd HH:mm', { locale: ar })}`
    );
    
    // بيانات الأهداف
    const targetsData = {
      labels,
      datasets: [
        {
          label: 'الهدف الأول',
          data: activeAnalyses.map(item => {
            if (item.analysis?.targets && Array.isArray(item.analysis.targets) && item.analysis.targets.length > 0) {
              return item.analysis.targets[0].price || 0;
            }
            return 0;
          }),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          pointRadius: 5,
          pointHoverRadius: 8
        },
        {
          label: 'السعر الحالي',
          data: activeAnalyses.map(() => currentPrice || 0),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          pointRadius: 0
        }
      ]
    };
    
    // بيانات وقف الخسارة
    const stopLossData = {
      labels,
      datasets: [
        {
          label: 'وقف الخسارة',
          data: activeAnalyses.map(item => item.analysis?.stopLoss || 0),
          borderColor: 'rgba(255, 159, 64, 1)',
          backgroundColor: 'rgba(255, 159, 64, 0.2)',
          pointRadius: 5,
          pointHoverRadius: 8
        },
        {
          label: 'السعر الحالي',
          data: activeAnalyses.map(() => currentPrice || 0),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderDash: [5, 5],
          pointRadius: 0
        }
      ]
    };
    
    // إنشاء الرسم البياني للأهداف
    setTargetsChart(new ChartJS(targetsChartRef.current, {
      type: 'line',
      data: targetsData,
      options: getChartOptions('مخطط الأهداف الأولى', true)
    }));
    
    // إنشاء الرسم البياني لوقف الخسارة
    setStopLossChart(new ChartJS(stopLossChartRef.current, {
      type: 'line',
      data: stopLossData,
      options: getChartOptions('مخطط وقف الخسارة', false)
    }));
  };
  
  const getChartOptions = (title: string, isTargets: boolean) => {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top' as const,
          rtl: true,
          labels: {
            font: {
              family: 'Tajawal, sans-serif'
            }
          }
        },
        tooltip: {
          rtl: true,
          titleFont: {
            family: 'Tajawal, sans-serif'
          },
          bodyFont: {
            family: 'Tajawal, sans-serif'
          },
          callbacks: {
            label: function(context: any) {
              const index = context.dataIndex;
              const datasetIndex = context.datasetIndex;
              
              if (datasetIndex === 0) {
                const analysis = activeAnalyses[index];
                const value = context.raw;
                
                return `${isTargets ? 'الهدف الأول' : 'وقف الخسارة'}: ${value.toFixed(4)}`;
              } else {
                return `السعر الحالي: ${currentPrice?.toFixed(4) || ''}`;
              }
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            },
            callback: function(value: any) {
              return value.toFixed(2);
            }
          }
        },
        x: {
          ticks: {
            font: {
              family: 'Tajawal, sans-serif'
            },
            maxRotation: 45,
            minRotation: 45
          }
        }
      }
    };
  };

  if (activeAnalyses.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle>مخطط التحليلات</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center p-8 text-muted-foreground">
            لا توجد تحليلات نشطة لعرضها في المخطط
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>مخطط التحليلات النشطة</CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-medium">
              عدد التحليلات: {activeAnalyses.length}
            </Badge>
            <Badge variant="outline" className="font-medium">
              السعر الحالي: {currentPrice?.toFixed(4) || '-'}
            </Badge>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onRefresh} 
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              تحديث
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="targets" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="targets">الأهداف الأولى</TabsTrigger>
            <TabsTrigger value="stopLoss">وقف الخسارة</TabsTrigger>
          </TabsList>
          <TabsContent value="targets" className="p-2">
            <div className="h-[400px] w-full">
              <canvas ref={targetsChartRef} />
            </div>
          </TabsContent>
          <TabsContent value="stopLoss" className="p-2">
            <div className="h-[400px] w-full">
              <canvas ref={stopLossChartRef} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};
