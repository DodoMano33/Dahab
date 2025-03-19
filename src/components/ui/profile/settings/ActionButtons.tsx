
import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  resetOnboarding: () => Promise<void>;
}

export function ActionButtons({ resetOnboarding }: ActionButtonsProps) {
  return (
    <div className="space-y-2 pt-4">
      <Button
        variant="outline"
        onClick={resetOnboarding}
        className="w-full"
      >
        إعادة تشغيل جولة التعريف
      </Button>
      
      <Button
        variant="outline"
        className="w-full"
      >
        مسح سجل التحليلات
      </Button>
    </div>
  );
}
