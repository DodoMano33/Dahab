
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
