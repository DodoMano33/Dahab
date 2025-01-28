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
    const updateTimer = () => {
      const now = new Date();
      const expiryDate = new Date(createdAt);
      expiryDate.setHours(expiryDate.getHours() + (durationHours || 24));

      if (now >= expiryDate) {
        if (!isExpired) {
          console.log('Analysis expired:', analysisId);
          setIsExpired(true);
          setTimeLeft("منتهي");
          
          // حذف التحليل بعد دقيقة واحدة من انتهاء صلاحيته
          const timeoutId = setTimeout(() => {
            console.log('Executing delete for expired analysis:', analysisId);
            deleteAnalysis();
          }, 60 * 1000); // دقيقة واحدة

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

    const intervalId = setInterval(updateTimer, 1000);
    updateTimer(); // تحديث أولي

    return () => {
      clearInterval(intervalId);
    };
  }, [createdAt, isExpired, analysisId, durationHours]);

  return (
    <Badge variant={isExpired ? "destructive" : "secondary"}>
      {timeLeft}
    </Badge>
  );
};