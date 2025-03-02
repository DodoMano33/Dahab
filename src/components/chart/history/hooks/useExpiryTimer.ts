
import { useState, useEffect } from "react";
import { addHours, differenceInMinutes, differenceInHours, differenceInSeconds } from "date-fns";
import { isMarketOpen } from "../utils/marketStatus";

interface UseExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
  symbol?: string;  // Added symbol prop to check market status
}

export const useExpiryTimer = ({ 
  createdAt, 
  analysisId, 
  durationHours = 8,
  symbol = "GOLD"  // Default to GOLD if not provided
}: UseExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [lastCheckTime, setLastCheckTime] = useState<number>(Date.now());
  const [expiryTimestamp, setExpiryTimestamp] = useState<number>(0);

  useEffect(() => {
    // إضافة ساعات إلى تاريخ الإنشاء لحساب تاريخ الانتهاء
    const expiryDate = addHours(new Date(createdAt), durationHours);
    setExpiryTimestamp(expiryDate.getTime());
    
    let pausedTime = 0;
    let marketCheckInterval: NodeJS.Timeout;
    let countdownInterval: NodeJS.Timeout;
    
    // Function to check market status every 5 minutes
    const checkMarketStatus = async () => {
      const now = Date.now();
      const isOpen = await isMarketOpen(symbol);
      
      if (!isOpen && !isPaused) {
        // Market closed, pause the timer
        setIsPaused(true);
        clearInterval(countdownInterval);
        console.log(`Market closed for ${symbol}, pausing countdown for analysis ${analysisId}`);
      } else if (isOpen && isPaused) {
        // Market opened, resume the timer
        setIsPaused(false);
        
        // Calculate how long we were paused
        const pauseDuration = now - lastCheckTime;
        pausedTime += pauseDuration;
        
        // Extend expiry date by the paused duration
        setExpiryTimestamp(prev => prev + pauseDuration);
        
        // Restart countdown
        startCountdown();
        console.log(`Market opened for ${symbol}, resuming countdown for analysis ${analysisId}`);
      }
      
      setLastCheckTime(now);
    };
    
    // Function to calculate and update the time left
    const calculateTimeLeft = () => {
      const now = new Date();
      const diff = expiryTimestamp - now.getTime();
      
      // إذا كان الوقت قد انتهى
      if (diff <= 0) {
        setIsExpired(true);
        setTimeLeft("منتهي");
        clearInterval(countdownInterval);
        return;
      }
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`);
    };
    
    // Function to start the countdown interval
    const startCountdown = () => {
      calculateTimeLeft();
      countdownInterval = setInterval(calculateTimeLeft, 1000);
    };
    
    // Initial market check and start intervals
    const initialize = async () => {
      await checkMarketStatus();
      if (!isPaused) {
        startCountdown();
      }
      marketCheckInterval = setInterval(checkMarketStatus, 5 * 60 * 1000); // Check every 5 minutes
    };
    
    initialize();
    
    return () => {
      clearInterval(countdownInterval);
      clearInterval(marketCheckInterval);
    };
  }, [createdAt, durationHours, symbol, analysisId]);
  
  return { timeLeft, isExpired, isPaused };
};
