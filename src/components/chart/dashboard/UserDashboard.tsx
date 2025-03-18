
import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { useQueryClient } from "@tanstack/react-query";
import { DashboardStats } from "./DashboardStats";
import { CalendarCard } from "./CalendarCard";
import { DetailedStatsTabs } from "./DetailedStatsTabs";
import { LatestAnalyses } from "./LatestAnalyses";
import { useDashboardStats } from "./hooks/useDashboardStats";
import { toast } from "sonner";

export function UserDashboard() {
  const { user } = useAuth();
  const [date, setDate] = useState<Date | undefined>(new Date());
  const { stats, isLoading, dashboardStats, setStats, setIsLoading } = useDashboardStats(user?.id);
  const queryClient = useQueryClient();
  const [isDashboardReady, setIsDashboardReady] = useState(false);

  // تهيئة لوحة المعلومات
  useEffect(() => {
    // إظهار لوحة المعلومات بعد فترة قصيرة
    const timer = setTimeout(() => {
      setIsDashboardReady(true);
      toast.success("تم تحميل لوحة المعلومات بنجاح");
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // For periodic data updates
  useEffect(() => {
    const interval = setInterval(() => {
      queryClient.invalidateQueries({ queryKey: ['searchHistory'] });
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [queryClient]);

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

  // عرض رسالة تحميل أثناء تهيئة لوحة المعلومات
  if (!isDashboardReady) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mr-2"></div>
        <span>جاري تحميل لوحة المعلومات...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* إحصائيات عامة */}
        <DashboardStats 
          isLoading={isLoading} 
          stats={dashboardStats} 
        />
        
        {/* التقويم */}
        <CalendarCard date={date} setDate={setDate} />
      </div>
      
      {/* الإحصائيات والرسوم البيانية */}
      <DetailedStatsTabs 
        stats={stats} 
        isLoading={isLoading} 
        setStats={setStats} 
        setIsLoading={setIsLoading} 
      />
      
      {/* آخر التحليلات */}
      <LatestAnalyses userId={user.id} />
    </div>
  );
}

export default UserDashboard;
