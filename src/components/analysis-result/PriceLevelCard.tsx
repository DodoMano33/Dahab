
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PriceLevelCardProps {
  title: string;
  value: number;
  currentPrice: number;
}

export const PriceLevelCard = ({ title, value, currentPrice }: PriceLevelCardProps) => {
  const isPriceHigher = (price: number) => price > currentPrice;
  
  const getPercentageDiff = (price: number) => {
    const diff = ((price - currentPrice) / currentPrice) * 100;
    return diff.toFixed(2) + '%';
  };

  return (
    <Card className="glass-card">
      <CardHeader className="py-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className={cn(
          "text-xl font-medium",
          isPriceHigher(value) ? "text-red-600" : "text-green-600"
        )}>
          {value}
          <span className="text-xs block mt-1">
            {getPercentageDiff(value)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};
