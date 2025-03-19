
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckButtonProps = {
  isLoading: boolean;
  networkStatus: 'online' | 'offline' | 'limited';
  onClick: () => void;
};

export const CheckButton = ({ isLoading, networkStatus, onClick }: CheckButtonProps) => {
  const handleClick = () => {
    if (!isLoading && networkStatus !== 'offline') {
      onClick();
    }
  };

  // تحسين الألوان والحالات المرئية للزر
  const getButtonStyle = () => {
    if (isLoading) {
      return 'bg-slate-700 hover:bg-slate-800 text-white';
    }
    if (networkStatus === 'offline') {
      return 'bg-gray-400 hover:bg-gray-400 cursor-not-allowed opacity-70';
    }
    if (networkStatus === 'limited') {
      return 'bg-amber-500 hover:bg-amber-600';
    }
    return 'bg-indigo-600 hover:bg-indigo-700 text-white';
  };

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || networkStatus === 'offline'}
      className={`px-4 py-2 rounded-md transition-all ${getButtonStyle()} flex items-center gap-2 min-w-[120px] justify-center`}
    >
      {isLoading ? (
        <>
          <RefreshCw size={16} className="animate-spin" />
          جاري الفحص...
        </>
      ) : (
        'فحص الآن'
      )}
    </Button>
  );
};
