
import { useMarketStatus } from "@/hooks/useMarketStatus";
import { Badge } from "@/components/ui/badge";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";

interface MarketStatusCellProps {
  itemId?: string; // Add itemId prop
}

export const MarketStatusCell = ({ itemId }: MarketStatusCellProps) => {
  const { isOpen, isWeekend, nextOpeningTime } = useMarketStatus();

  const formatNextOpeningTime = () => {
    if (!nextOpeningTime) return null;
    
    return new Intl.DateTimeFormat('ar', {
      weekday: 'long',
      hour: '2-digit',
      minute: '2-digit'
    }).format(nextOpeningTime);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Badge 
              className="text-xs" 
              variant={isOpen ? "default" : "destructive"}
            >
              {isOpen ? "مفتوح" : "مغلق"}
            </Badge>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-white dark:bg-slate-900 p-2 text-sm">
          {isWeekend ? (
            <div>
              <p>السوق مغلقة خلال عطلة نهاية الأسبوع (السبت والأحد)</p>
              {nextOpeningTime && (
                <p className="mt-1">سيتم إعادة فتح السوق: {formatNextOpeningTime()}</p>
              )}
            </div>
          ) : (
            <p>
              {isOpen 
                ? "السوق مفتوحة الآن" 
                : "السوق مغلقة حالياً"}
            </p>
          )}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
