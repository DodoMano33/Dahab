
import { useState, useEffect } from "react";
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
  
  // تحديث القيمة عند تغيير المدخلات الخارجية
  useEffect(() => {
    if (apiKey !== metalPriceApiKey && apiKey !== undefined) {
      setMetalPriceApiKey(apiKey || '');
    }
  }, [apiKey, metalPriceApiKey]);

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setMetalPriceApiKey(newValue);
  };
  
  const handleSaveKey = () => {
    if (!metalPriceApiKey || metalPriceApiKey === userProfile.metalPriceApiKey) return;
    
    setIsSaving(true);
    try {
      setUserProfile({
        ...userProfile,
        metalPriceApiKey: metalPriceApiKey
      });
      
      toast.success("تم تحديث مفتاح API. اضغط على حفظ التغييرات لتأكيد التحديث", { duration: 1000 });
    } catch (error) {
      console.error("Error updating API key:", error);
      toast.error("حدث خطأ أثناء تحديث مفتاح API", { duration: 1000 });
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="metalPriceApiKey">مفتاح Metal Price API</Label>
      <div className="flex gap-2">
        <Input
          id="metalPriceApiKey"
          placeholder="أدخل مفتاح Metal Price API"
          value={metalPriceApiKey}
          onChange={handleApiKeyChange}
          className="font-mono text-sm"
          disabled={isSaving}
          onBlur={handleSaveKey}
        />
      </div>
      <p className="text-xs text-muted-foreground">
        المفتاح الحالي: {isSaving ? "جاري الحفظ..." : (metalPriceApiKey ? metalPriceApiKey.substring(0, 8) + "..." : "غير محدد")}
      </p>
    </div>
  );
}
