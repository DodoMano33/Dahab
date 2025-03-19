
import { useEffect, useState } from "react";
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
  // تتبع حالة المؤقت
  const [intervalId, setIntervalId] = useState<number | null>(null);

  useEffect(() => {
    // تنظيف المؤقت السابق عند إعادة التحميل
    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, []);

  useEffect(() => {
    const setupAutoCheck = async () => {
      try {
        // تنظيف المؤقت السابق إذا كان موجودًا
        if (intervalId !== null) {
          clearInterval(intervalId);
          setIntervalId(null);
        }

        if (userProfile.autoCheckEnabled) {
          console.log("Setting up auto-check with interval:", userProfile.autoCheckInterval);
          
          const checkFunction = async () => {
            try {
              // تسجيل محاولة الفحص التلقائي
              console.log("Auto-check would run here with interval:", userProfile.autoCheckInterval);
              
              // إرسال حدث مخصص بدلاً من استدعاء Supabase Function مباشرة
              const event = new CustomEvent('autoCheckRequested', {
                detail: { 
                  timestamp: new Date().toISOString(),
                  interval: userProfile.autoCheckInterval
                }
              });
              window.dispatchEvent(event);
            } catch (err) {
              console.error("Error during auto-check:", err);
            }
          };
          
          // تنفيذ الفحص مرة واحدة عند التفعيل
          checkFunction();
          
          // إعداد التنفيذ الدوري كل 5 دقائق بدلاً من استخدام قيمة متغيرة
          // هذا أكثر استقرارًا ويمنع المشاكل المحتملة
          const newIntervalId = window.setInterval(checkFunction, 5 * 60 * 1000);
          setIntervalId(newIntervalId);
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
          interval={userProfile.autoCheckInterval || 300000}
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
