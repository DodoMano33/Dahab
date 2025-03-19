
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

  // تنظيف المؤقتات عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        window.clearTimeout(updateTimeoutRef.current);
        updateTimeoutRef.current = undefined;
      }
    };
  }, []);

  // تحديث القيمة عند تغيير المدخلات الخارجية
  useEffect(() => {
    setMetalPriceApiKey(apiKey || '');
  }, [apiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMetalPriceApiKey(newValue);

    // إلغاء المؤقت السابق إذا كان موجودًا
    if (updateTimeoutRef.current) {
      window.clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = undefined;
    }

    // نتحقق أولاً إذا كان المفتاح قد تغير فعلاً وليس فارغًا
    if (newValue && newValue !== userProfile.metalPriceApiKey && newValue.length > 10) {
      // إعداد مؤقت جديد للتحديث
      updateTimeoutRef.current = window.setTimeout(() => {
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
          toast.error("حدث خطأ أثناء تحديث مفتاح API");
        } finally {
          setIsSaving(false);
        }
      }, 1000);
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
