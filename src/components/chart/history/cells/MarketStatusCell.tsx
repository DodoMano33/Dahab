
import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMarketStatus } from "../hooks/useMarketStatus";
import { useEffect, useState } from "react";

interface MarketStatusCellProps {
  itemId: string;
}

export const MarketStatusCell = ({ itemId }: MarketStatusCellProps) => {
  const marketStatus = useMarketStatus(itemId);
  const [lastUpdate, setLastUpdate] = useState<string>("الآن");

  // تحديث آخر وقت للتحديث
  useEffect(() => {
    setLastUpdate("الآن");
    
    const interval = setInterval(() => {
      setLastUpdate("منذ قليل");
    }, 30 * 1000); // بعد 30 ثانية
    
    return () => clearInterval(interval);
  }, [marketStatus.isOpen]);

  return (
    <TableCell className="w-16 p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`px-2 py-1.5 rounded-md text-xs inline-flex items-center justify-center w-16 font-medium ${
              marketStatus.isOpen 
                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' 
                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
            } transition-colors`}>
              {marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{marketStatus.isOpen ? 'السوق مفتوح حالياً (لوحظت حركة سعر خلال آخر 5 دقائق)' : 'السوق مغلق حالياً (لم تتغير الأسعار منذ أكثر من 5 دقائق)'}</p>
            <p className="text-xs mt-1">آخر تحديث: {lastUpdate}</p>
            {marketStatus.serverTime && <p className="text-xs mt-1">وقت الخادم: {marketStatus.serverTime}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
