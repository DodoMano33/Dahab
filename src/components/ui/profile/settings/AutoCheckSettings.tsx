
import { useEffect, useRef, useState } from "react";
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
  // استخدام مرجع لتخزين معرف المؤقت
  const intervalIdRef = useRef<number | undefined>(undefined);

  // تنظيف المؤقت عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      if (intervalIdRef.current !== undefined) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
      }
    };
  }, []);

  // إعداد الفحص التلقائي عند تغيير الحالة
  useEffect(() => {
    const setupAutoCheck = () => {
      // تنظيف المؤقت السابق إذا كان موجودًا
      if (intervalIdRef.current !== undefined) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
      }

      if (userProfile.autoCheckEnabled) {
        try {
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
          
          // تنفيذ فحص أولي بعد فترة قصيرة
          const initialCheckTimeout = window.setTimeout(() => {
            checkFunction();
          }, 1000);
          
          // إعداد المؤقت مع فترة ثابتة لمنع المشكلات
          const checkInterval = 5 * 60 * 1000; // 5 دقائق
          intervalIdRef.current = window.setInterval(checkFunction, checkInterval);
          
          // تنظيف المؤقت الأولي عند إلغاء التحميل
          return () => {
            window.clearTimeout(initialCheckTimeout);
          };
        } catch (error) {
          console.error("Error setting up auto-check:", error);
        }
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
