
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface AnalysisResultProps {
  analysis: {
    pattern: string;
    direction: string;
    currentPrice: number;
    support: number;
    resistance: number;
    stopLoss: number;
    bestEntryPoint?: {
      price: number;
      reason: string;
    };
    targets?: {
      price: number;
      expectedTime: Date;
    }[];
    fibonacciLevels?: {
      level: number;
      price: number;
    }[];
  };
  isLoading: boolean;
}

export const AnalysisResult = ({ analysis, isLoading }: AnalysisResultProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }

  const isPriceHigher = (price: number) => price > analysis.currentPrice;
  const getDirectionColor = (direction: string) => 
    direction === "صاعد" ? "text-green-600" : "text-red-600";
  
  const getPercentageDiff = (price: number) => {
    const diff = ((price - analysis.currentPrice) / analysis.currentPrice) * 100;
    return diff.toFixed(2) + '%';
  };

  return (
    <div className="space-y-6 text-right">
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Card className="flex-1 glass-card">
          <CardHeader className="py-4">
            <CardTitle className="text-xl flex items-center justify-between">
              <span>النموذج المكتشف</span>
              <Badge variant="outline" className={cn(
                getDirectionColor(analysis.direction)
              )}>
                {analysis.direction}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-xl font-medium">{analysis.pattern}</p>
          </CardContent>
        </Card>
        
        <Card className="flex-1 glass-card">
          <CardHeader className="py-4">
            <CardTitle className="text-xl">السعر الحالي</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className="text-2xl font-bold">{analysis.currentPrice}</p>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">مستوى الدعم</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className={cn(
              "text-xl font-medium",
              isPriceHigher(analysis.support) ? "text-red-600" : "text-green-600"
            )}>
              {analysis.support}
              <span className="text-xs block mt-1">
                {getPercentageDiff(analysis.support)}
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">نقطة وقف الخسارة</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className={cn(
              "text-xl font-medium",
              isPriceHigher(analysis.stopLoss) ? "text-red-600" : "text-green-600"
            )}>
              {analysis.stopLoss}
              <span className="text-xs block mt-1">
                {getPercentageDiff(analysis.stopLoss)}
              </span>
            </p>
          </CardContent>
        </Card>
        
        <Card className="glass-card">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">مستوى المقاومة</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className={cn(
              "text-xl font-medium",
              isPriceHigher(analysis.resistance) ? "text-red-600" : "text-green-600"
            )}>
              {analysis.resistance}
              <span className="text-xs block mt-1">
                {getPercentageDiff(analysis.resistance)}
              </span>
            </p>
          </CardContent>
        </Card>
      </div>
      
      {analysis.bestEntryPoint && (
        <Card className="glass-card animate-fade-in">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">أفضل نقطة دخول</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <p className={cn(
              "text-xl font-medium mb-2",
              isPriceHigher(analysis.bestEntryPoint.price) ? "text-red-600" : "text-green-600"
            )}>
              {analysis.bestEntryPoint.price}
              <span className="text-xs block mt-1">
                {getPercentageDiff(analysis.bestEntryPoint.price)}
              </span>
            </p>
            <p className="text-sm text-muted-foreground border-t pt-2 mt-2">
              {analysis.bestEntryPoint.reason}
            </p>
          </CardContent>
        </Card>
      )}
      
      {analysis.targets && analysis.targets.length > 0 && (
        <Card className="glass-card animate-fade-in">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">الأهداف المتوقعة</CardTitle>
          </CardHeader>
          <CardContent className="py-2 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.targets.map((target, index) => (
                <div key={index} className="bg-card/50 p-4 rounded-lg border">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">الهدف {index + 1}</span>
                    <Badge variant={isPriceHigher(target.price) ? "destructive" : "success"}>
                      {getPercentageDiff(target.price)}
                    </Badge>
                  </div>
                  <p className={cn(
                    "text-xl font-medium mb-2",
                    isPriceHigher(target.price) ? "text-red-600" : "text-green-600"
                  )}>
                    {target.price}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    التوقيت المتوقع: {format(target.expectedTime, 'PPpp', { locale: ar })}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {analysis.fibonacciLevels && analysis.fibonacciLevels.length > 0 && (
        <Card className="glass-card animate-fade-in">
          <CardHeader className="py-4">
            <CardTitle className="text-lg">مستويات فيبوناتشي</CardTitle>
          </CardHeader>
          <CardContent className="py-2">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {analysis.fibonacciLevels.map((level, index) => (
                <div key={index} className="bg-card/50 p-3 rounded-lg border text-center">
                  <p className="text-xs text-muted-foreground mb-1">
                    {(level.level * 100).toFixed(1)}%
                  </p>
                  <p className={cn(
                    "text-lg font-medium",
                    isPriceHigher(level.price) ? "text-red-600" : "text-green-600"
                  )}>
                    {level.price}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
