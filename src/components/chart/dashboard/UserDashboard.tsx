
import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisStatsChart } from "./AnalysisStatsChart";
import { SuccessRateChart } from "./SuccessRateChart";
import { TimeframePerfChart } from "./TimeframePerfChart";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, LineChart, PieChart } from "recharts";
import { Button } from "@/components/ui/button";
import { RefreshCw, Filter, Calendar as CalendarIcon, Download } from "lucide-react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

// إضافة مكون لعرض التحليلات الأخيرة
function LatestAnalyses({ userId }: { userId: string }) {
  const [analyses, setAnalyses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestAnalyses = async () => {
      try {
        const { data, error } = await supabase
          .from('search_history')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setAnalyses(data || []);
      } catch (error) {
        console.error('Error fetching analyses:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestAnalyses();
  }, [userId]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2 mr-4">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {analyses.length === 0 ? (
        <p className="text-center text-muted-foreground">لا توجد تحليلات حديثة</p>
      ) : (
        analyses.map((analysis) => (
          <div key={analysis.id} className="border rounded-lg p-3">
            <div className="flex justify-between">
              <h4 className="font-medium">{analysis.symbol}</h4>
              <span className="text-sm text-muted-foreground">
                {new Date(analysis.created_at).toLocaleDateString('ar-SA')}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="text-sm">{analysis.analysis_type} - {analysis.timeframe}</span>
              <div className="flex items-center">
                <span className={`text-sm ${analysis.target_hit ? 'text-green-500' : ''}`}>
                  {analysis.analysis.direction}
                </span>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// المكون الرئيسي للوحة القيادة
export function UserDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());

  useEffect(() => {
    if (!user) return;
    
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase.rpc('get_backtest_stats');
        
        if (error) {
          console.error('Error fetching stats:', error);
          toast.error('حدث خطأ أثناء جلب البيانات الإحصائية');
          return;
        }
        
        setStats(data || []);
      } catch (error) {
        console.error('Error in fetchStats:', error);
        toast.error('حدث خطأ أثناء جلب البيانات الإحصائية');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStats();
  }, [user]);

  const dashboardStats = useMemo(() => {
    if (!stats.length) return { totalSuccess: 0, totalFail: 0, overallRate: 0, bestType: '' };
    
    const totalSuccess = stats.reduce((acc, stat) => acc + stat.success, 0);
    const totalFail = stats.reduce((acc, stat) => acc + stat.fail, 0);
    const total = totalSuccess + totalFail;
    
    const overallRate = total > 0 ? Math.round((totalSuccess / total) * 100) : 0;
    
    const bestType = stats.reduce((prev, current) => {
      const prevRate = prev.success / (prev.success + prev.fail) || 0;
      const currentRate = current.success / (current.success + current.fail) || 0;
      return currentRate > prevRate ? current : prev;
    }).type;
    
    return { totalSuccess, totalFail, overallRate, bestType };
  }, [stats]);

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>لوحة المعلومات الشخصية</CardTitle>
          <CardDescription>
            يرجى تسجيل الدخول لعرض لوحة المعلومات الخاصة بك
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* إحصائيات عامة */}
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>لوحة المعلومات الشخصية</CardTitle>
            <CardDescription>
              نظرة عامة على أدائك وتحليلاتك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">نسبة النجاح</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      `${dashboardStats.overallRate}%`
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isLoading ? (
                      <Skeleton className="h-4 w-24" />
                    ) : (
                      `${dashboardStats.totalSuccess + dashboardStats.totalFail} تحليل`
                    )}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">أفضل نوع تحليل</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-24" />
                    ) : (
                      dashboardStats.bestType || "-"
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    بناءً على نسبة النجاح
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">التحليلات</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {isLoading ? (
                      <Skeleton className="h-8 w-16" />
                    ) : (
                      dashboardStats.totalSuccess + dashboardStats.totalFail
                    )}
                  </div>
                  <div className="flex gap-2 mt-1">
                    <span className="text-xs text-green-500">
                      {dashboardStats.totalSuccess} ناجح
                    </span>
                    <span className="text-xs text-red-500">
                      {dashboardStats.totalFail} فاشل
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
        
        {/* التقويم وآخر التحليلات */}
        <Card className="w-full md:w-80">
          <CardHeader>
            <CardTitle>التقويم</CardTitle>
            <CardDescription>
              تتبع نشاطك اليومي
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border"
            />
          </CardContent>
        </Card>
      </div>
      
      {/* الإحصائيات والرسوم البيانية */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>الإحصائيات المفصلة</CardTitle>
            <CardDescription>
              تحليل أدائك وإحصائيات النجاح
            </CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="icon" 
            onClick={() => {
              setIsLoading(true);
              supabase.rpc('get_backtest_stats').then(({ data }) => {
                setStats(data || []);
                setIsLoading(false);
              });
            }} 
            disabled={isLoading}
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList className="grid grid-cols-3 gap-4 w-full">
              <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
              <TabsTrigger value="types">أنواع التحليل</TabsTrigger>
              <TabsTrigger value="timeframes">الأطر الزمنية</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <SuccessRateChart stats={stats} />
            </TabsContent>
            
            <TabsContent value="types">
              <AnalysisStatsChart stats={stats} />
            </TabsContent>
            
            <TabsContent value="timeframes">
              <TimeframePerfChart stats={stats} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* آخر التحليلات */}
      <Card>
        <CardHeader>
          <CardTitle>آخر التحليلات</CardTitle>
          <CardDescription>
            أحدث التحليلات التي قمت بها
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LatestAnalyses userId={user.id} />
        </CardContent>
      </Card>
    </div>
  );
}
