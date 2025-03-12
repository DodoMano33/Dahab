
import { useState, useEffect } from 'react';

export const useDiagnosticInfo = () => {
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});

  useEffect(() => {
    const gatherDiagnosticInfo = () => {
      const connectionInfo = navigator.connection ? {
        effectiveType: navigator.connection.effectiveType,
        downlink: navigator.connection.downlink,
        rtt: navigator.connection.rtt,
        saveData: navigator.connection.saveData
      } : 'not available';
      
      setDiagnosticInfo({
        userAgent: navigator.userAgent,
        connection: connectionInfo,
        time: new Date().toISOString(),
        screenSize: `${window.innerWidth}x${window.innerHeight}`,
        memory: navigator.deviceMemory || 'unknown'
      });
    };
    
    gatherDiagnosticInfo();
    const interval = setInterval(gatherDiagnosticInfo, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return diagnosticInfo;
};
