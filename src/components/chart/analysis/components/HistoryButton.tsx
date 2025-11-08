
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import { AnalysisCountBadge } from "./AnalysisCountBadge";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface HistoryButtonProps {
  onClick: () => void;
  title: string | React.ReactNode;
  count: number;
  variant?: "default" | "outline" | "destructive" | "secondary" | "ghost" | "link";
  className?: string;
  table?: string;
}

export const HistoryButton = ({ 
  onClick, 
  title, 
  count: initialCount, 
  variant = "default",
  className = "",
  table = "search_history"
}: HistoryButtonProps) => {
  const [count, setCount] = useState(initialCount);
  const { user } = useAuth();

  useEffect(() => {
    setCount(initialCount);

    if (!user) return;

    const channel = supabase
      .channel(`${table}_changes`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: table,
          filter: `user_id=eq.${user.id}`
        },
        async () => {
          // تحديث العدد عند أي تغيير
          const { count: newCount } = await supabase
            .from(table)
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          setCount(newCount || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialCount, table, user]);

  return (
    <Button
      onClick={onClick}
      variant={variant}
      className={`h-20 flex items-center justify-between gap-2 max-w-[600px] w-full px-4 ${className}`}
    >
      <div className="flex items-center gap-2">
        <History className="w-5 h-20" />
        {title}
      </div>
      <AnalysisCountBadge count={count} />
    </Button>
  );
};
