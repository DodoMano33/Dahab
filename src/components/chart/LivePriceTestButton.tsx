
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { testLivePrice } from '@/utils/price/api/testLivePrice';
import { Loader2, Check, X } from 'lucide-react';

export const LivePriceTestButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  const handleTestClick = async () => {
    try {
      setIsLoading(true);
      setTestStatus('idle');
      
      const success = await testLivePrice();
      
      setTestStatus(success ? 'success' : 'error');
    } catch (error) {
      console.error('خطأ في اختبار السعر المباشر:', error);
      setTestStatus('error');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Button 
      variant="outline" 
      onClick={handleTestClick}
      disabled={isLoading}
      className={`flex items-center gap-2 ${
        testStatus === 'success' ? 'bg-green-50 text-green-700 border-green-300' : 
        testStatus === 'error' ? 'bg-red-50 text-red-700 border-red-300' : ''
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          جاري اختبار السعر المباشر...
        </>
      ) : testStatus === 'success' ? (
        <>
          <Check className="h-4 w-4 text-green-600" />
          تم جلب السعر بنجاح
        </>
      ) : testStatus === 'error' ? (
        <>
          <X className="h-4 w-4 text-red-600" />
          فشل جلب السعر
        </>
      ) : (
        'اختبار جلب السعر المباشر'
      )}
    </Button>
  );
};
