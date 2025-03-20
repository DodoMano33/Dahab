
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FibonacciLevel {
  level: number;
  price: number;
}

interface FibonacciLevelsCardProps {
  levels: FibonacciLevel[];
  currentPrice: number;
}

export const FibonacciLevelsCard = ({ levels, currentPrice }: FibonacciLevelsCardProps) => {
  const isPriceHigher = (price: number) => price > currentPrice;

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">مستويات فيبوناتشي</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {levels.map((level, index) => (
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
  );
};
