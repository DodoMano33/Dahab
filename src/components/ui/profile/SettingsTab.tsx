
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
    priceUpdateInterval: number;
    apiKey: string;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

const intervalOptions = [
  { value: "10", label: "10 ثواني" },
  { value: "20", label: "20 ثانية" },
  { value: "30", label: "30 ثانية" },
  { value: "60", label: "1 دقيقة" },
  { value: "180", label: "3 دقائق" },
  { value: "300", label: "5 دقائق" },
  { value: "900", label: "15 دقيقة" },
  { value: "1800", label: "30 دقيقة" },
  { value: "3600", label: "60 دقيقة" },
];

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  const [apiKey, setApiKey] = useState(userProfile.apiKey || "");

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
          
          // جدولة الفحص باستخدام الفاصل الزمني المحدد من المستخدم
          const intervalId = setInterval(checkFunction, userProfile.autoCheckInterval * 1000);
          
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

  // تحديث ApiKey في userProfile عند تغييره
  useEffect(() => {
    // تحديث userProfile فقط عندما يكون هناك تغيير فعلي في القيمة
    if (apiKey !== userProfile.apiKey) {
      setUserProfile({ ...userProfile, apiKey });
      
      // إرسال حدث تحديث مفتاح API
      window.dispatchEvent(new CustomEvent('user-settings-updated', {
        detail: {
          apiKey
        }
      }));
      
      toast.success("تم تحديث مفتاح API بنجاح");
    }
  }, [apiKey]);

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="apiKey">مفتاح Alpha Vantage API</Label>
        <div className="grid grid-cols-1 gap-2">
          <Textarea
            id="apiKey"
            placeholder="أدخل مفتاح API الخاص بك"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="h-20 text-sm font-mono"
          />
          <p className="text-xs text-muted-foreground">
            يمكنك الحصول على مفتاح مجاني من{" "}
            <a 
              href="https://www.alphavantage.co/support/#api-key" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline text-primary hover:text-primary/90"
            >
              موقع Alpha Vantage
            </a>
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label>فاصل تحديث السعر</Label>
        <Select
          value={userProfile.priceUpdateInterval.toString()}
          onValueChange={(value) => {
            setUserProfile({ ...userProfile, priceUpdateInterval: parseInt(value) });
            toast.success(`تم تحديث فاصل تحديث السعر إلى ${intervalOptions.find(opt => opt.value === value)?.label}`);
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر فاصل التحديث" />
          </SelectTrigger>
          <SelectContent>
            {intervalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          ملاحظة: يتم تحديث السعر الآن كل {intervalOptions.find(opt => opt.value === userProfile.priceUpdateInterval.toString())?.label || `${userProfile.priceUpdateInterval} ثانية`}
        </p>
      </div>
      
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
            فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية
          </p>
        </div>
        <Switch
          checked={userProfile.autoCheckEnabled}
          onCheckedChange={(checked) => {
            setUserProfile({ ...userProfile, autoCheckEnabled: checked });
            if (checked) {
              toast.success(`تم تفعيل الفحص التلقائي كل ${intervalOptions.find(opt => opt.value === userProfile.autoCheckInterval.toString())?.label || `${userProfile.autoCheckInterval} ثانية`}`);
            } else {
              toast.info("تم إيقاف الفحص التلقائي");
            }
          }}
        />
      </div>
      
      <div className="space-y-2">
        <Label>فاصل الفحص التلقائي</Label>
        <Select
          value={userProfile.autoCheckInterval.toString()}
          onValueChange={(value) => {
            setUserProfile({ ...userProfile, autoCheckInterval: parseInt(value) });
            if (userProfile.autoCheckEnabled) {
              toast.success(`تم تحديث فاصل الفحص التلقائي إلى ${intervalOptions.find(opt => opt.value === value)?.label}`);
            }
          }}
          disabled={!userProfile.autoCheckEnabled}
        >
          <SelectTrigger>
            <SelectValue placeholder="اختر فاصل الفحص" />
          </SelectTrigger>
          <SelectContent>
            {intervalOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <div className="space-y-2 pt-4">
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
