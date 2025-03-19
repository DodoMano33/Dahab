
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
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
  const [metalPriceApiKey, setMetalPriceApiKey] = useState(apiKey || '42ed2fe2e7d1d8f688ddeb027219c766');
  const [isSaving, setIsSaving] = useState(false);

  // نستخدم useEffect لمراقبة تغيرات مفتاح API ولكن بشكل أكثر كفاءة
  useEffect(() => {
    // نتحقق أولاً إذا كان المفتاح قد تغير فعلاً وليس فارغًا
    if (metalPriceApiKey && metalPriceApiKey !== userProfile.metalPriceApiKey && metalPriceApiKey.length > 10) {
      const saveApiKey = async () => {
        setIsSaving(true);
        try {
          // فقط نقوم بتحديث الملف الشخصي بدون عمليات حفظ مباشرة في قاعدة البيانات
          // الحفظ الفعلي سيحدث عند الضغط على زر "حفظ التغييرات" في الشاشة الرئيسية
          setUserProfile({
            ...userProfile,
            metalPriceApiKey
          });
          
          // نعرض رسالة نجاح بدون حفظ مباشر للقاعدة
          toast.success("تم تحديث مفتاح API. اضغط على حفظ التغييرات لتأكيد التحديث");
        } catch (error) {
          console.error("Error updating API key:", error);
          toast.error("حدث خطأ أثناء تحديث مفتاح API");
        } finally {
          setIsSaving(false);
        }
      };
      
      // ننتظر قليلاً قبل الحفظ لتجنب الحفظ المتكرر
      const timeoutId = setTimeout(saveApiKey, 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [metalPriceApiKey]);
  
  return (
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
  );
}
