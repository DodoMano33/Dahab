import { useState, useEffect } from 'react';
import { differenceInHours, differenceInMinutes, differenceInSeconds, addHours } from 'date-fns';
import { supabase } from '@/lib/supabase';

export const useExpiryTimer = (
  date: Date,
  id: string,
  analysis_expiry_date?: Date
) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      if (!analysis_expiry_date) {
        const expiryDate = addHours(new Date(date), 36);
        analysis_expiry_date = expiryDate;
      }

      const now = new Date();
      const expiryDate = new Date(analysis_expiry_date);
      
      if (now >= expiryDate) {
        setIsExpired(true);
        const deleteExpiredAnalysis = async () => {
          try {
            const { error } = await supabase
              .from('search_history')
              .delete()
              .eq('id', id);

            if (error) {
              console.error("Error deleting expired analysis:", error);
            }
          } catch (error) {
            console.error("Error in deleteExpiredAnalysis:", error);
          }
        };
        deleteExpiredAnalysis();
        return;
      }

      const hoursLeft = differenceInHours(expiryDate, now);
      const minutesLeft = differenceInMinutes(expiryDate, now) % 60;
      const secondsLeft = differenceInSeconds(expiryDate, now) % 60;

      const formattedHours = String(hoursLeft).padStart(2, '0');
      const formattedMinutes = String(minutesLeft).padStart(2, '0');
      const formattedSeconds = String(secondsLeft).padStart(2, '0');
      setTimeLeft(`${formattedHours}:${formattedMinutes}:${formattedSeconds}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [analysis_expiry_date, date, id]);

  return { timeLeft, isExpired };
};