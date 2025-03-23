
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PatternCardProps {
  pattern: string;
  direction: string;
}

export const PatternCard = ({ pattern, direction }: PatternCardProps) => {
  const getDirectionColor = (direction: string) => {
    switch (direction) {
      case "صاعد":
        return "text-green-600 bg-green-100 dark:bg-green-950 dark:text-green-400";
      case "هابط":
        return "text-red-600 bg-red-100 dark:bg-red-950 dark:text-red-400";
      default:
        return "text-neutral-600 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400";
    }
  };

  const getPatternInfo = (pattern: string) => {
    const patternMap: Record<string, { description: string, reliability: number }> = {
      "دوجي (Doji)": {
        description: "تشير إلى تردد السوق وتعادل قوى البيع والشراء",
        reliability: 6
      },
      "مطرقة (Hammer)": {
        description: "نمط انعكاسي صعودي يظهر عادة في نهاية الاتجاه الهابط",
        reliability: 7
      },
      "ابتلاع صاعد (Bullish Engulfing)": {
        description: "نمط انعكاسي صعودي قوي يشير إلى تغير المعنويات",
        reliability: 8
      },
      "ابتلاع هابط (Bearish Engulfing)": {
        description: "نمط انعكاسي هبوطي قوي يشير إلى انتهاء الاتجاه الصاعد",
        reliability: 8
      },
      "حرامي صاعد (Bullish Harami)": {
        description: "نمط انعكاسي صعودي معتدل يظهر بعد اتجاه هابط",
        reliability: 6
      },
      "حرامي هابط (Bearish Harami)": {
        description: "نمط انعكاسي هبوطي معتدل يظهر بعد اتجاه صاعد",
        reliability: 6
      },
      "مطرقة مقلوبة (Inverted Hammer)": {
        description: "نمط انعكاسي صعودي يظهر في نهاية الاتجاه الهابط",
        reliability: 6
      },
      "نجمة الصباح (Morning Star)": {
        description: "نمط انعكاسي صعودي يتكون من ثلاث شموع",
        reliability: 8
      },
      "نجمة المساء (Evening Star)": {
        description: "نمط انعكاسي هبوطي يتكون من ثلاث شموع",
        reliability: 8
      },
      "نجمة طائرة (Shooting Star)": {
        description: "نمط انعكاسي هبوطي يظهر في نهاية الاتجاه الصاعد",
        reliability: 7
      },
    };

    // Extract pattern name from the pattern string (which could contain both Arabic and English versions)
    const patternName = Object.keys(patternMap).find(key => pattern.includes(key)) || pattern;
    
    return patternMap[patternName] || {
      description: "نمط سعري يستخدم في التحليل الفني",
      reliability: 5
    };
  };

  const patternInfo = getPatternInfo(pattern);
  
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 8) return "text-green-600";
    if (reliability >= 6) return "text-amber-600";
    return "text-neutral-600";
  };

  return (
    <Card className="flex-1 glass-card overflow-hidden border-t-4 transition-all hover:shadow-md dark:hover:shadow-lg dark:hover:shadow-primary/10" 
      style={{ borderTopColor: direction === "صاعد" ? "#22c55e" : direction === "هابط" ? "#ef4444" : "#6b7280" }}>
      <CardHeader className="py-4 bg-gray-50/50 dark:bg-gray-900/50">
        <CardTitle className="text-xl flex items-center justify-between">
          <span>النموذج المكتشف</span>
          <Badge variant="outline" className={cn(
            "px-3 py-1 rounded-full font-medium",
            getDirectionColor(direction)
          )}>
            {direction}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="py-4 space-y-3">
        <p className="text-xl font-medium">{pattern}</p>
        
        <div className="flex items-center justify-between mt-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <span>الموثوقية:</span>
            <span className={cn("font-semibold", getReliabilityColor(patternInfo.reliability))}>
              {patternInfo.reliability}/10
            </span>
          </div>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center cursor-help">
                  <Info size={16} className="text-muted-foreground mr-1" />
                  <span>معلومات</span>
                </div>
              </TooltipTrigger>
              <TooltipContent side="bottom" className="max-w-xs bg-white dark:bg-gray-900 p-3 rounded-lg shadow-lg">
                <p className="text-right">{patternInfo.description}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardContent>
    </Card>
  );
};
