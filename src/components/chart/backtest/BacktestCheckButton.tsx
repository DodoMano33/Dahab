
import { memo, useEffect, useState } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";
import { AlertCircle, AlertTriangle, RefreshCw, Server, Wifi, WifiOff } from "lucide-react";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime, retryCount } = useBackTest();
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [nextAutoCheck, setNextAutoCheck] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);
  const [hasNetworkError, setHasNetworkError] = useState(false);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [networkStatus, setNetworkStatus] = useState<'online' | 'offline' | 'limited'>('online');
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>({});

  // التحقق من حالة الاتصال بالإنترنت
  useEffect(() => {
    const updateNetworkStatus = () => {
      if (navigator.onLine) {
        // إجراء اختبار سريع للاتصال للتأكد من أنه ليس اتصالًا محدودًا
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

  // جمع معلومات تشخيصية
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

  // الاستماع إلى تحديثات السعر من TradingView
  useEffect(() => {
    const handlePriceUpdate = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('BacktestCheckButton: Price updated to', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };

    window.addEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
    
    // طلب السعر الحالي فور تحميل المكون
    window.dispatchEvent(new Event('request-current-price'));
    
    // الاستماع لرد السعر الحالي
    const handleCurrentPriceResponse = (event: CustomEvent) => {
      if (event.detail && event.detail.price) {
        console.log('BacktestCheckButton: Received current price', event.detail.price);
        setCurrentPrice(event.detail.price);
        setPriceUpdateCount(prev => prev + 1);
      }
    };
    
    window.addEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
    
    // الاستماع لفشل فحص التحليلات
    const handleCheckFailure = (event: CustomEvent) => {
      const errorMsg = event.detail?.error || 'خطأ غير معروف';
      console.error("Analysis check failed:", errorMsg, event.detail);
      setHasNetworkError(true);
      setErrorDetails(errorMsg);
      toast.error(`فشل في فحص التحليلات: ${errorMsg}`);
    };
    
    window.addEventListener('analyses-check-failed', handleCheckFailure as EventListener);
    
    // إعادة طلب السعر الحالي كل 30 ثانية كإجراء احتياطي
    const priceRefreshInterval = setInterval(() => {
      window.dispatchEvent(new Event('request-current-price'));
    }, 30000);
    
    return () => {
      window.removeEventListener('tradingview-price-update', handlePriceUpdate as EventListener);
      window.removeEventListener('current-price-response', handleCurrentPriceResponse as EventListener);
      window.removeEventListener('analyses-check-failed', handleCheckFailure as EventListener);
      clearInterval(priceRefreshInterval);
    };
  }, []);

  useEffect(() => {
    if (!lastCheckTime) return;
    
    const updateFormattedTime = () => {
      try {
        console.log("Formatting time from:", lastCheckTime);
        if (!(lastCheckTime instanceof Date) || isNaN(lastCheckTime.getTime())) {
          console.error("Invalid date object:", lastCheckTime);
          return;
        }
        
        const formatted = formatDistanceToNow(lastCheckTime, { 
          addSuffix: true, 
          locale: ar 
        });
        setFormattedTime(formatted);
        
        // تحديث الوقت المتبقي للفحص التلقائي التالي (10 ثوانٍ)
        const nextCheckTime = new Date(lastCheckTime.getTime() + 10 * 1000);
        const now = new Date();
        
        // التحقق مما إذا كان الوقت المتبقي سالبًا (تم تجاوزه)
        if (nextCheckTime > now) {
          const timeUntilNextCheck = formatDistanceToNow(nextCheckTime, { 
            addSuffix: false, 
            locale: ar 
          });
          setNextAutoCheck(timeUntilNextCheck);
        } else {
          setNextAutoCheck("جاري التنفيذ...");
        }
      } catch (error) {
        console.error("Error formatting last check time:", error, lastCheckTime);
      }
    };
    
    updateFormattedTime();
    
    // تحديث الوقت كل ثانية
    const interval = setInterval(updateFormattedTime, 1000);
    return () => clearInterval(interval);
  }, [lastCheckTime]);

  useEffect(() => {
    const handleHistoryUpdate = (event: Event) => {
      const customEvent = event as CustomEvent;
      if (customEvent.detail?.timestamp) {
        console.log("BacktestCheckButton detected history update with timestamp:", customEvent.detail.timestamp);
        setHasNetworkError(false);
        setErrorDetails(null);
      } else {
        console.log("BacktestCheckButton detected history update event");
      }
    };
    
    window.addEventListener('historyUpdated', handleHistoryUpdate);
    return () => {
      window.removeEventListener('historyUpdated', handleHistoryUpdate);
    };
  }, []);

  const handleTriggerManualCheck = () => {
    console.log('Manual check triggered with current price:', currentPrice);
    triggerManualCheck();
    setHasNetworkError(false);
    setErrorDetails(null);
  };

  // تصنيف حالة اتصال المستخدم
  const getConnectionStatusIcon = () => {
    if (networkStatus === 'offline') {
      return <WifiOff size={16} className="text-red-500" />;
    } else if (networkStatus === 'limited') {
      return <Wifi size={16} className="text-yellow-500" />;
    } else {
      return <Wifi size={16} className="text-green-500" />;
    }
  };

  return (
    <div className={`flex justify-between items-center p-3 rounded-lg border ${hasNetworkError ? 'bg-red-50 border-red-200' : 'bg-muted/30'}`}>
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">فحص التحليلات</h3>
        <div className="flex items-center gap-1 text-muted-foreground text-sm">
          <Server size={14} /> 
          حالة الاتصال: {getConnectionStatusIcon()}
          <span>{networkStatus === 'online' ? 'متصل' : networkStatus === 'limited' ? 'اتصال محدود' : 'غير متصل'}</span>
        </div>
        {hasNetworkError && (
          <div className="flex items-center text-red-500 text-xs mt-1 gap-1">
            <AlertCircle size={14} />
            <span>حدث خطأ في الاتصال: {errorDetails || 'خطأ غير معروف'}</span>
          </div>
        )}
        {formattedTime && (
          <p className="text-xs text-muted-foreground mt-1">
            آخر فحص: {formattedTime}
          </p>
        )}
        {nextAutoCheck && !hasNetworkError && (
          <p className="text-xs text-muted-foreground mt-1">
            الفحص التلقائي التالي بعد: {nextAutoCheck}
          </p>
        )}
        {currentPrice ? (
          <p className="text-xs font-semibold text-green-600 mt-1">
            السعر الحالي: {currentPrice} (تم التحديث {priceUpdateCount} مرة)
          </p>
        ) : (
          <p className="text-xs font-semibold text-yellow-600 mt-1">
            بانتظار السعر... (سيتم المحاولة مجددًا)
          </p>
        )}
        {retryCount > 0 && (
          <div className="flex items-center text-yellow-600 text-xs mt-1 gap-1">
            <RefreshCw size={14} className="animate-spin" />
            <span>محاولة إعادة الاتصال ({retryCount})...</span>
          </div>
        )}
        {(hasNetworkError || networkStatus !== 'online') && (
          <div className="flex items-center text-xs mt-1 gap-1 text-blue-600 cursor-pointer hover:underline" 
               onClick={() => toast.info('معلومات تشخيصية', {
                 description: Object.entries(diagnosticInfo).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
               })}>
            <AlertTriangle size={14} />
            <span>عرض معلومات تشخيصية</span>
          </div>
        )}
      </div>
      <button
        onClick={handleTriggerManualCheck}
        disabled={isLoading || networkStatus === 'offline'}
        className={`bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md ${
          isLoading || networkStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        } flex items-center gap-2`}
      >
        {isLoading && <RefreshCw size={16} className="animate-spin" />}
        {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
      </button>
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
