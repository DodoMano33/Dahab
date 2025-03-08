
import { TableCell } from "@/components/ui/table";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMarketStatus } from "../hooks/useMarketStatus";

interface MarketStatusCellProps {
  itemId: string;
}

export const MarketStatusCell = ({ itemId }: MarketStatusCellProps) => {
  const { marketStatus, isLoading } = useMarketStatus(itemId);

  return (
    <TableCell className="w-16 p-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={`px-1.5 py-0.5 rounded-full text-[10px] inline-flex items-center justify-center w-14 
              ${isLoading ? 'bg-gray-100 text-gray-800' : marketStatus.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
              {isLoading ? 'جارٍ' : marketStatus.isOpen ? 'مفتوح' : 'مغلق'}
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isLoading ? 'جارٍ التحقق من حالة السوق...' : marketStatus.isOpen ? 'السوق مفتوح حالياً' : 'السوق مغلق حالياً'}</p>
            {marketStatus.serverTime && <p className="text-xs mt-1">وقت الخادم: {marketStatus.serverTime}</p>}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
  );
};
