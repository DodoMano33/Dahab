
import { useState, useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { SearchHistoryItem } from "@/types/analysis";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export function useHistoryData() {
  const { user } = useAuth();
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // استخدام مرجع للاشتراك في قناة التغييرات لتجنب إعادة الاشتراك غير الضروري
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(null);
  // إضافة مرجع لآخر تحديث لتجنب التحديثات المتكررة
  const lastRefreshRef = useRef<number>(0);

  // فحص البيانات عند تحميل المكون أو تغير المستخدم
  useEffect(() => {
    if (user) {
      fetchSearchHistory();
      
      // الاشتراك في التغييرات فقط إذا لم نكن مشتركين بالفعل
      if (!channelRef.current) {
        // إعداد قناة الاستماع للتغييرات في الوقت الحقيقي مع تقليل عدد الأحداث
        const channel = supabase
          .channel('search_history_changes')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'search_history',
              filter: `user_id=eq.${user.id}`
            },
            (payload) => {
              console.log('Realtime change detected:', payload);
              
              // تحسين معالجة الأحداث لتقليل عدد الاستعلامات
              // فرض الحد الأدنى للوقت بين التحديثات (5 ثوانٍ)
              const now = Date.now();
              if (now - lastRefreshRef.current < 5000) {
                console.log('تم تجاهل التحديث لتجنب التحديثات المتكررة');
                return;
              }
              
              if (payload.eventType === 'DELETE') {
                setSearchHistory(prev => prev.filter(item => item.id !== payload.old.id));
              } else if (payload.eventType === 'INSERT') {
                // للإدراجات الجديدة، نضيف العنصر الجديد مباشرةً بدلاً من إعادة جلب القائمة بأكملها
                const newItem = {
                  id: payload.new.id,
                  date: new Date(payload.new.created_at),
                  symbol: payload.new.symbol,
                  currentPrice: payload.new.current_price,
                  analysis: payload.new.analysis,
                  analysisType: payload.new.analysis_type,
                  timeframe: payload.new.timeframe || '1d',
                  targetHit: payload.new.target_hit || false,
                  stopLossHit: payload.new.stop_loss_hit || false,
                  analysis_duration_hours: payload.new.analysis_duration_hours || 8
                };
                setSearchHistory(prev => [newItem, ...prev]);
              } else if (payload.eventType === 'UPDATE') {
                // للتحديثات، نحدث العنصر الموجود بدلاً من إعادة جلب القائمة بأكملها
                setSearchHistory(prev => 
                  prev.map(item => 
                    item.id === payload.new.id 
                      ? {
                          ...item,
                          symbol: payload.new.symbol,
                          currentPrice: payload.new.current_price,
                          analysis: payload.new.analysis,
                          analysisType: payload.new.analysis_type,
                          timeframe: payload.new.timeframe || '1d',
                          targetHit: payload.new.target_hit || false,
                          stopLossHit: payload.new.stop_loss_hit || false,
                          analysis_duration_hours: payload.new.analysis_duration_hours || 8
                        }
                      : item
                  )
                );
              }
              
              lastRefreshRef.current = now;
            }
          )
          .subscribe();
        
        channelRef.current = channel;
      }

      return () => {
        if (channelRef.current) {
          supabase.removeChannel(channelRef.current);
          channelRef.current = null;
        }
      };
    } else {
      setSearchHistory([]);
    }
  }, [user]);

  const fetchSearchHistory = async () => {
    // تحقق من الوقت منذ آخر تحديث لتجنب الاستعلامات المتكررة
    const now = Date.now();
    if (now - lastRefreshRef.current < 5000) {
      console.log('تم تجاهل طلب التحديث لتجنب الاستعلامات المتكررة');
      return;
    }
    
    try {
      setIsRefreshing(true);
      console.log("جلب سجل البحث...");
      
      // تحسين الاستعلام لتقليل البيانات المسترجعة والتحميل على قاعدة البيانات
      const { data, error } = await supabase
        .from('search_history')
        .select('*, analysis_duration_hours')
        .order('created_at', { ascending: false })
        .limit(30); // تقليل عدد النتائج من 50 إلى 30

      if (error) {
        console.error("خطأ في جلب سجل البحث:", error);
        throw error;
      }

      console.log("تم استلام بيانات سجل البحث:", data.length);

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
      lastRefreshRef.current = now;
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

  return {
    searchHistory,
    setSearchHistory,
    isRefreshing,
    setIsRefreshing,
    fetchSearchHistory,
    handleDeleteHistoryItem,
    addToSearchHistory
  };
}
