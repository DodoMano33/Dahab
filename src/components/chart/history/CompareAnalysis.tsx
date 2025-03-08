
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { SearchHistoryItem } from "@/types/analysis";
import { DirectionIndicator } from "./DirectionIndicator";

interface CompareAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchHistoryItem[];
}

export const CompareAnalysis = ({ isOpen, onClose, items }: CompareAnalysisProps) => {
  const [sortedItems, setSortedItems] = useState<SearchHistoryItem[]>([]);

  useEffect(() => {
    if (items.length) {
      // Sort items by date (newest first)
      const sorted = [...items].sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      });
      setSortedItems(sorted);
    }
  }, [items]);

  // If dialog is not open, don't render anything
  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Compare Analysis Results</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {sortedItems.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <CardContent className="p-4">
                <div className="text-sm font-bold">{item.symbol}</div>
                <div className="text-xs text-gray-500">
                  {new Date(item.date).toLocaleString()}
                </div>
                
                <div className="mt-3 grid grid-cols-2 gap-y-2 text-xs">
                  <div className="font-semibold">Direction:</div>
                  <div className="flex items-center">
                    <DirectionIndicator direction={item.analysis.direction} />
                    <span className="ml-1">{item.analysis.direction}</span>
                  </div>
                  
                  <div className="font-semibold">Price:</div>
                  <div>${item.currentPrice.toFixed(2)}</div>
                  
                  <div className="font-semibold">Support:</div>
                  <div>${item.analysis.support.toFixed(2)}</div>
                  
                  <div className="font-semibold">Resistance:</div>
                  <div>${item.analysis.resistance.toFixed(2)}</div>
                  
                  <div className="font-semibold">Stop Loss:</div>
                  <div>${item.analysis.stopLoss.toFixed(2)}</div>
                  
                  <div className="font-semibold">Analysis Type:</div>
                  <div>{item.analysisType}</div>
                  
                  <div className="font-semibold">Pattern:</div>
                  <div>{item.analysis.pattern}</div>
                </div>
                
                {item.analysis.targets && item.analysis.targets.length > 0 && (
                  <div className="mt-3">
                    <div className="text-xs font-semibold">Targets:</div>
                    <div className="mt-1 space-y-1">
                      {item.analysis.targets.map((target, idx) => (
                        <div key={idx} className="text-xs flex justify-between">
                          <span>Target {idx + 1}:</span>
                          <span className="font-medium">${target.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};
