import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState } from "react";
import { getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";
import { HistoryTableHeader } from "./history/HistoryTableHeader";
import { HistoryRow } from "./history/HistoryRow";
import { toast } from "sonner";

interface SearchHistoryProps {
  isOpen: boolean;
  onClose: () => void;
  history: Array<{
    date: Date;
    symbol: string;
    currentPrice: number;
    analysis: AnalysisData;
    targetHit?: boolean;
    stopLossHit?: boolean;
  }>;
}

export const SearchHistory = ({ isOpen, onClose, history }: SearchHistoryProps) => {
  const [priceStates, setPriceStates] = useState<{ [key: string]: { currentPrice: number; isActive: boolean; lastUpdated: Date } }>({});

  const updatePrice = async (symbol: string) => {
    try {
      console.log(`جاري تحديث السعر للعملة ${symbol}`);
      const price = await getCurrentPriceFromTradingView(symbol);
      
      if (typeof price !== 'number' || isNaN(price)) {
        console.error(`سعر غير صالح للعملة ${symbol}:`, price);
        return null;
      }
      
      console.log(`تم تحديث السعر للعملة ${symbol}:`, price);
      return price;
    } catch (error) {
      console.error(`خطأ في تحديث السعر للعملة ${symbol}:`, error);
      return null;
    }
  };

  const updateAllPrices = async () => {
    if (!isOpen || !history.length) return;
    
    console.log("تحديث الأسعار لسجل البحث:", history);
    
    const validHistory = history.filter(item => item?.symbol && typeof item.symbol === 'string');
    
    for (const item of validHistory) {
      const price = await updatePrice(item.symbol);
      
      if (price !== null) {
        setPriceStates(prev => ({
          ...prev,
          [item.symbol]: {
            currentPrice: price,
            isActive: true,
            lastUpdated: new Date()
          }
        }));

        // التحقق من وصول السعر إلى وقف الخسارة أو الهدف
        if (price <= item.analysis.stopLoss) {
          console.log(`تم الوصول لنقطة وقف الخسارة للعملة ${item.symbol}`);
          toast.warning(`${item.symbol} وصل إلى وقف الخسارة`);
        } else if (
          item.analysis.targets && 
          item.analysis.targets[0] && 
          price >= item.analysis.targets[0].price
        ) {
          console.log(`تم الوصول للهدف للعملة ${item.symbol}`);
          toast.success(`${item.symbol} وصل إلى الهدف الأول`);
        }
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      updateAllPrices();
      const interval = setInterval(updateAllPrices, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen, history]);

  // تصفية السجل للتأكد من وجود رموز صحيحة فقط
  const validHistory = history.filter(item => 
    item && 
    item.symbol && 
    typeof item.symbol === 'string' && 
    item.currentPrice && 
    item.analysis
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>سجل البحث</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <HistoryTableHeader />
            <TableBody>
              {validHistory.map((item, index) => (
                <HistoryRow
                  key={`${item.symbol}-${index}-${item.date.getTime()}`}
                  date={item.date}
                  symbol={item.symbol}
                  currentPrice={item.currentPrice}
                  analysis={item.analysis}
                  latestPrice={priceStates[item.symbol]?.currentPrice}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};