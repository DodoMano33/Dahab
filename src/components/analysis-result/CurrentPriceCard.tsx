
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CurrentPriceCardProps {
  currentPrice: number;
}

export const CurrentPriceCard = ({ currentPrice }: CurrentPriceCardProps) => {
  return (
    <Card className="flex-1 glass-card">
      <CardHeader className="py-4">
        <CardTitle className="text-xl">السعر الحالي</CardTitle>
      </CardHeader>
      <CardContent className="py-2">
        <p className="text-2xl font-bold">{currentPrice}</p>
      </CardContent>
    </Card>
  );
};
