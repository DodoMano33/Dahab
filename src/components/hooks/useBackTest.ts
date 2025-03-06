
import { useState } from "react";

interface BackTestConfig {
  interval: number;
  isAutoCheckEnabled: boolean;
}

export const useBackTest = () => {
  const [isLoading] = useState(false);
  const [lastCheckTime] = useState<Date | null>(null);
  const [autoCheckConfig] = useState<BackTestConfig>({
    interval: 30,
    isAutoCheckEnabled: false
  });
  
  // Empty function that preserves the interface but doesn't do anything
  const triggerManualCheck = () => {
    console.log("فحص الآن - تم إيقاف الوظيفة");
  };
  
  // Empty function that preserves the interface
  const updateAutoCheckConfig = () => {};
  
  // Empty function that preserves the interface
  const toggleAutoCheck = () => {};

  return {
    triggerManualCheck,
    isLoading,
    lastCheckTime,
    autoCheckConfig,
    updateAutoCheckConfig,
    toggleAutoCheck
  };
};
