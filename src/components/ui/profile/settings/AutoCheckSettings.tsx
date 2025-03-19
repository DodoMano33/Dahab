
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
  const [intervalId, setIntervalId] = useState<number | undefined>(undefined);

  // تنظيف المؤقت عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
  }, [intervalId]);

  // إعداد الفحص التلقائي عند تغيير الحالة
  useEffect(() => {
    const setupAutoCheck = () => {
      try {
        // تنظيف المؤقت السابق إذا كان موجودًا
        if (intervalId !== undefined) {
          window.clearInterval(intervalId);
          setIntervalId(undefined);
        }

        if (userProfile.autoCheckEnabled) {
          // تنفيذ الفحص مرة واحدة عند التفعيل
          const checkFunction = () => {
            try {
              // إرسال حدث مخصص بدلاً من استدعاء وظيفة مباشرة
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
          
          // تنفيذ فحص أولي
          checkFunction();
          
          // إعداد المؤقت مع فترة ثابتة لمنع المشكلات
          const newIntervalId = window.setInterval(checkFunction, 5 * 60 * 1000);
          setIntervalId(newIntervalId);
        }
      } catch (error) {
        console.error("Error setting up auto-check:", error);
      }
    };
    
    setupAutoCheck();
    
    // تنظيف عند إلغاء التحميل
    return () => {
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
        setIntervalId(undefined);
      }
    };
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
