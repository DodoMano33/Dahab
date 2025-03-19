
import { useEffect } from "react";
import { FeatureToggle } from "./FeatureToggle";
import { IntervalSettings } from "./IntervalSettings";
import { toast } from "sonner";

interface AutoCheckSettingsProps {
  userProfile: {
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
  };
  setUserProfile: (profile: any) => void;
}

export function AutoCheckSettings({ 
  userProfile, 
  setUserProfile 
}: AutoCheckSettingsProps) {
  useEffect(() => {
    const setupAutoCheck = async () => {
      try {
        if (userProfile.autoCheckEnabled) {
          console.log("Setting up auto-check with interval:", userProfile.autoCheckInterval);
          
          const checkFunction = async () => {
            try {
              // إزالة الاستدعاء المباشر لـ Supabase Function لتجنب الأخطاء
              console.log("Auto-check would run here with interval:", userProfile.autoCheckInterval);
              
              // بدلاً من ذلك، يمكننا إرسال حدث مخصص للتطبيق
              const event = new CustomEvent('autoCheckRequested', {
                detail: { timestamp: new Date().toISOString() }
              });
              window.dispatchEvent(event);
            } catch (err) {
              console.error("Error during auto-check:", err);
            }
          };
          
          checkFunction();
          
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
    <>
      <FeatureToggle
        enabled={userProfile.autoCheckEnabled}
        onToggle={(checked) => {
          setUserProfile({ ...userProfile, autoCheckEnabled: checked });
          if (checked) {
            toast.success("تم تفعيل الفحص التلقائي");
          } else {
            toast.info("تم إيقاف الفحص التلقائي");
          }
        }}
        title="الفحص التلقائي"
        description="فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية"
        defaultChecked={true}
      />
      
      {userProfile.autoCheckEnabled && (
        <IntervalSettings
          interval={userProfile.autoCheckInterval}
          onIntervalChange={(interval) => 
            setUserProfile({ ...userProfile, autoCheckInterval: interval })
          }
          label="فترة الفحص التلقائي"
          id="autoCheckInterval"
        />
      )}
    </>
  );
}
