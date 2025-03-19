
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Alert } from "@/components/ui/alert";
import { AlertCircle, Check } from "lucide-react";
import { saveAlphaVantageApiKey, getAlphaVantageApiKey, fetchGoldPrice } from "@/services/alphaVantageService";

export function AlphaVantageSettings() {
  const [isAlphaVantageEnabled, setIsAlphaVantageEnabled] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastPrice, setLastPrice] = useState<number | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<string | null>(null);

  // استرداد API Key المخزن عند تحميل المكون
  useEffect(() => {
    const storedApiKey = getAlphaVantageApiKey() || "9Q0LHPLPMFGOFSFV";
    if (storedApiKey) {
      setApiKey(storedApiKey);
      setIsAlphaVantageEnabled(true);
    }
  }, []);

  // الاستماع لتحديثات سعر Alpha Vantage
  useEffect(() => {
    const handleAlphaVantageUpdate = (event: CustomEvent<{ price: number, timestamp: string }>) => {
      if (event.detail) {
        setLastPrice(event.detail.price);
        setLastUpdateTime(event.detail.timestamp);
      }
    };

    window.addEventListener('alpha-vantage-price-update', handleAlphaVantageUpdate as EventListener);
    return () => {
      window.removeEventListener('alpha-vantage-price-update', handleAlphaVantageUpdate as EventListener);
    };
  }, []);

  // جلب سعر الذهب من Alpha Vantage عند تفعيل الخدمة
  useEffect(() => {
    if (isAlphaVantageEnabled && apiKey) {
      const fetchInitialPrice = async () => {
        try {
          setIsLoading(true);
          const { price, timestamp } = await fetchGoldPrice();
          setLastPrice(price);
          setLastUpdateTime(timestamp);
          toast.success("تم الحصول على سعر الذهب بنجاح");
        } catch (error) {
          console.error("فشل في جلب سعر الذهب:", error);
          toast.error("فشل في جلب سعر الذهب. تحقق من مفتاح API الخاص بك.");
        } finally {
          setIsLoading(false);
        }
      };

      fetchInitialPrice();

      // جدولة جلب السعر كل 5 دقائق
      const intervalId = setInterval(fetchInitialPrice, 5 * 60 * 1000);
      return () => clearInterval(intervalId);
    }
  }, [isAlphaVantageEnabled, apiKey]);

  const handleSaveApiKey = () => {
    try {
      saveAlphaVantageApiKey(apiKey);
      toast.success("تم حفظ مفتاح API بنجاح");
      
      // محاولة جلب السعر باستخدام المفتاح الجديد
      if (isAlphaVantageEnabled) {
        setIsLoading(true);
        fetchGoldPrice()
          .then(({ price, timestamp }) => {
            setLastPrice(price);
            setLastUpdateTime(timestamp);
            toast.success("تم الحصول على سعر الذهب بنجاح");
          })
          .catch(error => {
            console.error("فشل في جلب سعر الذهب:", error);
            toast.error("فشل في جلب سعر الذهب. تحقق من مفتاح API الخاص بك.");
          })
          .finally(() => {
            setIsLoading(false);
          });
      }
    } catch (error) {
      toast.error("فشل في حفظ مفتاح API");
    }
  };

  const handleToggleAlphaVantage = (checked: boolean) => {
    setIsAlphaVantageEnabled(checked);
    if (checked && apiKey) {
      toast.success("تم تفعيل Alpha Vantage API");
    } else if (!checked) {
      toast.info("تم تعطيل Alpha Vantage API");
    }
  };

  const handleRefreshPrice = async () => {
    if (!isAlphaVantageEnabled || !apiKey) {
      toast.error("الرجاء تفعيل Alpha Vantage وإدخال مفتاح API");
      return;
    }

    try {
      setIsLoading(true);
      const { price, timestamp } = await fetchGoldPrice();
      setLastPrice(price);
      setLastUpdateTime(timestamp);
      toast.success("تم تحديث سعر الذهب بنجاح");
    } catch (error) {
      console.error("فشل في تحديث سعر الذهب:", error);
      toast.error("فشل في تحديث سعر الذهب");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="border-t pt-4 mt-2">
      <div className="space-y-1 mb-4">
        <h3 className="font-medium text-base">إعدادات أسعار الذهب</h3>
        <p className="text-sm text-muted-foreground">
          تكوين كيفية الحصول على أسعار الذهب المباشرة
        </p>
      </div>
      
      {lastPrice && (
        <div className="bg-emerald-50 text-emerald-800 p-4 rounded-md mb-4">
          <div className="flex items-start gap-2">
            <Check className="w-5 h-5 mt-0.5" />
            <div>
              <p className="font-medium">سعر الذهب الحالي</p>
              <p className="text-xl font-bold mt-1">{lastPrice.toFixed(2)} دولار</p>
              {lastUpdateTime && (
                <p className="text-xs mt-1">آخر تحديث: {lastUpdateTime}</p>
              )}
            </div>
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <Label htmlFor="alphaVantageToggle">استخدام Alpha Vantage API</Label>
          <p className="text-sm text-muted-foreground">
            الحصول على سعر الذهب المباشر من Alpha Vantage
          </p>
        </div>
        <Switch
          id="alphaVantageToggle"
          checked={isAlphaVantageEnabled}
          onCheckedChange={handleToggleAlphaVantage}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alphaVantageKey">مفتاح Alpha Vantage API</Label>
        <div className="flex gap-2">
          <Input
            id="alphaVantageKey"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="أدخل مفتاح API الخاص بك"
            className="flex-grow"
            dir="ltr"
            disabled={!isAlphaVantageEnabled}
          />
          <Button 
            disabled={!isAlphaVantageEnabled || isLoading} 
            type="button" 
            variant="secondary"
            onClick={handleSaveApiKey}
          >
            حفظ
          </Button>
        </div>
        <div className="flex justify-end mt-2">
          <Button
            onClick={handleRefreshPrice}
            disabled={!isAlphaVantageEnabled || isLoading}
            variant="outline"
            size="sm"
          >
            تحديث السعر الآن
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          يمكنك الحصول على مفتاح Alpha Vantage API مجانًا من موقعهم الرسمي.
        </p>
      </div>
    </div>
  );
}
