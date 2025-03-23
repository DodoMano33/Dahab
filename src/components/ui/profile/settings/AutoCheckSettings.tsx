
import { useState } from "react";
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
  const [isActive, setIsActive] = useState(userProfile.autoCheckEnabled);

  const handleToggle = (checked: boolean) => {
    setIsActive(checked);
    setUserProfile({ ...userProfile, autoCheckEnabled: checked });
    
    if (checked) {
      toast.success("تم تفعيل الفحص التلقائي", { duration: 1000 });
    } else {
      toast.info("تم إيقاف الفحص التلقائي", { duration: 1000 });
    }
  };

  return (
    <>
      <FeatureToggle
        enabled={isActive}
        onToggle={handleToggle}
        title="الفحص التلقائي"
        description="فحص تلقائي للتحليلات ومقارنتها بالأسعار الحالية"
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
