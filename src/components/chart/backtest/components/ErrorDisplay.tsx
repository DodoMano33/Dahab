
import { AlertCircle, AlertTriangle, WifiOff } from "lucide-react";
import { toast } from "sonner";

type ErrorDisplayProps = {
  hasNetworkError: boolean;
  errorDetails: string | null;
  diagnosticInfo: any;
  networkStatus: 'online' | 'offline' | 'limited';
};

export const ErrorDisplay = ({ 
  hasNetworkError, 
  errorDetails, 
  diagnosticInfo,
  networkStatus
}: ErrorDisplayProps) => {
  // عرض خطأ الاتصال فقط إذا كان هناك خطأ أو إذا كان الاتصال غير متوفر
  if (!hasNetworkError && networkStatus === 'online') return null;
  
  // تحسين عرض أخطاء الاتصال بالشبكة
  const getErrorMessage = () => {
    if (networkStatus === 'offline') {
      return 'لا يوجد اتصال بالإنترنت';
    }
    
    if (errorDetails) {
      if (errorDetails.includes('Failed to fetch') || errorDetails.includes('تعذر الوصول')) {
        return 'تعذر الوصول للخادم - تحقق من اتصالك بالإنترنت';
      }
      return errorDetails;
    }
    
    return 'خطأ غير معروف';
  };
  
  const getErrorIcon = () => {
    if (networkStatus === 'offline') {
      return <WifiOff size={14} />;
    }
    return <AlertCircle size={14} />;
  };
  
  return (
    <>
      {(hasNetworkError || networkStatus !== 'online') && (
        <div className="flex items-center text-red-500 text-xs mt-1 gap-1">
          {getErrorIcon()}
          <span>حدث خطأ في الاتصال: {getErrorMessage()}</span>
        </div>
      )}
      
      <div className="flex items-center text-xs mt-1 gap-1 text-blue-600 cursor-pointer hover:underline" 
           onClick={() => toast.info('معلومات تشخيصية', {
             description: Object.entries(diagnosticInfo).map(([key, value]) => `${key}: ${JSON.stringify(value)}`).join('\n')
           })}>
        <AlertTriangle size={14} />
        <span>عرض معلومات تشخيصية</span>
      </div>
    </>
  );
};
