
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

/**
 * هوك لإدارة الأحداث المرتبطة بتاريخ البحث
 */
export function useHistoryEvents(fetchHistoryCallback: () => Promise<void>) {
  const { user } = useAuth();

  // إعداد المستمعين للأحداث
  useEffect(() => {
    if (user) {
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
              // سيتم معالجة الحذف في المكون الأصلي
            } else if (payload.eventType === 'INSERT') {
              fetchHistoryCallback();
            } else if (payload.eventType === 'UPDATE') {
              fetchHistoryCallback();
            }
          }
        )
        .subscribe();

      // الاستماع للأحداث المخصصة
      const handleRefresh = () => {
        console.log('Refresh search history event received');
        fetchHistoryCallback();
      };
      
      window.addEventListener('refreshSearchHistory', handleRefresh);
      window.addEventListener('historyUpdated', handleRefresh);
      window.addEventListener('analyses-checked', handleRefresh);

      return () => {
        window.removeEventListener('refreshSearchHistory', handleRefresh);
        window.removeEventListener('historyUpdated', handleRefresh);
        window.removeEventListener('analyses-checked', handleRefresh);
        supabase.removeChannel(channel);
      };
    }
  }, [user, fetchHistoryCallback]);

  return {};
}
