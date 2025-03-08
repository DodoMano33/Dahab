import { useState } from "react";
import { SearchHistoryItem } from "@/types/analysis";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { DirectionIndicator } from "./DirectionIndicator";

interface CompareAnalysisProps {
  items: SearchHistoryItem[];
  onClose: () => void;
  isOpen: boolean;
}

export const CompareAnalysis = ({ items, onClose, isOpen }: CompareAnalysisProps) => {
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  
  if (!isOpen) return null;
  
  const toggleExpand = (id: string) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  if (items.length === 0) {
    return (
      <div className="text-center p-8">
        <p>لم يتم تحديد أي تحليلات للمقارنة</p>
        <Button onClick={onClose} className="mt-4">إغلاق</Button>
      </div>
    );
  }

  const findPriceAgreement = (items: SearchHistoryItem[]) => {
    const totalItems = items.length;
    if (totalItems <= 1) return { up: 0, down: 0, neutral: 0 };
    
    let upCount = 0;
    let downCount = 0;
    let neutralCount = 0;
    
    items.forEach(item => {
      if (item.analysis.direction === "Up") upCount++;
      else if (item.analysis.direction === "Down") downCount++;
      else neutralCount++;
    });
    
    return {
      up: Math.round((upCount / totalItems) * 100),
      down: Math.round((downCount / totalItems) * 100),
      neutral: Math.round((neutralCount / totalItems) * 100)
    };
  };
  
  const agreement = findPriceAgreement(items);
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">مقارنة {items.length} تحليلات</h3>
        <Button onClick={onClose} variant="outline" size="sm">إغلاق</Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-md">اتفاق الاتجاه</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DirectionIndicator direction="Up" />
                <span>صاعد</span>
              </div>
              <Badge variant="outline">{agreement.up}%</Badge>
            </div>
            <Progress value={agreement.up} className="h-2 bg-muted" />
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <DirectionIndicator direction="Down" />
                <span>هابط</span>
              </div>
              <Badge variant="outline">{agreement.down}%</Badge>
            </div>
            <Progress value={agreement.down} className="h-2 bg-muted" />
            
            <div className="flex items-center justify-between mt-2">
              <div className="flex items-center gap-2">
                <DirectionIndicator direction="Neutral" />
                <span>محايد</span>
              </div>
              <Badge variant="outline">{agreement.neutral}%</Badge>
            </div>
            <Progress value={agreement.neutral} className="h-2 bg-muted" />
          </div>
        </CardContent>
      </Card>

      <Separator />
      
      <div className="space-y-2">
        <h4 className="font-medium">تفاصيل التحليلات</h4>
        
        {items.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <CardHeader className="py-3 cursor-pointer" onClick={() => toggleExpand(item.id)}>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <DirectionIndicator direction={item.analysis.direction} />
                  <span>{item.symbol}</span>
                  <Badge variant="outline">{item.analysisType}</Badge>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant={expanded[item.id] ? "secondary" : "outline"}>
                        {expanded[item.id] ? "إخفاء" : "عرض"}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{expanded[item.id] ? "إخفاء التفاصيل" : "عرض التفاصيل"}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardHeader>
            
            {expanded[item.id] && (
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">السعر الحالي:</span>
                      <span>{item.currentPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">وقف الخسارة:</span>
                      <span>{item.analysis.stopLoss}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">الدعم:</span>
                      <span>{item.analysis.support}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">المقاومة:</span>
                      <span>{item.analysis.resistance}</span>
                    </div>
                  </div>
                  
                  {item.analysis.bestEntryPoint && (
                    <div className="pt-2">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">نقطة الدخول:</span>
                        <span>{item.analysis.bestEntryPoint.price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground pt-1">
                        {item.analysis.bestEntryPoint.reason}
                      </p>
                    </div>
                  )}
                  
                  {item.analysis.targets && item.analysis.targets.length > 0 && (
                    <div className="pt-2">
                      <span className="text-muted-foreground">الأهداف:</span>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {item.analysis.targets.map((target, idx) => (
                          <div key={idx} className="flex justify-between text-xs">
                            <span>الهدف {idx + 1}:</span>
                            <span>{target.price}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};
