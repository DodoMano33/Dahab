import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { ArrowUp, ArrowDown } from "lucide-react";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState } from "react";
import { getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";

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
  const [priceStates, setPriceStates] = useState<{ [key: string]: { currentPrice: number; isActive: boolean } }>({});

  useEffect(() => {
    const updatePrices = async () => {
      for (const item of history) {
        if (!priceStates[item.symbol]?.isActive) {
          try {
            const price = await getCurrentPriceFromTradingView(item.symbol);
            console.log(`Updated price for ${item.symbol}:`, price);
            
            setPriceStates(prev => ({
              ...prev,
              [item.symbol]: {
                currentPrice: price,
                isActive: true
              }
            }));

            // Check if target or stop loss is hit
            if (price <= item.analysis.stopLoss && !item.stopLossHit) {
              console.log(`Stop loss hit for ${item.symbol}`);
              setPriceStates(prev => ({
                ...prev,
                [item.symbol]: {
                  ...prev[item.symbol],
                  isActive: false
                }
              }));
            } else if (
              item.analysis.targets && 
              item.analysis.targets[0] && 
              price >= item.analysis.targets[0].price && 
              !item.targetHit
            ) {
              console.log(`Target hit for ${item.symbol}`);
              setPriceStates(prev => ({
                ...prev,
                [item.symbol]: {
                  ...prev[item.symbol],
                  isActive: false
                }
              }));
            }
          } catch (error) {
            console.error(`Error updating price for ${item.symbol}:`, error);
          }
        }
      }
    };

    if (isOpen) {
      updatePrices();
      const interval = setInterval(updatePrices, 5000); // Update every 5 seconds
      return () => clearInterval(interval);
    }
  }, [isOpen, history, priceStates]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl" dir="rtl">
        <DialogHeader>
          <DialogTitle>سجل البحث</DialogTitle>
        </DialogHeader>
        <div className="max-h-[70vh] overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">التاريخ</TableHead>
                <TableHead className="text-right">الرمز</TableHead>
                <TableHead className="text-right">السعر الحالي</TableHead>
                <TableHead className="text-right">الاتجاه</TableHead>
                <TableHead className="text-right">أفضل نقطة دخول</TableHead>
                <TableHead className="text-right">الأهداف والتوقيت</TableHead>
                <TableHead className="text-right">وقف الخسارة</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((item, index) => {
                const currentPrice = priceStates[item.symbol]?.currentPrice;
                const isStopLossHit = currentPrice && currentPrice <= item.analysis.stopLoss;
                const isTargetHit = currentPrice && item.analysis.targets?.[0] && 
                                  currentPrice >= item.analysis.targets[0].price;

                return (
                  <TableRow key={index}>
                    <TableCell className="text-right">
                      {format(item.date, 'PPpp', { locale: ar })}
                    </TableCell>
                    <TableCell className="text-right">{item.symbol}</TableCell>
                    <TableCell className="text-right">{item.currentPrice}</TableCell>
                    <TableCell className="text-right">
                      {item.analysis.direction === "صاعد" ? (
                        <ArrowUp className="text-green-500 inline" />
                      ) : (
                        <ArrowDown className="text-red-500 inline" />
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {item.analysis.bestEntryPoint ? (
                        <div>
                          <div>السعر: {item.analysis.bestEntryPoint.price}</div>
                          <div className="text-sm text-gray-600">
                            السبب: {item.analysis.bestEntryPoint.reason}
                          </div>
                        </div>
                      ) : (
                        "غير متوفر"
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="space-y-2">
                        {item.analysis.targets?.map((target, idx) => (
                          <div 
                            key={idx}
                            className={`relative ${isTargetHit && idx === 0 ? 'pb-1' : ''}`}
                          >
                            الهدف {idx + 1}: {target.price}
                            <br />
                            التوقيت: {format(target.expectedTime, 'PPpp', { locale: ar })}
                            {isTargetHit && idx === 0 && (
                              <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-500" />
                            )}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className={`text-right relative ${isStopLossHit ? 'pb-1' : ''}`}>
                      {item.analysis.stopLoss}
                      {isStopLossHit && (
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-red-500" />
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </DialogContent>
    </Dialog>
  );
};