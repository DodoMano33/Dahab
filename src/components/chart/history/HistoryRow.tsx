
import { TableCell, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { DateCell } from "./cells/DateCell";
import { TimeframeCell } from "./cells/TimeframeCell";
import { AnalysisTypeCell } from "./cells/AnalysisTypeCell";
import { DirectionIndicator } from "./DirectionIndicator";
import { StopLoss } from "./StopLoss";
import { TargetsList } from "./TargetsList";
import { BestEntryPoint } from "./BestEntryPoint";
import { ExpiryTimer } from "./ExpiryTimer";
import { AnalysisData } from "@/types/analysis";
import { format, formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface HistoryRowProps {
  id: string;
  date: Date;
  symbol: string;
  currentPrice: number;
  analysis: AnalysisData;
  analysisType: string;
  timeframe: string;
  isSelected?: boolean;
  onSelect?: () => void;
  analysis_duration_hours?: number;
  last_checked_price?: number;
  last_checked_at?: Date | string | null;
}

export const HistoryRow = ({
  id,
  date,
  symbol,
  currentPrice,
  analysis,
  analysisType,
  timeframe,
  isSelected,
  onSelect,
  analysis_duration_hours,
  last_checked_price,
  last_checked_at,
}: HistoryRowProps) => {
  const [marketStatus, setMarketStatus] = useState<{isOpen: boolean, serverTime?: string}>({ isOpen: false });
  const [formattedTime, setFormattedTime] = useState<string>("");
  
  // طباعة نوع التحليل للتشخيص
  console.log(`HistoryRow for ${id}: analysisType=${analysisType}, pattern=${analysis.pattern}, activation_type=${analysis.activation_type}`);
  
  // تشخيص وقت آخر فحص
  console.log(`Last checked at for ${id}:`, last_checked_at, typeof last_checked_at);
  
  // Use the pattern from the analysis data to display the real analysis type
  // This helps when the database type is mapped but we want to show the original
  const displayAnalysisType = analysis.pattern === "فيبوناتشي ريتريسمينت وإكستينشين" 
    ? "فيبوناتشي" 
    : analysis.pattern === "تحليل فيبوناتشي متقدم" 
      ? "تحليل فيبوناتشي متقدم" 
      : analysisType;
  
  // تحديث حالة السوق كل 5 دقائق
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error("Error checking market status:", error);
          return;
        }
        setMarketStatus(data);
      } catch (err) {
        console.error("Failed to check market status:", err);
      }
    };
    
    checkMarketStatus();
    
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // تحويل last_checked_at إلى كائن Date والتأكد من صحته
  useEffect(() => {
    const updateLastCheckedFormat = () => {
      if (!last_checked_at) {
        setFormattedTime("");
        return;
      }
      
      try {
        let dateToFormat: Date | null = null;
        
        // تحويل التاريخ حسب نوعه
        if (typeof last_checked_at === 'string') {
          dateToFormat = new Date(last_checked_at);
          console.log(`[${id}] Converted string date:`, dateToFormat);
        } else if (last_checked_at instanceof Date) {
          dateToFormat = last_checked_at;
          console.log(`[${id}] Using Date object directly:`, dateToFormat);
        } else {
          console.error(`[${id}] Unsupported date type:`, typeof last_checked_at);
          setFormattedTime("");
          return;
        }
        
        // التحقق من صحة التاريخ
        if (dateToFormat && !isNaN(dateToFormat.getTime())) {
          const formatted = formatDistanceToNow(dateToFormat, { 
            addSuffix: true,
            locale: ar
          });
          console.log(`[${id}] Formatted time:`, formatted);
          setFormattedTime(formatted);
        } else {
          console.error(`[${id}] Invalid date for formatting:`, last_checked_at);
          setFormattedTime("");
        }
      } catch (error) {
        console.error(`[${id}] Error formatting date:`, error);
        setFormattedTime("");
      }
    };
    
    updateLastCheckedFormat();
    
    // تحديث التنسيق كل دقيقة
    const interval = setInterval(updateLastCheckedFormat, 60 * 1000);
    return () => clearInterval(interval);
  }, [last_checked_at, id]);
  
  // الاستماع لتحديثات البيانات في الوقت الحقيقي
  useEffect(() => {
    const handleHistoryUpdate = () => {
      console.log(`[${id}] History update detected, will refresh row data`);
      
      // تحديث البيانات للصف الحالي فقط
      const fetchUpdatedData = async () => {
        try {
          const { data, error } = await supabase
            .from('search_history')
            .select('last_checked_at, last_checked_price')
            .eq('id', id)
            .single();
          
          if (error) {
            console.error(`[${id}] Error fetching updated data:`, error);
            return;
          }
          
          if (data) {
            console.log(`[${id}] Received updated data:`, data);
            
            // تحديث البيانات المحلية - في حالة معالجة هذا على مستوى المكون الأب
            if (data.last_checked_at) {
              try {
                const newDate = new Date(data.last_checked_at);
                if (!isNaN(newDate.getTime())) {
                  const newFormattedTime = formatDistanceToNow(newDate, { 
                    addSuffix: true,
                    locale: ar
                  });
                  console.log(`[${id}] Updated formatted time:`, newFormattedTime);
                  setFormattedTime(newFormattedTime);
                }
              } catch (err) {
                console.error(`[${id}] Error formatting updated date:`, err);
              }
            }
          }
        } catch (err) {
          console.error(`[${id}] Error in fetchUpdatedData:`, err);
        }
      };
      
      fetchUpdatedData();
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, [id]);

  return (
    <TableRow className="text-xs">
      {onSelect && (
        <TableCell className="w-10 p-2">
          <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
          />
        </TableCell>
      )}
      <TableCell className="w-16 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className={`px-1.5 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center w-14 ${marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{marketStatus.isOpen ? 'السوق مفتوح حالياً' : 'السوق مغلق حالياً'}</p>
              {marketStatus.serverTime && <p className="text-xs mt-1">وقت الخادم: {marketStatus.serverTime}</p>}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </TableCell>
      <TableCell className="w-24 p-2">
        {last_checked_price && formattedTime ? (
          <div className="text-xs">
            <div>{last_checked_price}</div>
            <div className="text-muted-foreground text-[10px]">
              {formattedTime}
            </div>
          </div>
        ) : (
          <span className="text-muted-foreground text-[10px]">لم يتم الفحص</span>
        )}
      </TableCell>
      <TableCell className="w-20 p-2">
        <ExpiryTimer 
          createdAt={date} 
          analysisId={id} 
          durationHours={analysis_duration_hours}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        <BestEntryPoint 
          price={analysis.bestEntryPoint?.price}
          reason={analysis.bestEntryPoint?.reason}
        />
      </TableCell>
      <TableCell className="w-24 p-2">
        <TargetsList 
          targets={analysis.targets || []} 
          isTargetHit={false}
        />
      </TableCell>
      <TableCell className="w-20 p-2">
        <StopLoss 
          value={analysis.stopLoss} 
          isHit={false}
        />
      </TableCell>
      <TableCell className="w-16 p-2"><DirectionIndicator direction={analysis.direction} /></TableCell>
      <TableCell className="w-16 p-2 text-center">{currentPrice}</TableCell>
      <TableCell className="w-28 p-2">
        <AnalysisTypeCell 
          analysisType={displayAnalysisType} 
          pattern={analysis.pattern}
          activation_type={analysis.activation_type}
        />
      </TableCell>
      <TimeframeCell timeframe={timeframe} />
      <DateCell date={date} />
      <TableCell className="font-medium w-16 p-2">{symbol}</TableCell>
    </TableRow>
  );
};
