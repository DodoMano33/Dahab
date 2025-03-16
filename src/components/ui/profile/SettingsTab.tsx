
import { NotificationSettings } from "./settings/NotificationSettings";
import { AlphaVantageSettings } from "./settings/AlphaVantageSettings";
import { AdditionalSettings } from "./settings/AdditionalSettings";
import { AutoCheckHandler } from "./settings/AutoCheckHandler";

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
  
  return (
    <div className="grid gap-4 py-4">
      <NotificationSettings
        notificationsEnabled={userProfile.notificationsEnabled}
        autoCheckEnabled={userProfile.autoCheckEnabled}
        onNotificationsChange={(checked) => setUserProfile({ ...userProfile, notificationsEnabled: checked })}
        onAutoCheckChange={(checked) => setUserProfile({ ...userProfile, autoCheckEnabled: checked })}
      />
      
      <AlphaVantageSettings />
      
      <AdditionalSettings resetOnboarding={resetOnboarding} />
      
      {/* Hidden component for handling auto-check functionality */}
      <AutoCheckHandler 
        autoCheckEnabled={userProfile.autoCheckEnabled} 
        autoCheckInterval={userProfile.autoCheckInterval} 
      />
    </div>
  );
}
