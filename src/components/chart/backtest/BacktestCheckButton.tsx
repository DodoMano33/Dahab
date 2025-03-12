
import { memo, useEffect, useState } from "react";
import { useBackTest } from "@/components/hooks/useBackTest";
import { formatDistanceToNow } from "date-fns";
import { ar } from "date-fns/locale";
import { toast } from "sonner";

export const BacktestCheckButton = memo(() => {
  const { triggerManualCheck, isLoading, lastCheckTime } = useBackTest();
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [nextAutoCheck, setNextAutoCheck] = useState<string>("");
  const [currentPrice, setCurrentPrice] = useState<number | null>(null);
  const [priceUpdateCount, setPriceUpdateCount] = useState<number>(0);

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
      toast.error(`فشل في فحص التحليلات: ${event.detail?.error || 'خطأ غير معروف'}`);
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
  };

  return (
    <div className="flex justify-between items-center bg-muted/30 p-3 rounded-lg border">
      <div className="flex flex-col">
        <h3 className="text-lg font-medium">فحص التحليلات</h3>
        <p className="text-muted-foreground text-sm">فحص التحليلات الحالية ومقارنتها بالأسعار الحالية</p>
        {formattedTime && (
          <p className="text-xs text-muted-foreground mt-1">
            آخر فحص: {formattedTime}
          </p>
        )}
        {nextAutoCheck && (
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
      </div>
      <button
        onClick={handleTriggerManualCheck}
        disabled={isLoading}
        className={`bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md ${
          isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
      </button>
    </div>
  );
});

BacktestCheckButton.displayName = 'BacktestCheckButton';
