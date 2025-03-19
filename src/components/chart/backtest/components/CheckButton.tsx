
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

  return (
    <Button
      onClick={handleClick}
      disabled={isLoading || networkStatus === 'offline'}
      variant={isLoading ? "outline" : "default"}
      className={`px-4 py-2 rounded-md ${
        isLoading || networkStatus === 'offline' ? 'opacity-70' : ''
      } flex items-center gap-2`}
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
