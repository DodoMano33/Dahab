
import { AlertCircle, AlertTriangle } from "lucide-react";
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
  if (!hasNetworkError && networkStatus === 'online') return null;
  
  return (
    <>
      {hasNetworkError && (
        <div className="flex items-center text-red-500 text-xs mt-1 gap-1">
          <AlertCircle size={14} />
          <span>حدث خطأ في الاتصال: {errorDetails || 'خطأ غير معروف'}</span>
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
