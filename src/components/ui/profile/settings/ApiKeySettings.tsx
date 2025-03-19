
import { useState, useEffect, useRef } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ApiKeySettingsProps {
  apiKey: string;
  setUserProfile: (profile: any) => void;
  userProfile: any;
}

export function ApiKeySettings({ 
  apiKey, 
  setUserProfile, 
  userProfile 
}: ApiKeySettingsProps) {
  const [metalPriceApiKey, setMetalPriceApiKey] = useState(apiKey || '');
  const [isSaving, setIsSaving] = useState(false);
  const updateTimeoutRef = useRef<number | undefined>(undefined);
  const initialValueRef = useRef(apiKey || '');
  const isMountedRef = useRef(true);
  
  // تنظيف المؤقتات عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      if (updateTimeoutRef.current !== undefined) {
        window.clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = undefined;
      }
    };
  }, []);

  // تحديث القيمة عند تغيير المدخلات الخارجية
  useEffect(() => {
    // تحديث القيمة فقط إذا كانت مختلفة عن القيمة الحالية
    if (apiKey !== metalPriceApiKey && apiKey !== undefined) {
      setMetalPriceApiKey(apiKey || '');
      initialValueRef.current = apiKey || '';
    }
  }, [apiKey, metalPriceApiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMetalPriceApiKey(newValue);

    // إلغاء المؤقت السابق إذا كان موجودًا
    if (updateTimeoutRef.current !== undefined) {
      window.clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = undefined;
    }

    // نتحقق أولاً إذا كان المفتاح قد تغير فعلاً وليس فارغًا
    if (newValue && newValue !== userProfile.metalPriceApiKey && newValue.length > 10) {
      // إعداد مؤقت جديد للتحديث بتأخير أطول
      updateTimeoutRef.current = window.setTimeout(() => {
        if (!isMountedRef.current) return;
        
        setIsSaving(true);
        try {
          // فقط نقوم بتحديث الملف الشخصي بدون عمليات حفظ مباشرة في قاعدة البيانات
          setUserProfile({
            ...userProfile,
            metalPriceApiKey: newValue
          });
          
          // نعرض رسالة نجاح بدون حفظ مباشر للقاعدة
          toast.success("تم تحديث مفتاح API. اضغط على حفظ التغييرات لتأكيد التحديث");
        } catch (error) {
          console.error("Error updating API key:", error);
          if (isMountedRef.current) {
            toast.error("حدث خطأ أثناء تحديث مفتاح API");
          }
        } finally {
          if (isMountedRef.current) {
            setIsSaving(false);
          }
        }
      }, 3000); // تأخير أطول لتقليل عدد التحديثات
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="metalPriceApiKey">مفتاح Metal Price API</Label>
      <Input
        id="metalPriceApiKey"
        placeholder="أدخل مفتاح Metal Price API"
        value={metalPriceApiKey}
        onChange={handleApiKeyChange}
        className="font-mono text-sm"
        disabled={isSaving}
      />
      <p className="text-xs text-muted-foreground">
        المفتاح الحالي: {isSaving ? "جاري الحفظ..." : (metalPriceApiKey ? metalPriceApiKey.substring(0, 8) + "..." : "غير محدد")}
      </p>
    </div>
  );
}
