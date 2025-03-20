
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LivePriceTestButton } from "../LivePriceTestButton";
import { useCurrentPrice } from "@/hooks/current-price";

export const LivePriceTestCard = () => {
  const { currentPrice, priceUpdateCount } = useCurrentPrice();

  return (
    <Card>
      <CardHeader>
        <CardTitle>اختبار السعر المباشر</CardTitle>
        <CardDescription>
          تحقق من قدرة التطبيق على جلب أسعار المعادن الثمينة المباشرة من Metal Price API
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-2">السعر الحالي:</p>
            <p className="text-2xl font-bold">
              {currentPrice ? currentPrice.toFixed(2) : "لم يتم جلب السعر بعد"}
            </p>
            {priceUpdateCount > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                تم تحديث السعر {priceUpdateCount} مرة
              </p>
            )}
          </div>
          
          <div className="pt-2">
            <LivePriceTestButton />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
