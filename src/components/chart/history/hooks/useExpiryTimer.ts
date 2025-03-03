
import { useState, useEffect } from "react";
import { addHours, differenceInMinutes, differenceInHours, differenceInSeconds } from "date-fns";
import { supabase } from "@/lib/supabase";

interface UseExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
  symbol?: string;
}

export const useExpiryTimer = ({ createdAt, analysisId, durationHours = 8, symbol = "XAUUSD" }: UseExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isMarketClosed, setIsMarketClosed] = useState<boolean>(false);

  // Check market status every 5 minutes
  useEffect(() => {
    const checkMarketStatus = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('check-market-status', {
          method: 'POST',
          body: { symbol }
        });

        if (error) {
          console.error('Error checking market status:', error);
          return;
        }

        console.log('Market status response:', data);
        setIsMarketClosed(!data.isOpen);
      } catch (err) {
        console.error('Failed to check market status:', err);
      }
    };

    // Check immediately on component mount
    checkMarketStatus();
    
    // Then check every 5 minutes
    const marketStatusInterval = setInterval(checkMarketStatus, 5 * 60 * 1000);
    
    return () => clearInterval(marketStatusInterval);
  }, [symbol]);

  useEffect(() => {
    // إضافة ساعات إلى تاريخ الإنشاء لحساب تاريخ الانتهاء
    const expiryDate = addHours(new Date(createdAt), durationHours);
    
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();
      
      // إذا كان الوقت قد انتهى
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("منتهي");
        return;
      }
      
      const hours = differenceInHours(expiryDate, now);
      const minutes = differenceInMinutes(expiryDate, now) % 60;
      const seconds = differenceInSeconds(expiryDate, now) % 60;
      
      setTimeLeft(`${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };
    
    // تحديث الوقت المتبقي كل ثانية فقط إذا لم ينته التحليل بعد
    calculateTimeLeft();
    
    let timer: NodeJS.Timeout | null = null;
    
    if (!isExpired && !isMarketClosed) {
      timer = setInterval(calculateTimeLeft, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [createdAt, durationHours, isMarketClosed, isExpired]);
  
  return { timeLeft, isExpired, isMarketClosed };
};
