
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { goldPriceUpdater } from "@/utils/price/priceUpdater";
import { setAlphaVantageKey } from "@/utils/price/api";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  // إضافة حالة لمفتاح Alpha Vantage API
  const [alphaVantageKey, setAlphaVantageApiKey] = useState<string>("");
  const [useAlphaVantage, setUseAlphaVantage] = useState<boolean>(true);
  
  // تحميل حالة Alpha Vantage وقت تهيئة المكون
  useEffect(() => {
    // تحميل مفتاح API المخزن
    const storedKey = localStorage.getItem('alpha_vantage_api_key') || "";
    setAlphaVantageApiKey(storedKey);
    
    // تحميل حالة تفعيل Alpha Vantage
    if (goldPriceUpdater) {
      setUseAlphaVantage(goldPriceUpdater.getUseAlphaVantage());
    }
  }, []);
  
  // تحديث حالة Alpha Vantage
  const handleAlphaVantageToggle = (enabled: boolean) => {
    setUseAlphaVantage(enabled);
    if (goldPriceUpdater) {
      goldPriceUpdater.setUseAlphaVantage(enabled);
      toast.success(enabled 
        ? "تم تفعيل استخدام Alpha Vantage للحصول على أسعار الذهب" 
        : "تم تعطيل استخدام Alpha Vantage");
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

  // تفعيل أو تعطيل الفحص التلقائي
  useEffect(() => {
    const setupAutoCheck = async () => {
      try {
        if (userProfile.autoCheckEnabled) {
          // جدولة الفحص التلقائي
          console.log("Setting up auto-check with interval:", userProfile.autoCheckInterval);
          
          // استدعاء وظيفة الفحص التلقائي كل فترة
          const checkFunction = async () => {
            try {
              const { data, error } = await supabase.functions.invoke('auto-check-analyses');
              
              if (error) {
                console.error("Error invoking auto-check function:", error);
              } else if (data) {
                console.log("Auto-check completed:", data);
                // إطلاق حدث تحديث التاريخ مع timestamp
                if (data.timestamp) {
                  const event = new CustomEvent('historyUpdated', {
                    detail: { timestamp: data.timestamp }
                  });
                  window.dispatchEvent(event);
                }
              }
            } catch (err) {
              console.error("Error during auto-check:", err);
            }
          };
          
          // تنفيذ فحص أولي
          checkFunction();
          
          // جدولة الفحص كل 5 دقائق
          const intervalId = setInterval(checkFunction, 5 * 60 * 1000);
          
          return () => {
            clearInterval(intervalId);
          };
        }
      } catch (error) {
        console.error("Error setting up auto-check:", error);
      }
    };
    
    setupAutoCheck();
  }, [userProfile.autoCheckEnabled, userProfile.autoCheckInterval]);

  return (
    <div className="grid gap-4 py-4">
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الإشعارات</Label>
          <p className="text-sm text-muted-foreground">
            تلقي إشعارات عند تحقق الأهداف ووقف الخسارة
          </p>
        </div>
        <Switch
          checked={userProfile.notificationsEnabled}
          onCheckedChange={(checked) => setUserProfile({ ...userProfile, notificationsEnabled: checked })}
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label>الفحص التلقائي</Label>
          <p className="text-sm text-muted-foreground">
            فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية كل 5 دقائق
          </p>
        </div>
        <Switch
          checked={userProfile.autoCheckEnabled}
          onCheckedChange={(checked) => {
            setUserProfile({ ...userProfile, autoCheckEnabled: checked });
            if (checked) {
              toast.success("تم تفعيل الفحص التلقائي كل 5 دقائق");
            } else {
              toast.info("تم إيقاف الفحص التلقائي");
            }
          }}
        />
      </div>
      
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
      
      <div className="space-y-2 pt-4 border-t mt-2">
        <Button
          variant="outline"
          onClick={resetOnboarding}
          className="w-full"
        >
          إعادة تشغيل جولة التعريف
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
        >
          مسح سجل التحليلات
        </Button>
      </div>
    </div>
  );
}
