
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface SearchHistoryHeaderProps {
  initialCount?: number;
}

export const SearchHistoryHeader = ({ initialCount = 0 }: SearchHistoryHeaderProps) => {
  const [totalCount, setTotalCount] = useState(initialCount);
  const { user } = useAuth();

  useEffect(() => {
    setTotalCount(initialCount);

    const channel = supabase
      .channel('search_history_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'search_history',
          filter: user ? `user_id=eq.${user.id}` : undefined
        },
        async () => {
          // تحديث العدد عند أي تغيير
          const { count } = await supabase
            .from('search_history')
            .select('*', { count: 'exact', head: true });
          
          setTotalCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialCount, user]);

  return (
    <DialogHeader className="p-6 pb-0">
      <DialogTitle className="text-2xl font-bold flex items-center gap-2">
        سجل البحث
        <Badge variant="secondary" className="text-base font-bold">
          {totalCount} تحليل
        </Badge>
      </DialogTitle>
    </DialogHeader>
  );
};
