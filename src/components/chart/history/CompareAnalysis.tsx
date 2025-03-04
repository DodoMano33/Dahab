
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SearchHistoryItem } from "@/types/analysis";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface CompareAnalysisProps {
  isOpen: boolean;
  onClose: () => void;
  items: SearchHistoryItem[];
}

export const CompareAnalysis = ({ isOpen, onClose, items }: CompareAnalysisProps) => {
  const [activeTab, setActiveTab] = useState("overview");
  
  if (items.length === 0) return null;
  
  const isPriceHigher = (price: number, currentPrice: number) => price > currentPrice;
  
  // تهيئة مصفوفة المقارنة
  const comparisonItems = items.slice(0, 2); // نأخذ أول عنصرين فقط للمقارنة
  
  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-[95vw] w-[1200px] h-[90vh] overflow-auto p-6" dir="rtl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">مقارنة التحليلات</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {comparisonItems.map((item, index) => (
            <Card key={index} className="overflow-hidden">
              <CardHeader className="bg-muted/30">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">
                    {item.symbol} - {item.timeframe}
                  </CardTitle>
                  <Badge>{item.analysisType}</Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(item.date, 'PPpp', { locale: ar })}
                </div>
              </CardHeader>
              
              <CardContent className="p-4 space-y-4 mt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">النمط</h4>
                    <p className="font-medium">{item.analysis.pattern}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">الاتجاه</h4>
                    <p className={cn(
                      "font-medium",
                      item.analysis.direction === "صاعد" ? "text-green-600" : "text-red-600"
                    )}>
                      {item.analysis.direction}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">السعر الحالي</h4>
                    <p className="font-bold">{item.currentPrice}</p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">وقف الخسارة</h4>
                    <p className={cn(
                      "font-medium",
                      isPriceHigher(item.analysis.stopLoss, item.currentPrice) ? "text-red-600" : "text-green-600"
                    )}>
                      {item.analysis.stopLoss}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">مستوى الدعم</h4>
                    <p className={cn(
                      "font-medium",
                      isPriceHigher(item.analysis.support, item.currentPrice) ? "text-red-600" : "text-green-600"
                    )}>
                      {item.analysis.support}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">مستوى المقاومة</h4>
                    <p className={cn(
                      "font-medium",
                      isPriceHigher(item.analysis.resistance, item.currentPrice) ? "text-red-600" : "text-green-600"
                    )}>
                      {item.analysis.resistance}
                    </p>
                  </div>
                </div>
                
                {item.analysis.bestEntryPoint && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-1">أفضل نقطة دخول</h4>
                    <p className={cn(
                      "font-medium",
                      isPriceHigher(item.analysis.bestEntryPoint.price, item.currentPrice) ? "text-red-600" : "text-green-600"
                    )}>
                      {item.analysis.bestEntryPoint.price}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">{item.analysis.bestEntryPoint.reason}</p>
                  </div>
                )}
                
                {item.analysis.targets && item.analysis.targets.length > 0 && (
                  <div className="border-t pt-4">
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">الأهداف</h4>
                    <div className="space-y-2">
                      {item.analysis.targets.map((target, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-muted/20 p-2 rounded">
                          <span className="text-sm">الهدف {idx + 1}</span>
                          <span className={cn(
                            "font-medium",
                            isPriceHigher(target.price, item.currentPrice) ? "text-red-600" : "text-green-600"
                          )}>
                            {target.price}
                          </span>
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
