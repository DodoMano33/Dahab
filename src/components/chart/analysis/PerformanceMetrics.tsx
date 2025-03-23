
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
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import { evaluateAnalysisPerformance } from "@/utils/technicalAnalysis/analysisAccuracy";
import { calculateDirectionAccuracy, calculateStopLossRate } from "@/utils/technicalAnalysis/analysisAccuracy";
import { TrendingUp, BarChart3, PieChart, Target, AlertTriangle } from 'lucide-react';

interface PerformanceMetricsProps {
  analysisType: string;
}

export function PerformanceMetrics({ analysisType }: PerformanceMetricsProps) {
  const [performance, setPerformance] = React.useState<any>(null);
  const [timeframeData, setTimeframeData] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // جلب أداء التحليل الشامل
        const performanceData = await evaluateAnalysisPerformance(analysisType);
        setPerformance(performanceData);
        
        // جلب بيانات الأطر الزمنية المختلفة
        const directionAccuracyData = await calculateDirectionAccuracy(analysisType);
        const stopLossData = await calculateStopLossRate(analysisType);
        
        // إعداد بيانات الرسوم البيانية للأطر الزمنية
        const timeframes = Object.keys(directionAccuracyData.detailedStats);
        const tfData = timeframes.map(tf => {
          const dirAcc = directionAccuracyData.detailedStats[tf].accuracy;
          const slRate = tf in stopLossData.timeframeStats 
            ? stopLossData.timeframeStats[tf].stopLossRate 
            : 0;
          
          return {
            name: tf,
            دقة_الاتجاه: Math.round(dirAcc * 100),
            معدل_وقف_الخسارة: Math.round(slRate * 100),
            التقييم_العام: Math.round(((dirAcc * 0.7) + ((1 - slRate) * 0.3)) * 100)
          };
        });
        
        setTimeframeData(tfData);
      } catch (error) {
        console.error('خطأ في جلب بيانات الأداء:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [analysisType]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>مؤشرات الأداء</CardTitle>
          <CardDescription>جاري تحميل البيانات...</CardDescription>
        </CardHeader>
        <CardContent className="min-h-80 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">جاري تحليل البيانات...</div>
        </CardContent>
      </Card>
    );
  }

  if (!performance) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>مؤشرات الأداء</CardTitle>
          <CardDescription>لا توجد بيانات كافية</CardDescription>
        </CardHeader>
        <CardContent className="min-h-80 flex items-center justify-center">
          <div className="text-muted-foreground">لا توجد بيانات كافية لعرض مؤشرات الأداء</div>
        </CardContent>
      </Card>
    );
  }

  // بيانات الأداء العام
  const overallData = [
    {
      name: 'دقة الاتجاه',
      قيمة: Math.round(performance.directionAccuracy * 100),
      icon: <TrendingUp className="h-4 w-4" />
    },
    {
      name: 'تحقيق الأهداف',
      قيمة: Math.round(performance.targetHitRate * 100),
      icon: <Target className="h-4 w-4" />
    },
    {
      name: 'تجنب وقف الخسارة',
      قيمة: Math.round((1 - performance.stopLossRate) * 100),
      icon: <AlertTriangle className="h-4 w-4" />
    },
    {
      name: 'التقييم العام',
      قيمة: Math.round(performance.overallScore * 100),
      icon: <BarChart3 className="h-4 w-4" />
    }
  ];

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
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overallData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis unit="%" />
                  <Tooltip formatter={(value) => [`${value}%`, ""]} />
                  <Bar 
                    dataKey="قيمة" 
                    fill="#8884d8" 
                    name="النسبة المئوية" 
                    label={{ position: 'top', formatter: (value) => `${value}%` }}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="timeframes">
            <div className="h-80">
              {timeframeData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={timeframeData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis unit="%" />
                    <Tooltip formatter={(value) => [`${value}%`, ""]} />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="دقة_الاتجاه" 
                      stroke="#8884d8" 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="معدل_وقف_الخسارة" 
                      stroke="#ff7300" 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="التقييم_العام" 
                      stroke="#82ca9d" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  لا توجد بيانات كافية للأطر الزمنية المختلفة
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="details">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">نقاط القوة</h3>
                {performance.strengths.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {performance.strengths.map((strength: string, index: number) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">لم يتم تحديد نقاط قوة بعد</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">نقاط الضعف</h3>
                {performance.weaknesses.length > 0 ? (
                  <ul className="list-disc list-inside space-y-1">
                    {performance.weaknesses.map((weakness: string, index: number) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-muted-foreground">لم يتم تحديد نقاط ضعف بعد</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">الأطر الزمنية الموصى بها</h3>
                {performance.recommendedTimeframes.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {performance.recommendedTimeframes.map((tf: string, index: number) => (
                      <div key={index} className="px-3 py-1 bg-primary/10 rounded-full text-primary text-sm">
                        {tf}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">لم يتم تحديد أطر زمنية موصى بها بعد</p>
                )}
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-2">الرموز الموصى بها</h3>
                {performance.recommendedSymbols.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {performance.recommendedSymbols.map((symbol: string, index: number) => (
                      <div key={index} className="px-3 py-1 bg-secondary/10 rounded-full text-secondary text-sm">
                        {symbol}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground">لم يتم تحديد رموز موصى بها بعد</p>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

export default PerformanceMetrics;
