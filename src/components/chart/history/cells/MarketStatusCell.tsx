
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
            <div className={`px-1.5 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center w-14 ${marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{marketStatus.isOpen ? 'السوق مفتوح حالياً (حسب حركة السعر)' : 'السوق مغلق حالياً (لا توجد حركة سعر)'}</p>
            <p className="text-xs mt-1">آخر تحديث: {lastUpdate}</p>
            {marketStatus.serverTime && <p className="text-xs mt-1">وقت الخادم: {marketStatus.serverTime}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
