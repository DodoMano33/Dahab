
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
    metalPriceApiKey?: string;
    priceUpdateInterval?: number;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  const [metalPriceApiKey, setMetalPriceApiKey] = useState(userProfile.metalPriceApiKey || '42ed2fe2e7d1d8f688ddeb027219c766');
  const [isSaving, setIsSaving] = useState(false);

  // تحديث المفتاح تلقائيًا عند تغييره
  useEffect(() => {
    const updateApiKey = async () => {
      if (metalPriceApiKey && metalPriceApiKey !== userProfile.metalPriceApiKey) {
        setIsSaving(true);
        try {
          const { data: userData } = await supabase.auth.getUser();
          if (userData?.user) {
            await supabase
              .from('profiles')
              .update({
                metal_price_api_key: metalPriceApiKey,
                updated_at: new Date().toISOString()
              })
              .eq('id', userData.user.id);
            
            setUserProfile({
              ...userProfile,
              metalPriceApiKey
            });
            
            toast.success("تم تحديث مفتاح API بنجاح");
          }
        } catch (error) {
          console.error("Error updating API key:", error);
          toast.error("حدث خطأ أثناء تحديث مفتاح API");
        } finally {
          setIsSaving(false);
        }
      }
    };
    
    updateApiKey();
  }, [metalPriceApiKey]);

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

  const timeIntervalOptions = [
    { value: 10000, label: "10 ثواني" },
    { value: 20000, label: "20 ثانية" },
    { value: 30000, label: "30 ثانية" },
    { value: 60000, label: "1 دقيقة" },
    { value: 180000, label: "3 دقائق" },
    { value: 300000, label: "5 دقائق" },
    { value: 900000, label: "15 دقيقة" },
    { value: 1800000, label: "30 دقيقة" },
    { value: 3600000, label: "60 دقيقة" }
  ];

  return (
    <div className="grid gap-4 py-4">
      <div className="space-y-2">
        <Label htmlFor="metalPriceApiKey">مفتاح Metal Price API</Label>
        <Input
          id="metalPriceApiKey"
          placeholder="أدخل مفتاح Metal Price API"
          value={metalPriceApiKey}
          onChange={(e) => setMetalPriceApiKey(e.target.value)}
          className="font-mono text-sm"
          disabled={isSaving}
        />
        <p className="text-xs text-muted-foreground">
          المفتاح الحالي: {isSaving ? "جاري الحفظ..." : (metalPriceApiKey ? metalPriceApiKey.substring(0, 8) + "..." : "غير محدد")}
        </p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="priceUpdateInterval">فترة تحديث السعر</Label>
        <Select
          value={String(userProfile.priceUpdateInterval || 300000)}
          onValueChange={(value) => setUserProfile({ 
            ...userProfile, 
            priceUpdateInterval: Number(value) 
          })}
        >
          <SelectTrigger id="priceUpdateInterval">
            <SelectValue placeholder="اختر فترة تحديث السعر" />
          </SelectTrigger>
          <SelectContent>
            {timeIntervalOptions.map((option) => (
              <SelectItem key={option.value} value={String(option.value)}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
              toast.success("تم تفعيل الفحص التلقائي");
            } else {
              toast.info("تم إيقاف الفحص التلقائي");
            }
          }}
        />
      </div>
      
      {userProfile.autoCheckEnabled && (
        <div className="space-y-2">
          <Label htmlFor="autoCheckInterval">فترة الفحص التلقائي</Label>
          <Select
            value={String(userProfile.autoCheckInterval || 300000)}
            onValueChange={(value) => setUserProfile({ 
              ...userProfile, 
              autoCheckInterval: Number(value) 
            })}
          >
            <SelectTrigger id="autoCheckInterval">
              <SelectValue placeholder="اختر فترة الفحص التلقائي" />
            </SelectTrigger>
            <SelectContent>
              {timeIntervalOptions.map((option) => (
                <SelectItem key={option.value} value={String(option.value)}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
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
