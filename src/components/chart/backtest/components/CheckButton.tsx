
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

type CheckButtonProps = {
  isLoading: boolean;
  networkStatus: 'online' | 'offline' | 'limited';
  onClick: () => void;
};

export const CheckButton = ({ isLoading, networkStatus, onClick }: CheckButtonProps) => {
  return (
    <Button
      onClick={onClick}
      disabled={isLoading || networkStatus === 'offline'}
      className={`bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md ${
        isLoading || networkStatus === 'offline' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
      } flex items-center gap-2`}
    >
      {isLoading && <RefreshCw size={16} className="animate-spin" />}
      {isLoading ? 'جاري الفحص...' : 'فحص الآن'}
    </Button>
  );
};
