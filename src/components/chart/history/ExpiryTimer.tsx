
import { useEffect, useState } from 'react';
import { differenceInHours, differenceInMinutes, differenceInSeconds } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

interface ExpiryTimerProps {
  createdAt: Date;
  analysisId: string;
  durationHours?: number;
}

export const ExpiryTimer = ({ createdAt, analysisId, durationHours = 24 }: ExpiryTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<string>("");
  const [isExpired, setIsExpired] = useState(false);
  const [isMarketOpen, setIsMarketOpen] = useState(true);

  const checkMarketStatus = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-market-status');
      if (error) throw error;
      return data.isOpen;
    } catch (error) {
      console.error('Error checking market status:', error);
      return true; // افتراضياً السوق مفتوح في حالة الخطأ
    }
  };

  const deleteAnalysis = async () => {
    console.log('Attempting to delete expired analysis:', analysisId);
    try {
      const { error } = await supabase
        .from('search_history')
        .delete()
        .eq('id', analysisId);

      if (error) {
        console.error('Error deleting analysis:', error);
        toast.error('حدث خطأ أثناء حذف التحليل المنتهي');
        return;
      }

      console.log('Successfully deleted expired analysis:', analysisId);
      toast.success('تم حذف التحليل المنتهي');
    } catch (error) {
      console.error('Error in deleteAnalysis:', error);
      toast.error('حدث خطأ أثناء حذف التحليل المنتهي');
    }
  };

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    let marketCheckIntervalId: NodeJS.Timeout;

    const updateTimer = async () => {
      // التحقق من حالة السوق كل 5 دقائق
      const marketStatus = await checkMarketStatus();
      setIsMarketOpen(marketStatus);

      if (!marketStatus) {
        setTimeLeft("السوق مغلق");
        return;
      }

      const now = new Date();
      const expiryDate = new Date(createdAt);
      expiryDate.setHours(expiryDate.getHours() + (durationHours || 24));

      if (now >= expiryDate) {
        if (!isExpired) {
          console.log('Analysis expired:', analysisId);
          setIsExpired(true);
          setTimeLeft("منتهي");
          
          const timeoutId = setTimeout(() => {
            console.log('Executing delete for expired analysis:', analysisId);
            deleteAnalysis();
          }, 60 * 1000);

          return () => {
            clearTimeout(timeoutId);
          };
        }
        return;
      }

      const hoursLeft = differenceInHours(expiryDate, now);
      const minutesLeft = differenceInMinutes(expiryDate, now) % 60;
      const secondsLeft = differenceInSeconds(expiryDate, now) % 60;

      setTimeLeft(`${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`);
    };

    // تحديث الوقت كل ثانية
    intervalId = setInterval(updateTimer, 1000);
    // التحقق من حالة السوق كل 5 دقائق
    marketCheckIntervalId = setInterval(async () => {
      const marketStatus = await checkMarketStatus();
      setIsMarketOpen(marketStatus);
    }, 5 * 60 * 1000);

    updateTimer();

    return () => {
      clearInterval(intervalId);
      clearInterval(marketCheckIntervalId);
    };
  }, [createdAt, isExpired, analysisId, durationHours]);

  return (
    <Badge variant={isExpired ? "destructive" : isMarketOpen ? "secondary" : "outline"}>
      {timeLeft}
    </Badge>
  );
};
