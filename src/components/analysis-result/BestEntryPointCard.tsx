
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BestEntryPointCardProps {
  price: number;
  reason: string;
  currentPrice: number;
}

export const BestEntryPointCard = ({ price, reason, currentPrice }: BestEntryPointCardProps) => {
  const isPriceHigher = (price: number) => price > currentPrice;
  
  const getPercentageDiff = (price: number) => {
    const diff = ((price - currentPrice) / currentPrice) * 100;
    return diff.toFixed(2) + '%';
  };

  return (
    <Card className="glass-card animate-fade-in">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">أفضل نقطة دخول</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className={cn(
          "text-xl font-medium mb-2",
          isPriceHigher(price) ? "text-red-600" : "text-green-600"
        )}>
          {price}
          <span className="text-xs block mt-1">
            {getPercentageDiff(price)}
          </span>
        </p>
        <p className="text-sm text-muted-foreground border-t pt-2 mt-2">
          {reason}
        </p>
      </CardContent>
    </Card>
  );
};
