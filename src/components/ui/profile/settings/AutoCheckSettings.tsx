
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
  const initialCheckTimeoutRef = useRef<number | undefined>(undefined);
  const [isActive, setIsActive] = useState(userProfile.autoCheckEnabled);

  // تنظيف المؤقت عند إلغاء تحميل المكون
  useEffect(() => {
    return () => {
      console.log('Cleaning up AutoCheckSettings timers');
      
      if (intervalIdRef.current !== undefined) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
      }
      
      if (initialCheckTimeoutRef.current !== undefined) {
        window.clearTimeout(initialCheckTimeoutRef.current);
        initialCheckTimeoutRef.current = undefined;
      }
    };
  }, []);

  // إعداد الفحص التلقائي عند تغيير الحالة
  useEffect(() => {
    // تحديث الحالة المحلية عند تغيير الحالة الخارجية
    setIsActive(userProfile.autoCheckEnabled);
    
    const setupAutoCheck = () => {
      // تنظيف المؤقت السابق إذا كان موجودًا
      if (intervalIdRef.current !== undefined) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
      }
      
      if (initialCheckTimeoutRef.current !== undefined) {
        window.clearTimeout(initialCheckTimeoutRef.current);
        initialCheckTimeoutRef.current = undefined;
      }

      if (userProfile.autoCheckEnabled) {
        try {
          // تنفيذ الفحص مرة واحدة عند التفعيل بعد تأخير قصير
          const checkFunction = () => {
            try {
              // فحص إذا كان المكون لا يزال موجودًا في DOM
              if (document.hidden) {
                console.log('App is in background, skipping check');
                return;
              }
              
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
          
          // تنفيذ فحص أولي بعد فترة أطول (3 ثواني) لضمان استقرار التطبيق
          initialCheckTimeoutRef.current = window.setTimeout(() => {
            console.log('Executing initial check after settings change');
            checkFunction();
          }, 3000);
          
          // إعداد المؤقت مع فترة أطول لتقليل الضغط على الخادم
          const checkInterval = 300000; // 5 دقائق
          intervalIdRef.current = window.setInterval(checkFunction, checkInterval);
        } catch (error) {
          console.error("Error setting up auto-check:", error);
        }
      }
    };
    
    setupAutoCheck();
    
    // تنظيف المؤقتات عند تغيير الإعدادات
    return () => {
      if (intervalIdRef.current !== undefined) {
        window.clearInterval(intervalIdRef.current);
        intervalIdRef.current = undefined;
      }
      
      if (initialCheckTimeoutRef.current !== undefined) {
        window.clearTimeout(initialCheckTimeoutRef.current);
        initialCheckTimeoutRef.current = undefined;
      }
    };
  }, [userProfile.autoCheckEnabled, userProfile.autoCheckInterval]);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    setUserProfile({ ...userProfile, autoCheckEnabled: checked });
    if (checked) {
      toast.success("تم تفعيل الفحص التلقائي");
    } else {
      toast.info("تم إيقاف الفحص التلقائي");
    }
  };

  return (
    <>
      <FeatureToggle
        enabled={isActive}
        onToggle={handleToggle}
        title="الفحص التلقائي"
        description="فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية"
        defaultChecked={true}
      />
      
      {isActive && (
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
