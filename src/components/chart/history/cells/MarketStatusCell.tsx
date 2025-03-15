
import { TableCell } from "@/components/ui/table";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { screenPriceReader } from "@/utils/price/screenReader";

interface MarketStatusCellProps {
  itemId: string;
}

export const MarketStatusCell = ({ itemId }: MarketStatusCellProps) => {
  const [marketStatus, setMarketStatus] = useState<{isOpen: boolean, serverTime?: string}>({ isOpen: false });
  
  // Check market status every 5 minutes
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status');
        if (error) {
          console.error(`[${itemId}] Error checking market status:`, error);
          return;
        }
        setMarketStatus(data);
        
        // تحديث حالة السوق في قارئ السعر من الشاشة
        console.log("تم تحديث حالة السوق:", data.isOpen ? "مفتوح" : "مغلق");
      } catch (err) {
        console.error(`[${itemId}] Failed to check market status:`, err);
      }
    };
    
    // استدعاء الدالة مباشرة عند التحميل
    checkMarketStatus();
    
    // تحديث حالة السوق كل 5 دقائق
    const interval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    
    // الاستماع لأحداث تحديث السعر للحصول على آخر حالة للسوق
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.isMarketOpen !== undefined) {
        setMarketStatus(prev => ({ ...prev, isOpen: event.detail.isMarketOpen }));
      }
    };
    
    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    };
  }, [itemId]);

  return (
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
  );
};
