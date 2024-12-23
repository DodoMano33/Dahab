import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody } from "@/components/ui/table";
import { AnalysisData } from "@/types/analysis";
import { useEffect, useState } from "react";
import { getCurrentPriceFromTradingView } from "@/utils/tradingViewUtils";
import { HistoryTableHeader } from "./history/HistoryTableHeader";
import { HistoryRow } from "./history/HistoryRow";

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
        if (!priceStates[item.symbol]?.isActive && item.symbol && item.symbol !== 'غير محدد') {
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
      const interval = setInterval(updatePrices, 5000);
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
            <HistoryTableHeader />
            <TableBody>
              {history
                .filter(item => item.symbol && item.symbol !== 'غير محدد')
                .map((item, index) => (
                  <HistoryRow
                    key={index}
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