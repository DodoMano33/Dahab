import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/AuthContext";
import { AnalysisCountBadge } from "../analysis/components/AnalysisCountBadge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchHistoryItem } from "@/types/analysis";

interface SearchHistoryHeaderProps {
  initialCount?: number;
  searchTerm?: string;
  setSearchTerm?: Dispatch<SetStateAction<string>>;
  symbolFilter?: string | null;
  setSymbolFilter?: Dispatch<SetStateAction<string | null>>;
  timeframeFilter?: string | null;
  setTimeframeFilter?: Dispatch<SetStateAction<string | null>>;
  directionFilter?: string | null;
  setDirectionFilter?: Dispatch<SetStateAction<string | null>>;
  history?: SearchHistoryItem[];
}

export const SearchHistoryHeader = ({ 
  initialCount = 0,
  searchTerm,
  setSearchTerm,
  symbolFilter,
  setSymbolFilter,
  timeframeFilter,
  setTimeframeFilter,
  directionFilter,
  setDirectionFilter,
  history = []
}: SearchHistoryHeaderProps) => {
  const [totalCount, setTotalCount] = useState(initialCount);
  const { user } = useAuth();

  useEffect(() => {
    setTotalCount(initialCount);

    if (!user) return;

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
        async () => {
          // تحديث العدد عند أي تغيير
          const { count } = await supabase
            .from('search_history')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);
          
          setTotalCount(count || 0);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [initialCount, user]);

  if (setSearchTerm && setSymbolFilter && setTimeframeFilter && setDirectionFilter) {
    const uniqueSymbols = [...new Set(history.map(item => item.symbol))];
    const uniqueTimeframes = [...new Set(history.map(item => item.timeframe))];
    const directions = ["صاعد", "هابط", "محايد"];

    return (
      <div className="space-y-4 p-6">
        <DialogHeader className="pb-0">
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            سجل البحث
            <Badge variant="secondary" className="text-base font-bold">
              {totalCount} تحليل
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <Input
              placeholder="بحث..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full"
            />
          </div>
          
          <div>
            <Select value={symbolFilter || ""} onValueChange={(value) => setSymbolFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="الرمز" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الرموز</SelectItem>
                {uniqueSymbols.map(symbol => (
                  <SelectItem key={symbol} value={symbol}>{symbol}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={timeframeFilter || ""} onValueChange={(value) => setTimeframeFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="الإطار الزمني" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الأطر الزمنية</SelectItem>
                {uniqueTimeframes.map(timeframe => (
                  <SelectItem key={timeframe} value={timeframe}>{timeframe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Select value={directionFilter || ""} onValueChange={(value) => setDirectionFilter(value || null)}>
              <SelectTrigger>
                <SelectValue placeholder="الاتجاه" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">جميع الاتجاهات</SelectItem>
                {directions.map(direction => (
                  <SelectItem key={direction} value={direction}>{direction}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    );
  }

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
