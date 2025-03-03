
import { useState, useEffect } from "react";
import { addHours, differenceInMinutes, differenceInHours, differenceInSeconds } from "date-fns";

interface UseExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
}

export const useExpiryTimer = ({ createdAt, analysisId, durationHours = 8 }: UseExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);

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
    
    // تحديث الوقت المتبقي كل ثانية
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    
    return () => clearInterval(timer);
  }, [createdAt, durationHours]);
  
  return { timeLeft, isExpired };
};
