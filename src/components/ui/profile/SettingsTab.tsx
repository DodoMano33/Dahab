
import { ApiKeySettings } from "./settings/ApiKeySettings";
import { IntervalSettings } from "./settings/IntervalSettings";
import { FeatureToggle } from "./settings/FeatureToggle";
import { AutoCheckSettings } from "./settings/AutoCheckSettings";
import { ActionButtons } from "./settings/ActionButtons";

interface SettingsTabProps {
  userProfile: {
    notificationsEnabled: boolean;
    autoCheckEnabled: boolean;
    autoCheckInterval: number;
    metalPriceApiKey?: string;
    priceUpdateInterval?: number;
  };
  setUserProfile: (profile: any) => void;
  resetOnboarding: () => Promise<void>;
}

export function SettingsTab({ 
  userProfile, 
  setUserProfile,
  resetOnboarding 
}: SettingsTabProps) {
  return (
    <div className="grid gap-4 py-4">
      <ApiKeySettings 
        apiKey={userProfile.metalPriceApiKey || ''} 
        setUserProfile={setUserProfile} 
        userProfile={userProfile}
      />
      
      <IntervalSettings
        interval={userProfile.priceUpdateInterval || 300000}
        onIntervalChange={(interval) => 
          setUserProfile({ ...userProfile, priceUpdateInterval: interval })
        }
        label="فترة تحديث السعر"
        id="priceUpdateInterval"
      />
      
      <FeatureToggle
        enabled={userProfile.notificationsEnabled}
        onToggle={(checked) => 
          setUserProfile({ ...userProfile, notificationsEnabled: checked })
        }
        title="الإشعارات"
        description="تلقي إشعارات عند تحقق الأهداف ووقف الخسارة"
      />
      
      <AutoCheckSettings 
        userProfile={userProfile} 
        setUserProfile={setUserProfile}
      />
      
      <ActionButtons resetOnboarding={resetOnboarding} />
    </div>
  );
}
