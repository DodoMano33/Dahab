
import { Wifi, WifiOff } from "lucide-react";

type ConnectionStatusDisplayProps = {
  networkStatus: 'online' | 'offline' | 'limited';
};

export const ConnectionStatusDisplay = ({ networkStatus }: ConnectionStatusDisplayProps) => {
  // تصنيف حالة اتصال المستخدم
  const getConnectionStatusIcon = () => {
    if (networkStatus === 'offline') {
      return <WifiOff size={16} className="text-red-500" />;
    } else if (networkStatus === 'limited') {
      return <Wifi size={16} className="text-yellow-500" />;
    } else {
      return <Wifi size={16} className="text-green-500" />;
    }
  };
  
  return (
    <div className="flex items-center gap-1 text-muted-foreground text-sm">
      {getConnectionStatusIcon()}
      <span>
        {networkStatus === 'online' 
          ? 'متصل' 
          : networkStatus === 'limited' 
            ? 'اتصال محدود' 
            : 'غير متصل'}
      </span>
    </div>
  );
};
