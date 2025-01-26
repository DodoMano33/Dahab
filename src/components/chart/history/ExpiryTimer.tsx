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
  const [deletionTimeout, setDeletionTimeout] = useState<NodeJS.Timeout | null>(null);

  const deleteAnalysis = async () => {
    try {
      console.log('Deleting expired analysis:', analysisId);
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
    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(createdAt);
      expiryDate.setHours(expiryDate.getHours() + (durationHours || 24));

      if (now >= expiryDate) {
        if (!isExpired) {
          setIsExpired(true);
          setTimeLeft("منتهي");
          
          // حذف التحليل بعد 5 دقائق من انتهاء صلاحيته
          const timeout = setTimeout(() => {
            deleteAnalysis();
          }, 5 * 60 * 1000); // 5 دقائق بالميلي ثانية
          
          setDeletionTimeout(timeout);
        }
        return;
      }

      const hoursLeft = differenceInHours(expiryDate, now);
      const minutesLeft = differenceInMinutes(expiryDate, now) % 60;
      const secondsLeft = differenceInSeconds(expiryDate, now) % 60;

      setTimeLeft(`${String(hoursLeft).padStart(2, '0')}:${String(minutesLeft).padStart(2, '0')}:${String(secondsLeft).padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => {
      clearInterval(interval);
      if (deletionTimeout) {
        clearTimeout(deletionTimeout);
      }
    };
  }, [createdAt, isExpired, analysisId, durationHours]);

  return (
    <Badge variant={isExpired ? "destructive" : "secondary"}>
      {timeLeft}
    </Badge>
  );
};