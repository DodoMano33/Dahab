
import { useState, useEffect } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export const useSearchHistory = () => {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // تحقق من التحليلات المنتهية بشكل دوري
  useEffect(() => {
    if (user) {
      // فحص التحليلات المنتهية كل دقيقة
      const checkExpiredInterval = setInterval(() => {
        checkAndDeleteExpiredAnalyses();
      }, 60000); // كل دقيقة
      
      return () => clearInterval(checkExpiredInterval);
    }
  }, [user]);

  // فحص البيانات عند تحميل المكون أو تغير المستخدم
  useEffect(() => {
    if (user) {
      fetchSearchHistory();
      
      // إعداد قناة الاستماع للتغييرات في الوقت الفعلي
      const channel = supabase
        .channel('search_history_changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'search_history'
          },
          (payload) => {
            console.log('Realtime change detected:', payload);
            if (payload.eventType === 'DELETE') {
              setSearchHistory(prev => prev.filter(item => item.id !== payload.old.id));
            } else if (payload.eventType === 'INSERT') {
              fetchSearchHistory();
            } else if (payload.eventType === 'UPDATE') {
              fetchSearchHistory();
            }
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const checkAndDeleteExpiredAnalyses = async () => {
    try {
      console.log("فحص التحليلات المنتهية...");
      
      // تحويل التاريخ الحالي إلى كائن Date
      const now = new Date();
      
      // تحقق من كل تحليل في القائمة
      const expiredItems = searchHistory.filter(item => {
        const expiryDate = new Date(item.date);
        expiryDate.setHours(expiryDate.getHours() + (item.analysis_duration_hours || 8));
        return now > expiryDate;
      });
      
      if (expiredItems.length > 0) {
        console.log(`وجدنا ${expiredItems.length} تحليل منتهي، جاري الحذف...`);
        
        // حذف التحليلات المنتهية من قاعدة البيانات
        const deletePromises = expiredItems.map(item => 
          supabase.from('search_history').delete().eq('id', item.id)
        );
        
        await Promise.all(deletePromises);
        
        // تحديث القائمة المحلية
        setSearchHistory(prev => 
          prev.filter(item => !expiredItems.some(expired => expired.id === item.id))
        );
        
        console.log(`تم حذف ${expiredItems.length} تحليل منتهي بنجاح`);
        
        if (expiredItems.length > 0) {
          toast.info(`تم حذف ${expiredItems.length} تحليل منتهي`);
        }
      }
    } catch (error) {
      console.error("خطأ في فحص وحذف التحليلات المنتهية:", error);
    }
  };

  // فحص تحقق الأهداف ووقف الخسارة
  const checkTargetsAndStopLoss = async () => {
    try {
      console.log("فحص تحقق الأهداف ووقف الخسارة...");
      
      if (!user) {
        toast.error("يجب تسجيل الدخول لاستخدام هذه الميزة");
        return;
      }
      
      toast.info("جاري فحص تحقق الأهداف ووقف الخسارة...");
      
      // استدعاء وظيفة Edge Function لفحص التحليلات
      const { data, error } = await supabase.functions.invoke('check-analysis-targets');
      
      if (error) {
        console.error("خطأ في استدعاء وظيفة فحص التحليلات:", error);
        toast.error("حدث خطأ أثناء فحص تحقق الأهداف");
        return;
      }
      
      console.log("نتيجة فحص التحليلات:", data);
      
      // تحديث القائمة بعد الفحص
      fetchSearchHistory();
      
      // عرض نتائج الفحص
      const { checked, updated } = data;
      
      if (updated > 0) {
        toast.success(`تم تحديث ${updated} تحليل من إجمالي ${checked} تم فحصها`);
      } else {
        toast.info(`تم فحص ${checked} تحليل، لا توجد تحديثات`);
      }
    } catch (error) {
      console.error("خطأ في فحص تحقق الأهداف ووقف الخسارة:", error);
      toast.error("حدث خطأ أثناء الفحص");
    }
  };

  const fetchSearchHistory = async () => {
    try {
      setIsRefreshing(true);
      console.log("جلب سجل البحث...");
      const { data, error } = await supabase
        .from('search_history')
        .select('*, analysis_duration_hours')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("خطأ في جلب سجل البحث:", error);
        throw error;
      }

      console.log("تم استلام بيانات سجل البحث:", data);

      const formattedHistory: SearchHistoryItem[] = data.map(item => ({
        id: item.id,
        date: new Date(item.created_at),
        symbol: item.symbol,
        currentPrice: item.current_price,
        analysis: item.analysis,
        analysisType: item.analysis_type,
        timeframe: item.timeframe || '1d',
        targetHit: item.target_hit || false,
        stopLossHit: item.stop_loss_hit || false,
        analysis_duration_hours: item.analysis_duration_hours || 8
      }));

      setSearchHistory(formattedHistory);
      
      // فحص وحذف التحليلات المنتهية بعد جلب البيانات
      await checkAndDeleteExpiredAnalyses();
    } catch (error) {
      console.error("خطأ في جلب سجل البحث:", error);
      toast.error("حدث خطأ أثناء جلب سجل البحث");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleDeleteHistoryItem = async (id: string) => {
    try {
      console.log("محاولة حذف عنصر من السجل:", id);
      
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', id);

      if (error) {
        console.error("خطأ في حذف العنصر:", error);
        toast.error("حدث خطأ أثناء حذف العنصر");
        return;
      }

      // تحديث القائمة المحلية
      setSearchHistory(prev => prev.filter(item => item.id !== id));
      toast.success("تم حذف العنصر بنجاح");
      
      console.log("تم حذف العنصر بنجاح:", id);
    } catch (error) {
      console.error("خطأ في handleDeleteHistoryItem:", error);
      toast.error("حدث خطأ أثناء حذف العنصر");
    }
  };

  const addToSearchHistory = (item: SearchHistoryItem) => {
    console.log("إضافة عنصر جديد إلى سجل البحث:", item);
    setSearchHistory(prev => [item, ...prev]);
  };

  const refreshSearchHistory = async () => {
    await fetchSearchHistory();
    await checkTargetsAndStopLoss();
  };

  return {
    searchHistory,
    isHistoryOpen,
    isRefreshing,
    setIsHistoryOpen,
    handleDeleteHistoryItem,
    addToSearchHistory,
    refreshSearchHistory
  };
};
