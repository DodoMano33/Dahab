
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

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
