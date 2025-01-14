import { useEffect } from 'react';
import { toast } from 'sonner';

export const useBackTest = () => {
  useEffect(() => {
    console.log('BackTest monitoring is now handled by Supabase Edge Function');
    toast.success('تم تفعيل نظام المراقبة المستمر للتحليلات');
  }, []);

  return null;
};