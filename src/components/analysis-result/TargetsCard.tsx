
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Target {
  price: number;
  expectedTime: Date;
}

interface TargetsCardProps {
  targets: Target[];
  currentPrice: number;
}

export const TargetsCard = ({ targets, currentPrice }: TargetsCardProps) => {
  const isPriceHigher = (price: number) => price > currentPrice;
  
  const getPercentageDiff = (price: number) => {
    const diff = ((price - currentPrice) / currentPrice) * 100;
    return diff.toFixed(2) + '%';
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">الأهداف المتوقعة</CardTitle>
      </CardHeader>
      <CardContent className="py-2 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {targets.map((target, index) => (
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
  );
};
