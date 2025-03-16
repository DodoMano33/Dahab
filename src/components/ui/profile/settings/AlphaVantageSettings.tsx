
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { setAlphaVantageKey } from "@/utils/price/api";
import { goldPriceUpdater } from "@/utils/price/priceUpdater";

export function AlphaVantageSettings() {
  const [alphaVantageKey, setAlphaVantageApiKey] = useState<string>("");
  const [useAlphaVantage, setUseAlphaVantage] = useState<boolean>(true);
  
  // تحميل حالة Alpha Vantage وقت تهيئة المكون
  useEffect(() => {
    // تحميل مفتاح API المخزن
    const storedKey = localStorage.getItem('alpha_vantage_api_key') || "";
    setAlphaVantageApiKey(storedKey);
    
    // تحميل حالة تفعيل Alpha Vantage
    const storedEnabledState = localStorage.getItem('alpha_vantage_enabled');
    const isEnabled = storedEnabledState === 'false' ? false : true;
    setUseAlphaVantage(isEnabled);
    
    if (goldPriceUpdater) {
      goldPriceUpdater.setUseAlphaVantage(isEnabled);
    }
  }, []);
  
  // تحديث حالة Alpha Vantage
  const handleAlphaVantageToggle = (enabled: boolean) => {
    setUseAlphaVantage(enabled);
    if (goldPriceUpdater) {
      goldPriceUpdater.setUseAlphaVantage(enabled);
      // لا نحتاج لعرض toast هنا - سنعرضها بعد حفظ التغييرات
    }
  };
  
  // حفظ مفتاح API
  const handleSaveApiKey = () => {
    if (alphaVantageKey) {
      if (setAlphaVantageKey(alphaVantageKey)) {
        toast.success("تم حفظ مفتاح Alpha Vantage API بنجاح");
      }
    } else {
      setAlphaVantageKey(null);
      toast.info("تم مسح مفتاح Alpha Vantage API وسيتم استخدام المفتاح الافتراضي");
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
      
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <Label htmlFor="alphaVantageToggle">استخدام Alpha Vantage API</Label>
          <p className="text-sm text-muted-foreground">
            الحصول على سعر الذهب المباشر من Alpha Vantage
          </p>
        </div>
        <Switch
          id="alphaVantageToggle"
          checked={useAlphaVantage}
          onCheckedChange={handleAlphaVantageToggle}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="alphaVantageKey">مفتاح Alpha Vantage API</Label>
        <div className="flex gap-2">
          <Input
            id="alphaVantageKey"
            value={alphaVantageKey}
            onChange={(e) => setAlphaVantageApiKey(e.target.value)}
            placeholder="أدخل مفتاح API الخاص بك"
            className="flex-grow"
            dir="ltr"
          />
          <Button onClick={handleSaveApiKey} type="button" variant="secondary">
            حفظ
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          مفتاح API ضروري للحصول على أسعار الذهب المباشرة. يمكنك الحصول على مفتاح مجاني من موقع Alpha Vantage
        </p>
      </div>
    </div>
  );
}
