
import { useState } from "react";

export const useBackTest = () => {
  const [isLoading] = useState(false);
  const [lastCheckTime] = useState<Date | null>(null);
  
  // إرجاع واجهة فارغة فقط للاحتفاظ بالتوافق
  return {
    triggerManualCheck: () => {},
    isLoading,
    lastCheckTime,
    autoCheckConfig: {
      interval: 30,
      isAutoCheckEnabled: false
    },
    updateAutoCheckConfig: () => {},
    toggleAutoCheck: () => {}
  };
};
