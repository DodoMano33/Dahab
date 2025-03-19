
import { useState, useEffect } from 'react';

type NetworkStatusType = 'online' | 'offline' | 'limited';

export const useNetworkStatus = () => {
  const [networkStatus, setNetworkStatus] = useState<NetworkStatusType>(
    navigator.onLine ? 'online' : 'offline'
  );

  useEffect(() => {
    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        // إجراء اختبار سريع للاتصال للتأكد من أنه ليس اتصالاً محدودًا
        fetch('https://www.google.com/favicon.ico', { 
          mode: 'no-cors',
          cache: 'no-store'
        })
          .then(() => setNetworkStatus('online'))
          .catch(() => setNetworkStatus('limited'));
      } else {
        setNetworkStatus('offline');
      }
    };
    
    updateNetworkStatus();
    
    window.addEventListener('online', updateNetworkStatus);
    window.addEventListener('offline', updateNetworkStatus);
    
    const checkInterval = setInterval(updateNetworkStatus, 30000);
    
    return () => {
      window.removeEventListener('online', updateNetworkStatus);
      window.removeEventListener('offline', updateNetworkStatus);
      clearInterval(checkInterval);
    };
  }, []);

  return networkStatus;
};
